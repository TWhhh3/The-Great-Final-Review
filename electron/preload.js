const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("courseApi", {
  readJson(relativePath) {
    return ipcRenderer.invoke("read-app-json", relativePath);
  },
});

window.addEventListener("DOMContentLoaded", () => {
  document.body.dataset.runtime = "electron";
});
