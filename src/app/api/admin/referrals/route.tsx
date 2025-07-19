import { NextResponse } from 'next/server';
import { connectToDB } from '@/app/lib/db';
import Referral from '@/app/models/Referral';

// We define what a referral looks like after `.lean()`
type LeanReferral = {
  _id: any;
  email?: string;
  approved?: boolean;
  code?: string;
  createdAt?: Date;
};

export async function GET() {
  try {
    await connectToDB();

    // Fetch and cast loosely (still safe, just not strict)
    const referrals = await Referral.find({})
      .select('_id email approved code createdAt')
      .lean() as LeanReferral[];

    // Map only valid referrals with required fields
    const formattedReferrals = referrals
      .filter(ref => ref.email && typeof ref.approved === 'boolean' && ref.createdAt)
      .map(ref => ({
        _id: ref._id.toString(),
        email: ref.email!,
        status: ref.approved ? 'approved' : 'pending',
        code: ref.code || null,
        createdAt: ref.createdAt!
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
