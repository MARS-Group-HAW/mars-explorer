const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const download = require("download");

const OMNISHARP_VERSION = "1.37.15";

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
  default:
    console.info(`Unknown OS: ${os.type()}`);
    process.exit(1);
}
console.info(`> Found ${currentOS}`);

let currentArch: "-x64" | "-x86" | "" = "";

if (currentOS !== "osx") {
  console.info("Determining your architecture ...");

  switch (os.arch()) {
    case "x32":
      currentArch = "-x86";
      break;
    case "x64":
      currentArch = "-x64";
      break;
    default:
      console.info(`Unknown Architecture: ${os.arch()}`);
      process.exit(1);
  }
  console.info(`> Found ${currentArch}`);
}

const pathToOmnisharpOSPath = path.join(pathToOmnisharp, currentOS);

console.info("Checking for omnisharp ...");
if (fs.existsSync(pathToOmnisharpOSPath)) {
  console.info("> Omnisharp found! Exiting ...");
  process.exit(0);
}
console.info("> No omnisharp found.");

console.info("Ensuring that omnisharp dir exits ...");
fs.ensureDirSync(pathToOmnisharpOSPath);

console.info(`Downloading Omnisharp for your OS: ${currentOS}${currentArch}`);

(async () => {
  // TODO: linux and windows x64 and x86
  try {
    await download(
      `https://github.com/OmniSharp/omnisharp-roslyn/releases/download/v${OMNISHARP_VERSION}/omnisharp-${currentOS}${currentArch}.zip`,
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
    console.info("An error occurred while downloading/unzipping omnisharp:");
    console.log(e);
    process.exit(1);
  }
})();
