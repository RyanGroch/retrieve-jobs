import { execFileSync } from "child_process";
import path from "path";

// This is the same Curl as the popular command-line tool:
// https://github.com/curl/curl

// During `npm install`, the `install-curl.cjs` script automatically
// downloads a static Curl binary for the current OS/arch and places it
// in /bin. The binary is named `curl.exe` on Windows and `curl` elsewhere.
// Bear in mind that only the web version uses Curl; the desktop version
// does NOT use Curl.
const curlBinary = process.platform === "win32" ? "curl.exe" : "curl";
const curlPath = path.join(process.cwd(), "bin", curlBinary);

// Runs identically to the Curl CLI
export const curl = (params: string[]) =>
  execFileSync(curlPath, params).toString();
