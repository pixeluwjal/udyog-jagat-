import { NextResponse } from 'next/server';
import { connectToDB } from '@/app/lib/db';
import Referral from '@/app/models/Referral';

export async function GET() {
  try {
    await connectToDB();
    
    const referrals = await Referral.find({})
      .select('_id email role approved code createdAt')
      .lean();

    // Transform data for the frontend
    const formattedReferrals = referrals.map(ref => ({
      _id: ref._id.toString(),
      email: ref.email,
      status: ref.approved ? 'approved' : 'pending',
      code: ref.code || null,
      createdAt: ref.createdAt
    }));

    return NextResponse.json({ referrals: formattedReferrals });
  } catch (err) {
    console.error('Failed to fetch referrals:', err);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}