import { ipcRenderer } from "electron";

export const createProject = () => ipcRenderer.invoke("createProject");
export const loadProjects = () => ipcRenderer.invoke("loadProjects");
export const deleteProject = (id: string) =>
  ipcRenderer.invoke("deleteProject", id);

export default { createProject, loadProjects, deleteProject };
