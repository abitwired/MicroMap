import { useContext, useEffect, useState } from "react";
import { Project, Types } from "../../store/types";
import { DeleteProjectButton } from "./DeleteProjectButton";
import { EditProjectButton } from "./EditProjectButton";
import { AppContext } from "../../store/app-provider";

export const ProjectRow = ({ project }: { project: Project }) => {
  const { dispatch } = useContext(AppContext);
  const date = new Date(project.updatedAt);
  const [editableProject, setEditableProject] = useState<Project>(project);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const onClick = () => {
    dispatch({
      type: Types.SetCurrentProject,
      payload: {
        project: editableProject,
      },
    });
  };

  let projectName = (
    <p className="leading-tight max-w-[175px]">{editableProject.name}</p>
  );
  if (isEditing) {
    projectName = (
      <input
        type="text"
        className="bg-transparent text-white text-sm w-full"
        value={editableProject.name}
        onChange={(e) => {
          setEditableProject({
            ...editableProject,
            name: e.target.value,
          });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIsEditing(false);
            api.saveProject(editableProject);
          }
        }}
      />
    );
  }

  useEffect(() => {
    if (isEditing) {
      const input = document.querySelector("input");
      input?.focus();
      input.onblur = () => {
        setIsEditing(false);
        api.saveProject(editableProject);
      };
    }
  }, [isEditing]);

  return (
    <li
      key={project.id}
      className="flex items-center justify-between p-2 list-none hover:bg-zinc-700 rounded-md transition-colors duration-100 ease-in-out hover:cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        <div className="flex flex-col justify-center mr-2">
          {projectName}
          <p className="text-xs text-gray-400">{date.toLocaleString()}</p>
        </div>
      </div>
      <div
        className={`flex items-center ${
          isHovering || isEditing ? "" : "hidden"
        }`}
      >
        <EditProjectButton setIsEditing={setIsEditing} />
        <DeleteProjectButton project={editableProject} />
      </div>
    </li>
  );
};
