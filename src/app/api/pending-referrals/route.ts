import { connectToDB } from '@/app/lib/db';
import Referral from '@/app/models/Referral';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDB();

    const pending = await Referral.find({ status: { $ne: 'approved' } }).lean();

    return NextResponse.json({ success: true, referrals: pending });
  } catch (error) {
    console.error('Fetch Pending Referrals Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
