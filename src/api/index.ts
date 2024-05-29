import { ipcRenderer } from "electron";
import { Project } from "../store/types";

export const createProject = () => ipcRenderer.invoke("createProject");
export const loadProjects = () => ipcRenderer.invoke("loadProjects");
export const deleteProject = (id: string) =>
  ipcRenderer.invoke("deleteProject", id);
export const saveProject = (project: Project) =>
  ipcRenderer.invoke("saveProject", project);

export default { createProject, loadProjects, deleteProject, saveProject };
