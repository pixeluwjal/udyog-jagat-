import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Referral from '@/app/models/Referral';
import { connectToDB } from '@/app/lib/db';

export async function GET() {
  try {
    await connectToDB();

    const referrals = await Referral.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, referrals });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch referrals' }, { status: 500 });
  }
}
