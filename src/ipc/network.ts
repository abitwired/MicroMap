const createNetwork = global.share.ipcMain.handle("getNamespaces", async () => {
  try {
    // Create a new network
  } catch (err) {
    console.error(err);
    return null;
  }
});

module.exports = {
  createNetwork,
};
