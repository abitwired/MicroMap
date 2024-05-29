import { Save } from "react-feather";
import { Types } from "../../store/types";
import { AppContext } from "../../store/app-provider";
import { useContext } from "react";
import { InfiniteCanvas } from "../../canvas/infinite-canvas";
import { Graph } from "../../store/graph";

export const SaveProjectButton = ({
  canvas,
  size = 16,
}: {
  canvas: InfiniteCanvas;
  size?: number;
}) => {
  const { state, dispatch } = useContext(AppContext);

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const project = {
      ...state.app?.currentProject,
      graph: Graph.fromVisualGraph(canvas.graph),
    };

    api.saveProject(project);
    canvas.save();
    dispatch({
      type: Types.Update,
      payload: {
        project,
      },
    });
  };

  return (
    <button
      className="text-blue-500 hover:text-blue-800 text-center rounded-lg p-1 hover:bg-blue-100"
      onClick={onClick}
    >
      <Save size={size} />
    </button>
  );
};

export default SaveProjectButton;
