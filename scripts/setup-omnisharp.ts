const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const download = require("download");

const OMNISHARP_VERSION = "1.37.12";

const pathToResources = path.join(__dirname, "..", "resources");
const pathToOmnisharp = path.join(pathToResources, "omnisharp");

console.info("Determining your OS ...");
let currentOS: "linux" | "osx" | "win";

switch (os.type()) {
  case "Linux":
    currentOS = "linux";
    break;
  case "Darwin":
    currentOS = "osx";
    break;
  case "Windows_NT":
    currentOS = "win";
    break;
}
console.info(`> Found ${currentOS}`);

const pathToOmnisharpOSPath = path.join(pathToOmnisharp, currentOS);

console.info("Checking for omnisharp ...");
if (fs.existsSync(pathToOmnisharpOSPath)) {
  console.info("> Omnisharp found! Exiting ...");
  process.exit(0);
}
console.info("> No omnisharp found.");

console.info("Ensuring that omnisharp dir exits ...");
fs.ensureDirSync(pathToOmnisharpOSPath);

console.info(`Download Omnisharp for your OS: ${currentOS}`);

(async () => {
  // TODO: linux and windows x64 and x86
  try {
    await download(
      `https://github.com/OmniSharp/omnisharp-roslyn/releases/download/v${OMNISHARP_VERSION}/omnisharp-${currentOS}.zip`,
      pathToOmnisharpOSPath,
      {
        extract: true,
        // workaround https://github.com/kevva/decompress/issues/68
        map: (file: any) => {
          if (file.type === "file" && file.path.endsWith("/")) {
            file.type = "directory";
          }
          return file;
        },
      }
    );
  } catch (e) {
    console.info("An error occurred while download and unzipping omnisharp:");
    console.log(e);
    process.exit(1);
  }
})();
