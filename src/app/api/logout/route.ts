import { NextResponse } from "next/server";
import { deleteStoredPassword } from "@/utils/password-storage";

// Clears the cookies that store the password
export function POST() {
  deleteStoredPassword();
  return NextResponse.json({ status: 200 });
}
