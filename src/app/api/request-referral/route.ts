import { NextResponse } from 'next/server';
import { connectToDB } from '@/app/lib/db';
import Referral from '@/app/models/Referral';

export async function POST(req: Request) {
  try {
    const { name, email, role } = await req.json();

    if (!email || !name || !role) {
      return NextResponse.json(
        { message: 'Name, email, and role are required' },
        { status: 400 }
      );
    }

    await connectToDB();

    // Check for existing email (now unique)
    const existing = await Referral.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: 'Referral request already submitted' },
        { status: 400 }
      );
    }

    // Create without code field
    await Referral.create({ 
      name, 
      email, 
      role 
      // Don't include code here
    });

    return NextResponse.json(
      { message: 'Referral request submitted successfully' },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}