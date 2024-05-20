import { useContext } from "react";
import { Project } from "../../store/types";
import { AppContext } from "../../store/app-provider";
import { Types } from "../../store/reducers/projects/actions";
import { Trash } from "react-feather";
export const DeleteProjectButton = ({ project }: { project: Project }) => {
  const { dispatch } = useContext(AppContext);

  const onClick = () => {
    dispatch({ type: Types.Delete, payload: { id: project.id } });
  };

  return (
    <button
      onClick={onClick}
      className="text-red-500 hover:text-red-800 text-center rounded-lg p-1 hover:bg-rose-100"
    >
      <Trash size={16} />
    </button>
  );
};
