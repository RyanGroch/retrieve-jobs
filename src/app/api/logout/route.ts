import { NextResponse } from "next/server";
import { deleteStoredPassword } from "@/utils/password-storage";

// Clears the cookies that store the password
export async function POST() {
  await deleteStoredPassword();
  return NextResponse.json({ status: 200 });
}
