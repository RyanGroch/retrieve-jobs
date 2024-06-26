import { execFileSync } from "child_process";
import path from "path";

// This is the same Curl as the popular command-line tool:
// https://github.com/curl/curl

// During `npm install`, the `install-curl.cjs` script
// automatically puts a Curl binary in /bin/curl.
// Bear in mind that only the web version uses Curl;
// the desktop version does NOT use Curl.
const curlPath = path.join(process.cwd(), "bin", "curl");

// Runs identically to the Curl CLI
export const curl = (params: string[]) =>
  execFileSync(curlPath, params).toString();
