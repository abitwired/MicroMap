import { useContext } from "react";
import AddProjectButton from "./AddProjectButton";
import { DeleteProjectButton } from "./DeleteProjectButton";
import { AppContext } from "../../store/app-provider";

export const Sidebar = () => {
  const { state } = useContext(AppContext);

  console.log(state);
  return (
    <div className="w-1/4 h-full bg-zinc-800 p-4 rounded-md">
      <div className="text-white text-xl font-bold flex mb-2">
        <span className="text-large">Projects</span>
        <AddProjectButton />
      </div>
      <ul>
        {state.projects.map((project) => (
          <li
            key={project.id}
            className="text-white text-md p-1 flex r flex justify-between items-center hover:bg-zinc-700 rounded-md transition-colors duration-100 ease-in-out hover:cursor-pointer"
          >
            {project.name}
            <DeleteProjectButton project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
