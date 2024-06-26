import { NextRequest, NextResponse } from "next/server";
import { curl } from "@/lib/curl";
import {
  usernamePattern,
  passwordPattern,
  jobPattern,
  hostsList
} from "@/utils/allowed";

// Like all functions in the /src/app/api directory,
// this function only runs on the server of the web app.
// This code never runs on the desktop app.

// Makes an FTP request to retrieve the output of a specific job.
export async function POST(request: NextRequest) {
  try {
    const { username, password, host, job } = await request.json();

    // Simple validation; check that inputs exist and are valid
    if (
      !username ||
      !password ||
      !job ||
      !usernamePattern.test(username) ||
      !passwordPattern.test(password) ||
      !jobPattern.test(job) ||
      !hostsList.includes(host)
    )
      throw new Error();

    // Make FTP request using the Curl CLI;
    // throws an error if the job doesn't exist
    const curlResult = curl([
      "-u",
      `${username}:${password}`,
      `ftp://${host}/${job}`,
      "-Q",
      "SITE filetype=jes",
      "-Q",
      "NOOP",
      "-B"
    ]);

    return NextResponse.json(
      { result: curlResult, success: true },
      { status: 200 }
    );
  } catch {
    // To keep server logic simple, we don't distinguish
    // between different types of errors
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
