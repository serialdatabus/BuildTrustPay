"use client";
import { TbContract } from "react-icons/tb";
import { useEffect, useState } from "react";
import { getProjects } from "@/app/helpers";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects().then((response) => setProjects(response));
  }, []);

  return (
    <div className="p-4">

        <div>
            <span className="cursor-pointer">
                <a href="/dashboard/projects/addproject" className="underline">Add Project</a>
            </span>
            <span className="cursor-pointer ml-2">
                <a className="underline">View Draft Projects</a>
            </span>
        </div>
      <div className="grid grid-cols-8 gap-8 mt-4">
        {projects.map((project) => (
          <Project key={project.id} project_id={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

function Project({ project_id }) {
  return (
    <a href={"/dashboard/projects/"+project_id} className="cursor-pointer flex flex-col  items-center transition-transform duration-300 hover:scale-110">
      <span className="flex flex-col rounded-md p-4 bg-blue-300 hover:">
        <TbContract size={60} />
      </span>
      <span>Project</span>
    </a>
  );
}
