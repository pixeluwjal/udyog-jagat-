// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: 'job_seeker' | 'recruiter' | 'admin' | 'job_poster'; // ✅ added
    };
  }

  interface User {
    role: 'job_seeker' | 'recruiter' | 'admin' | 'job_poster'; // ✅ added
  }
}
