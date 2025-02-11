"use client";

import EditProject from "../shared/EditProjectComponent";
export default function AddProjectForm() {
  return <EditProject contract_address={process.env.NEXT_PUBLIC_CONTRACT_ADDRESS} />
}
