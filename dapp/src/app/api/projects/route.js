import prisma from "@/app/helpers";

export async function POST(req) {
  let errors = [];

  try {
    // 1️⃣ Pega os dados do corpo da requisição
    const body = await req.json();

    if (!body) {
      errors.push("Request body is empty");

      return new Response(JSON.stringify({ errors, success: false }), {
        status: 400,
      });
    }
    console.log("called body", { body });
    const project_id_to_update = body.project_id_to_update;
    const isUpdate = project_id_to_update > 0;
    const payload = {
      data: {
        creation_date: 0,
        start_date: 0,
        end_date: 0,
        closed: false,
        actual_completion_date: 0,
        name: body.name,
        description: body.description,
        client_id: "" + body.client_id,
        contractor: body.contractor,
        currency: body.currency,
        type: body.type,
      },
    };

    // 2️⃣ Validação: verificar se os campos obrigatórios estão preenchidos
    if (!body.name) {
      errors.push("Fill the project title");

      return new Response(JSON.stringify({ errors, success: true }), {
        status: 400,
      });
    }

    if (isUpdate) {
      console.log("updating project", { project_id_to_update });
      payload.where = {
        id: project_id_to_update,
      };
    } else {
      console.log("creating project");
    }

    const project = await prisma.project[
      project_id_to_update > 0 ? "update" : "create"
    ](payload);

    const milestones = body.milestones ?? [];
    console.log({ milestones });

    if (milestones.length > 0) {
      if (isUpdate) {
        console.log("deleting all stages for project", {
          project_id_to_update,
        });
        await prisma.stage.deleteMany({
          where: {
            project_id: project.id,
          },
        });
      }

      for (let i = 0; i < milestones.length; i++) {
        const {
          id,
          title,
          description,
          validation_steps,
          totalValidators,
          includeAssetTransfer,
          paymentAmountValidator,
          project_id,
          completed,
          totalFunds,
        } = milestones[i];
        await prisma.stage.create({
          data: {
            edit_id: id,
            name: title,
            description,
            project_id: project.id,
            start_date: 0,
            end_date: 0,
            closed: false,
            actual_completion_date: 0,
            validation_steps,
            total_validators: Number(totalValidators),
            amount_per_validator: Number(paymentAmountValidator),
          },
        });
      }
    }

    console.log({ project, milestones });

    // 3️⃣ Aqui você pode salvar no banco de dados ou processar os dados
    // Exemplo: apenas retornamos os dados de volta com uma mensagem de sucesso
    return new Response(
      JSON.stringify({
        success: true,
        errors: [],
        message: "Dados recebidos com sucesso!",
        data: {
          project_id: project.id,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    errors.push("There was an error");
    return new Response(JSON.stringify({ errors, success: false }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  //read the querystrungs type and project_id in a safd way
  const { searchParams }  = (new URL(req.url));

  // Obtém os parâmetros da query string
  const project_id = searchParams.get('project_id');
  const isDraft = searchParams.get('type') === "draft";

  // get all projects from project prisma table where type is draft
  const payload = {};

  if (isDraft) {
    payload.where = {
      type: "draft",
    };
  }

  if (project_id > 0) {
    //verifiy if a whre field already exists before
    if (!payload.where) {
      payload.where = {};
    }

    payload.where.id = Number(project_id);
  }

  let projects = await prisma.project.findMany(payload);
  console.log({ payload, isDraft, project_id });

  // get all milestones for each project
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const milestones = await prisma.stage.findMany({
      where: {
        project_id: project.id,
      },
    });

    projects[i].milestones = milestones;
  }

  // return the projects
  return new Response(JSON.stringify(projects), {
    status: 200,
  });
}
