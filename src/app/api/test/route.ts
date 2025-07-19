import { NextResponse } from 'next/server';
import { connectToDB } from '@/app/lib/db';

export async function GET() {
  try {
    await connectToDB();
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to MongoDB' 
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to connect to MongoDB',
        error: error.message 
      },
      { status: 500 }
    );
  }
}