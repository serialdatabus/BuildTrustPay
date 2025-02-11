import { getContractABI } from "@/app/helpers";
import { ethers } from "ethers";

export async function GET(req) {
  const projects = [];

  const ABI = getContractABI();
  const provider = new ethers.JsonRpcProvider("http://localhost:8545");
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    ABI,
    provider
  );
  const _result = await contract.getProjects();

  for (let i = 0; i < _result.length; i++) {
    const project = _result[i];

    const [
      id,
      name,
      description,
      client_id,
      contractor,
      creation_date,
      start_date,
      end_date,
      actual_completion_date,
      closed,
      stages,
    ] = project;

    projects.push({
      id: Number(id),
      name,
      description,
      client_id: client_id,
      contractor,
      creation_date: Number(creation_date),
      start_date: Number(start_date),
      end_date: Number(end_date),
      actual_completion_date: Number(actual_completion_date),
      closed,
    });
  }

  console.log({ projects });

  return new Response(JSON.stringify(projects), { status: 200 });
}
