// Automatically installs the Curl command line tool for the web application.
// Detects the host OS and architecture and downloads a matching prebuilt
// static binary. macOS is intentionally unsupported (no maintained static
// build); develop in a Linux container or on Windows instead.

const fs = require("fs");
const os = require("os");
const path = require("path");
const { Readable } = require("stream");
const { finished } = require("stream/promises");
const { execFileSync } = require("child_process");

const TARGET_DIR = "bin";

const LINUX_BASE =
  "https://github.com/moparisthebest/static-curl/releases/latest/download";
const WIN_REPO = "curl/curl-for-win";

// Picks the right download source for the current platform/arch.
const resolveSource = async () => {
  const { platform, arch } = process;

  if (platform === "linux") {
    if (arch === "x64")
      return { url: `${LINUX_BASE}/curl-amd64`, fileName: "curl", isZip: false };
    if (arch === "arm64")
      return { url: `${LINUX_BASE}/curl-arm64`, fileName: "curl", isZip: false };
    throw new Error(`Unsupported Linux architecture: ${arch}`);
  }

  if (platform === "win32") {
    // curl-for-win release assets are versioned (e.g. curl-8.10.1_2-win64-mingw.zip),
    // so we resolve the latest matching asset via the GitHub API rather than
    // hard-coding a version.
    let assetSuffix;
    if (arch === "x64") assetSuffix = "win64-mingw.zip";
    else if (arch === "arm64") assetSuffix = "win64a-mingw.zip";
    else throw new Error(`Unsupported Windows architecture: ${arch}`);

    const release = await fetch(
      `https://api.github.com/repos/${WIN_REPO}/releases/latest`,
      { headers: { "User-Agent": "retrieve-jobs-install" } }
    ).then((r) => r.json());

    const asset = release.assets?.find((a) => a.name.endsWith(assetSuffix));
    if (!asset)
      throw new Error(
        `No matching Windows asset (${assetSuffix}) in latest ${WIN_REPO} release`
      );

    return {
      url: asset.browser_download_url,
      fileName: "curl.exe",
      isZip: true
    };
  }

  if (platform === "darwin") {
    throw new Error(
      "macOS is not supported by install-curl: no maintained static curl binary " +
        "exists for macOS. Develop in a Linux container or on Windows."
    );
  }

  throw new Error(`Unsupported platform: ${platform}`);
};

// Recursively searches for curl.exe inside an extracted archive.
const findCurlExe = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findCurlExe(full);
      if (found) return found;
    } else if (entry.name === "curl.exe") {
      return full;
    }
  }
  return null;
};

(async () => {
  // Skip installation for desktop version
  if (process.env.TAURI) {
    console.log(
      "Curl is not used on the Tauri build; no need to run installation"
    );
    return;
  }

  const source = await resolveSource();
  const destination = path.resolve(`./${TARGET_DIR}`, source.fileName);

  // Skip installation if Curl already exists
  if (fs.existsSync(destination)) {
    console.log(
      `Curl already exists at ${destination}; no need to run installation`
    );
    return;
  }

  // Create directory if it doesn't exist
  if (!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR);

  const fetchResponse = await fetch(source.url);

  if (!source.isZip) {
    // Linux: the asset is the bare binary; stream straight to disk.
    const fileStream = fs.createWriteStream(destination, { flags: "wx" });
    await finished(Readable.fromWeb(fetchResponse.body).pipe(fileStream));
    fs.chmodSync(destination, "755");
    console.log(`Installed Curl binary at ${destination}`);
    return;
  }

  // Windows: download the zip, extract via tar (built into Windows 10 1803+),
  // copy curl.exe into bin/, then clean up the temp files.
  const tmpZip = path.resolve(os.tmpdir(), `curl-${Date.now()}.zip`);
  const extractDir = path.resolve(os.tmpdir(), `curl-extract-${Date.now()}`);

  const zipStream = fs.createWriteStream(tmpZip);
  await finished(Readable.fromWeb(fetchResponse.body).pipe(zipStream));

  fs.mkdirSync(extractDir);
  execFileSync("tar", ["-xf", tmpZip, "-C", extractDir]);

  const curlExe = findCurlExe(extractDir);
  if (!curlExe) throw new Error("curl.exe not found in extracted archive");

  fs.copyFileSync(curlExe, destination);
  fs.rmSync(tmpZip, { force: true });
  fs.rmSync(extractDir, { recursive: true, force: true });

  console.log(`Installed Curl binary at ${destination}`);
})();
