import fs = require("fs-extra");

function watchFile(file: string, callback: () => void): void {
  let fsWait = false;
  fs.watch(file, {}, (event, filename) => {
    if (!filename || fsWait) return;

    callback();
    setTimeout(() => {
      fsWait = false;
    }, 100);
    fsWait = true;
  });
}

export default watchFile;
