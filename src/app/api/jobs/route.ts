import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/app/lib/db';
import Job from '@/app/models/Job';



export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (user.role !== 'job_poster') {
      return NextResponse.json({ error: 'Only job posters can post jobs' }, { status: 403 });
    }

    await connectToDB();
    const body = await request.json();

    const newJob = new Job({
      title: body.title,
      description: body.description,
      company: body.company,
      location: body.location,
      salary: body.salary,
      type: body.type,
      skillsRequired: body.skillsRequired,
      postedBy: user.id,
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await newJob.save();

    return NextResponse.json({ success: true, job: newJob }, { status: 201 });
  } catch (error: any) {
    console.error('Error posting job:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
