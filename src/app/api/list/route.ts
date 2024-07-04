import { NextRequest, NextResponse } from "next/server";
import { curl } from "@/lib/curl";
import { usernamePattern, passwordPattern, addressList } from "@/utils/allowed";

// Like all functions in the /src/app/api directory,
// this function only runs on the server of the web app.
// This code never runs on the desktop app.

// Makes an FTP request to retrieve a list of downloadable jobs.
// With respect to the app as a whole, this endpoint doubles
// as user authentication.
export async function POST(request: NextRequest) {
  try {
    const { username, password, host } = await request.json();

    // Simple validation; check that inputs exist and are valid
    if (
      !username ||
      !password ||
      !usernamePattern.test(username) ||
      !passwordPattern.test(password) ||
      !addressList.includes(host)
    )
      throw new Error();

    // Make FTP request using the Curl CLI;
    // all FTP requests throw errors if the credentials are incorrect
    const curlResult = curl([
      "-u",
      `${username}:${password}`,
      `ftp://${host}/`,
      "-Q",
      "SITE filetype=jes"
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
