const { contextBridge, ipcRenderer, webFrame } = require("electron");

contextBridge.exposeInMainWorld("courseApi", {
  readJson(relativePath) {
    return ipcRenderer.invoke("read-app-json", relativePath);
  },
  listMaterialFiles(subjectId, category) {
    return ipcRenderer.invoke("list-material-files", subjectId, category);
  },
  openMaterialFile(subjectId, category, fileName) {
    return ipcRenderer.invoke("open-material-file", subjectId, category, fileName);
  },
  setZoomFactor(factor) {
    webFrame.setZoomFactor(factor);
  },
});

window.addEventListener("DOMContentLoaded", () => {
  document.body.dataset.runtime = "electron";
});
