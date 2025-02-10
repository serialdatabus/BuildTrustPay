import prisma from "@/app/helpers";

export async function POST(req) {
    let errors = [];
    console.log("called");

  try {
    // 1️⃣ Pega os dados do corpo da requisição
    const body = await req.json();

    if (!body) {
        errors.push("Request body is empty");
  
        return new Response(JSON.stringify({ errors, success: false }), {
          status: 400,
        });
      }

    console.log("called body",{body});


    // 2️⃣ Validação: verificar se os campos obrigatórios estão preenchidos
    if (
      !body.name ||
      !body.lastname ||
      !body.email ||
      !body.password ||
      !body.confirmpassword
    ) {
      errors.push("Fill all the fields");

      return new Response(JSON.stringify({ errors, success: true }), {
        status: 400,
      });
    }


    /* insert to database using prisma */
    const user = await prisma.user.create({
      data: {
        name: body.name,
        lastname: body.lastname,
        email: body.email,
        password: body.password,
        wallet_address: "no_wallet",
        }, 
    });

    // 3️⃣ Aqui você pode salvar no banco de dados ou processar os dados
    // Exemplo: apenas retornamos os dados de volta com uma mensagem de sucesso
    return new Response(
      JSON.stringify({
        success: true,
        errors: [],
        message: "Dados recebidos com sucesso!",
        data: body,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error)
    errors.push("There was an error");
    return new Response(JSON.stringify({ errors, success: false }), {
      status: 500,
    });
  }
}
