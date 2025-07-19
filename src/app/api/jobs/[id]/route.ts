import { NextResponse } from 'next/server';
import { connectToDB } from '@/app/lib/db';
import Job from '@/app/models/Job';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded.role !== 'job_poster') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDB();

    const job = await Job.findOne({ _id: params.id, postedBy: decoded.id });

    if (!job) {
      return NextResponse.json({ error: 'Job not found or not yours' }, { status: 404 });
    }

    await Job.deleteOne({ _id: params.id });

    return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
  } catch (err: any) {
    console.error('Error deleting job:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
