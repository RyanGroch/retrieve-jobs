import { NextRequest, NextResponse } from "next/server";
import { curl } from "@/lib/curl";
import { usernamePattern, passwordPattern, addressList } from "@/utils/allowed";
import {
  getStoredPassword,
  setStoredPassword,
  deleteStoredPassword
} from "@/utils/password-storage";

// Like all functions in the /src/app/api directory,
// this function only runs on the server of the web app.
// This code never runs on the desktop app.

// Makes an FTP request to retrieve a list of downloadable jobs.
// With respect to the app as a whole, this endpoint doubles
// as user authentication.
export async function POST(request: NextRequest) {
  try {
    const { username, password, host, storePassword } = await request.json();
    const sessionPassword = password || getStoredPassword();

    // Simple validation; check that inputs exist and are valid
    if (
      !username ||
      !sessionPassword ||
      !usernamePattern.test(username) ||
      !passwordPattern.test(sessionPassword) ||
      !addressList.includes(host)
    )
      throw new Error();

    // Make FTP request using the Curl CLI;
    // all FTP requests throw errors if the credentials are incorrect
    const curlResult = curl([
      "-u",
      `${username}:${sessionPassword}`,
      `ftp://${host}/`,
      "-Q",
      "SITE filetype=jes"
    ]);

    if (storePassword) {
      setStoredPassword(sessionPassword);
    }

    return NextResponse.json(
      { result: curlResult, success: true },
      { status: 200 }
    );
  } catch {
    // Essentially a failed login; clear password info as invalid
    deleteStoredPassword();

    // To keep server logic simple, we don't distinguish
    // between different types of errors
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
