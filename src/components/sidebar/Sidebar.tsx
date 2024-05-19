import { useEffect, useState } from "react";

export const Sidebar = () => {
  const [projects, setProjects] = useState<string[]>([]);

  useEffect(() => {
    api.loadProjects().then((projects) => {
      if (!projects) {
        return;
      }
      setProjects(projects);
    });
  }, []);

  return (
    <div className="w-1/4 h-full bg-zinc-800 p-4 rounded-md">
      <div className="text-white text-lg font-bold">Projects</div>
      <ul>
        {projects.map((project) => (
          <li key={project} className="text-white text-sm">
            {project}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
