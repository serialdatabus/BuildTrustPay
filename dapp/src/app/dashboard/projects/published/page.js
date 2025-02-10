"use client";
import { useEffect, useState } from "react";
import { getDraftprojects, getProjects } from "@/app/helpers";
import Project from "../shared/ProjectComponent";

export default function DraftProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getDraftprojects().then((response) => {
      console.log({response});
      setProjects(response); 
  });
  }, []);

  return (
    <div className="p-4">

        <div>
            <span className="cursor-pointer">
                <a href="/dashboard/projects/addproject" className="underline">Add Project</a>
            </span>
            <span className="cursor-pointer ml-2">
                <a href="/dashboard/draftprojects" className="underline">View Draft Projects</a>
            </span>
        </div>
      <div className="grid grid-cols-8 gap-8 mt-4">
        {projects.map((project) => (
          <Project key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
