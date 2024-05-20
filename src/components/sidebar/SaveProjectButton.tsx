import { Save } from "react-feather";
import { Project } from "../../store/types";

export const SaveProjectButton = ({
  project,
  setIsEditing,
}: {
  project: Project;
  setIsEditing: (isEditing: boolean) => void;
}) => {
  const onClick = () => {
    api.saveProject(project);
    setIsEditing(false);
  };

  return (
    <button
      className="text-blue-500 hover:text-blue-800 text-center rounded-lg p-1 hover:bg-blue-100"
      onClick={onClick}
    >
      <Save size={16} />
    </button>
  );
};

export default SaveProjectButton;
