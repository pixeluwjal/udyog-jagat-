// src/app/api/referrals/route.ts
import { NextResponse } from 'next/server';
import Referral from '@/app/models/Referral';
import { connectToDB } from '@/app/lib/db';

export async function GET() {
  await connectToDB();
  const referrals = await Referral.find({ status: 'pending' });
  return NextResponse.json(referrals);
}
