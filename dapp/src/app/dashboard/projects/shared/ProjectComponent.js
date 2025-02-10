import { TbContract } from "react-icons/tb";

export default function Project({ project }) {
    const { id, name } = project;
    return (
      <a href={"/dashboard/projects/draft/edit/"+id} className="cursor-pointer flex flex-col  items-center transition-transform duration-300 hover:scale-110">
        <span className="flex flex-col rounded-md p-4 bg-blue-300 hover:">
          <TbContract size={60} />
        </span>
        <span>{name}</span>
      </a>
    );
  }