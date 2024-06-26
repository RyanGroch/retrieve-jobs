// Automatically installs the Curl command line tool for the web application

const fs = require("fs");
const { Readable } = require("stream");
const { finished } = require("stream/promises");
const path = require("path");

const TARGET_DIR = "bin";
const FILE_NAME = "curl";

// Static version of Curl; should work on any major OS
const FILE_URL =
  "https://github.com/moparisthebest/static-curl/releases/latest/download/curl-amd64";

(async () => {
  // Skip installation for desktop version
  if (process.env.TAURI) {
    console.log(
      "Curl is not used on the Tauri build; no need to run installation"
    );
    return;
  }

  const destination = path.resolve(`./${TARGET_DIR}`, FILE_NAME);

  // Skip installation if Curl already exists
  if (fs.existsSync(destination)) {
    console.log(
      `Curl already exists at ${destination}; no need to run installation`
    );
    return;
  }

  // Downloads the contents of Curl
  const fetchResponse = await fetch(FILE_URL);

  // Create directory if it doesn't exist
  if (!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR);

  // Write the contents into the target directory,
  // and give it executable permissions
  const fileStream = fs.createWriteStream(destination, { flags: "wx" });
  await finished(Readable.fromWeb(fetchResponse.body).pipe(fileStream));
  fs.chmodSync(destination, "755");

  console.log(`Installed Curl binary at ${destination}`);
})();
