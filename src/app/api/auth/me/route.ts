import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export async function GET() {
  try {
    const cookieStore = cookies(); // ✅ Remove await
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ user: decoded }); // ✅ `user` key is important
  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}
