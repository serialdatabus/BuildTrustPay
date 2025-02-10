"use client";

import EditProject from "../../../shared/EditProjectComponent";
export default function EditProjectForm() {

  const id = window.location.href.split("/").pop();
  return <EditProject edit_project_id={id} contract_address={"0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"} />
}
