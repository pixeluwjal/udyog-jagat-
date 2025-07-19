import { NextResponse } from 'next/server';
import { connectToDB } from '@/app/lib/db';
import Referral from '@/app/models/Referral';
import { sendApprovalEmail } from '@/app/lib/email';

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function POST(req: Request) {
  try {
    const { id, email } = await req.json();

    await connectToDB();

    const referral = await Referral.findOneAndUpdate(
      { _id: id, email },
      { 
        code: generateReferralCode(),
        approved: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      { new: true }
    ).select('code email role name');

    if (!referral) {
      return NextResponse.json(
        { message: 'Referral not found' },
        { status: 404 }
      );
    }

    // Send approval email with signup link
    await sendApprovalEmail({
      to: referral.email,
      name: referral.name,
      role: referral.role,
      code: referral.code
    });

    return NextResponse.json({ 
      success: true,
      code: referral.code,
      role: referral.role 
    });
  } catch (err) {
    console.error('Approval error:', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}