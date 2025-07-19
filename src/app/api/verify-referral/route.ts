import { connectToDB } from "@/app/lib/db";
import Referral from "@/app/models/Referral";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, code } = await req.json();
  await connectToDB();

  const referral = await Referral.findOne({ email, code, status: "approved" });

  if (!referral) {
    return NextResponse.json({ error: "Invalid referral or not approved yet" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
