import { useEffect, useState } from "react";
import AddProjectButton from "./AddProjectButton";
import { Project } from "../../ipc/types";
import { DeleteProjectButton } from "./DeleteProjectButton";

export const Sidebar = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    api.loadProjects().then((projects) => {
      setProjects(projects);
    });
  }, []);

  return (
    <div className="w-1/4 h-full bg-zinc-800 p-4 rounded-md">
      <div className="text-white text-lg font-bold flex">
        <span className="text-large">Projects</span>
        <AddProjectButton />
      </div>
      <ul>
        {projects.map((project) => (
          <li key={project.id} className="text-white text-sm flex">
            {project.name}
            <DeleteProjectButton project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
