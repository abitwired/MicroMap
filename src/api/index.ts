import { ipcRenderer } from "electron";

export const createProject = () => ipcRenderer.invoke("createProject");
export const loadProjects = () => ipcRenderer.invoke("loadProjects");

export default { createProject, loadProjects };
