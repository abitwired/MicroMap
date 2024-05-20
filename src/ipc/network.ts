import { Project } from "../store/types";

const createProject = global.share.ipcMain.handle("createProject", async () => {
  try {
    const fs = require("fs");
    const project = {
      id: new Date().toISOString(),
      name: "New Project",
    };

    const projectPath = `${global.share.appDirectory}/projects/`;
    fs.mkdirSync(projectPath, { recursive: true });

    const filePath = `${projectPath}/${project.id}.json`;
    fs.writeFileSync(filePath, JSON.stringify(project));
    return project;
  } catch (err) {
    console.error(err);
    return null;
  }
});

const loadProjects = global.share.ipcMain.handle("loadProjects", async () => {
  try {
    const fs = require("fs");
    const projectPath = `${global.share.appDirectory}/projects`;
    const promises: Promise<Project>[] = [];

    if (!fs.existsSync(projectPath)) {
      return [];
    }

    const files = fs.readdirSync(projectPath);
    files.forEach((file: string) => {
      promises.push(
        new Promise((resolve, reject) => {
          fs.readFile(`${projectPath}/${file}`, (err: any, data: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.parse(data));
            }
          });
        })
      );
    });

    return Promise.all(promises).then((projects) => {
      return projects;
    });
  } catch (err) {
    console.error(err);
    return null;
  }
});

const deleteProject = global.share.ipcMain.handle(
  "deleteProject",
  async (event: any, id: string) => {
    try {
      const fs = require("fs");
      const projectPath = `${global.share.appDirectory}/projects/${id}.json`;

      if (fs.existsSync(projectPath)) {
        fs.unlinkSync(projectPath);
      }

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
);

module.exports = {
  createProject,
  loadProjects,
  deleteProject,
};
