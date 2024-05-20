import { useContext } from "react";
import AddProjectButton from "./AddProjectButton";
import { AppContext } from "../../store/app-provider";
import { ProjectRow } from "./ProjectRow";

export const Sidebar = () => {
  const { state } = useContext(AppContext);

  return (
    <div className="w-2/5 h-full bg-zinc-800 p-4 rounded-md max-lg:mb-2 max-lg:w-full">
      <div className="text-white text-xl font-bold flex mb-2">
        <span className="text-large">Projects</span>
        <AddProjectButton />
      </div>
      <ul>{state.projects.map((project) => ProjectRow(project))}</ul>
    </div>
  );
};

export default Sidebar;
