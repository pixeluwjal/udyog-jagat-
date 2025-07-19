import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/db";
import Referral from "@/app/models/Referral";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

export async function POST(req: Request) {
  try {
    const { email, password, role, referralCode } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password and role are required" },
        { status: 400 }
      );
    }

    if (!['job_seeker', 'job_poster', 'referrer', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Validate referral code if provided
    let referral = null;
    if (referralCode) {
      referral = await Referral.findOne({
        code: referralCode,
        approved: true,
        expiresAt: { $gt: new Date() },
      });
      if (!referral) {
        return NextResponse.json(
          { error: "Invalid or expired referral code" },
          { status: 400 }
        );
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Required: referralCodeUsed is required, so set empty string if none
    const referralCodeUsed = referral ? referral.code : "";

    // You must set accessExpiresAt as a Date (for example, 1 year from now)
    const accessExpiresAt = new Date();
    accessExpiresAt.setFullYear(accessExpiresAt.getFullYear() + 1);

    const newUser = await User.create({
      email,
      passwordHash: hashedPassword,
      role,
      referralCodeUsed,
      ...(referral && { referredBy: referral._id }),
      accessExpiresAt,
      isActive: true,
    });

    if (referral) {
      await Referral.findByIdAndUpdate(referral._id, {
        $inc: { uses: 1 },
        $addToSet: { referredUsers: newUser._id },
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json(
      { 
        user: { 
          id: newUser._id, 
          email: newUser.email, 
          role: newUser.role 
        } 
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
