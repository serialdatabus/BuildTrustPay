"use client";

import EditProject from "../../../shared/EditProjectComponent";
export default function EditProjectForm() {

  const id = window.location.href.split("/").pop();
  return <EditProject edit_project_id={id} contract_address={process.env.NEXT_PUBLIC_CONTRACT_ADDRESS} />
}
