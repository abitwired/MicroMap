import { Edit } from "react-feather";

export const EditProjectButton = ({
  setIsEditing,
}: {
  setIsEditing: (isEditing: boolean) => void;
}) => {
  const onClick = () => {
    setIsEditing(true);
  };

  return (
    <button
      className="text-blue-500 hover:text-blue-800 text-center rounded-lg p-1 hover:bg-blue-100"
      onClick={onClick}
    >
      <Edit size={16} />
    </button>
  );
};

export default EditProjectButton;
