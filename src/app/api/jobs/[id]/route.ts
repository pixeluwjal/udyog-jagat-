import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/app/lib/db';
import Job from '@/app/models/Job';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    // Force TypeScript to recognize this as synchronous
    const cookieStore = cookies() as unknown as { get: (name: string) => { value: string } | undefined };
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rest of your code remains exactly the same...
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

    if (decoded.role !== 'job_poster') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
    }

    await connectToDB();

    const job = await Job.findOne({ _id: id, postedBy: decoded.id });

    if (!job) {
      return NextResponse.json({ error: 'Job not found or not yours' }, { status: 404 });
    }

    await Job.deleteOne({ _id: id });

    return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
  } catch (err: any) {
    console.error('Error deleting job:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}