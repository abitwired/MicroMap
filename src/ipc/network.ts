const createProject = global.share.ipcMain.handle("createProject", async () => {
  try {
    // Create a new network
  } catch (err) {
    console.error(err);
    return null;
  }
});

const loadProjects = global.share.ipcMain.handle("loadProjects", async () => {
  try {
    // Load all projects
    console.log("Loading projects");
  } catch (err) {
    console.error(err);
    return null;
  }
});

module.exports = {
  createProject,
  loadProjects,
};
