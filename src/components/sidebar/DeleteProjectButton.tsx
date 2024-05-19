import { Project } from "../../ipc/types";

export const DeleteProjectButton = ({ project }: { project: Project }) => {
  const deleteProject = async () => {
    await api.deleteProject(project.id);
  };

  return (
    <button onClick={deleteProject} className="text-red-500">
      <svg
        className="w-4 h-4 ml-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </button>
  );
};
