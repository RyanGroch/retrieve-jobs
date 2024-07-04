import { NextRequest, NextResponse } from "next/server";
import { curl } from "@/lib/curl";
import {
  usernamePattern,
  passwordPattern,
  jobPattern,
  addressList
} from "@/utils/allowed";

// Like all functions in the /src/app/api directory,
// this function only runs on the server of the web app.
// This code never runs on the desktop app.

// Makes an FTP request to delete one or more jobs.
// Returns a new list of jobs, or a result indicating failure.
// The reason that this returns a new list is to avoid having
// to make a separate call to the '/list' route.
// Server compute time is limited, so it is best to minimize it.
export async function POST(request: NextRequest) {
  try {
    const { username, password, host, jobs } = await request.json();

    // Simple validation; check that inputs exist and are valid
    if (
      !username ||
      !password ||
      !usernamePattern.test(username) ||
      !passwordPattern.test(password) ||
      !addressList.includes(host) ||
      !jobs.length ||
      !jobs.every((job: string) => jobPattern.test(job))
    )
      throw new Error();

    const curlParams = [
      "-u",
      `${username}:${password}`,
      `ftp://${host}/`,
      "-Q",
      "SITE filetype=jes"
    ];

    // Add each job to the request; *DELE
    // doesn't throw so we don't need to worry
    // about whether the jobs actually exist
    for (const job of jobs) {
      curlParams.push("-Q", `*DELE ${job}`);
    }

    // Make FTP request using the Curl CLI
    const curlResult = curl(curlParams);

    // Still returns list even though we just deleted jobs
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
