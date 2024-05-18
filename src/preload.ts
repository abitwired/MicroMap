// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const { contextBridge } = require("electron");
import api from "./api";
contextBridge.exposeInMainWorld("api", api);
