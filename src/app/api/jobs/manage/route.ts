import { NextResponse } from 'next/server';
import { connectToDB } from '@/app/lib/db';
import Job from '@/app/models/Job';

export async function GET(request: Request) {
  try {
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const authRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: request.headers,
      credentials: 'include',
    });

    if (!authRes.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resJson = await authRes.json();
    const user = resJson.user; // ✅ fixed here

    if (user.role !== 'job_poster') {
      console.log('Unauthorized role:', user.role);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDB();

    const jobs = await Job.find({ postedBy: user.id }) // use `.id` if that’s your field
      .sort({ createdAt: -1 })
      .lean();

    const jobsWithApplications = jobs.map((job: any) => ({
      ...job,
      applicationsCount: job.applications?.length || 0,
    }));

    return NextResponse.json(jobsWithApplications);
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
