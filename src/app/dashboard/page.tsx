'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: 'job_seeker' | 'job_poster' | 'referrer';
  name?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (response.status === 401) {
          router.replace('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        if (!data?.user) {
          router.replace('/login');
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.error('Auth fetch error:', err);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-500 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.name || user.email.split('@')[0];
  const roleLabel = {
    job_seeker: 'Job Seeker',
    job_poster: 'Recruiter',
    referrer: 'Referrer'
  }[user.role];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Job Portal Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {roleLabel}
            </span>
            <button 
              onClick={() => router.push('/logout')}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Welcome, {displayName}!</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {user.role === 'job_seeker' && 'Find your dream job today!'}
                  {user.role === 'job_poster' && 'Post jobs and find the best candidates!'}
                  {user.role === 'referrer' && 'Help connect people with great opportunities!'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Role-Specific Content */}
        {user.role === 'job_seeker' && (
          <JobSeekerDashboard />
        )}

        {user.role === 'job_poster' && (
          <JobPosterDashboard />
        )}

        {user.role === 'referrer' && (
          <ReferrerDashboard />
        )}

        {/* Common Features */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Settings</h3>
              <p className="mt-2 text-sm text-gray-500">Update your account information and preferences.</p>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/profile')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Messages</h3>
              <p className="mt-2 text-sm text-gray-500">Check your messages and notifications.</p>
              <div className="mt-4">
                <button
                  onClick={() => router.push('/messages')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Messages
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Job Seeker Dashboard Component
function JobSeekerDashboard() {
  const router = useRouter();
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Search Tools</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Find Jobs</h3>
            <p className="mt-2 text-sm text-gray-500">Browse available job listings that match your skills.</p>
            <div className="mt-4">
              <button
                onClick={() => router.push('/jobs')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Search Jobs
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Applications</h3>
            <p className="mt-2 text-sm text-gray-500">Track your job applications and their status.</p>
            <div className="mt-4">
              <button
                onClick={() => router.push('/applications')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Applications
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Resume</h3>
            <p className="mt-2 text-sm text-gray-500">Update and manage your resume for applications.</p>
            <div className="mt-4">
              <button
                onClick={() => router.push('/resume')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Manage Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Job Poster (Recruiter) Dashboard Component
function JobPosterDashboard() {
  const router = useRouter();
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recruitment Tools</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Post a New Job</h3>
            <p className="mt-2 text-sm text-gray-500">Create a new job listing to attract candidates.</p>
            <div className="mt-4">
              <button
                onClick={() => router.push('/jobs/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Post Job
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Jobs</h3>
            <p className="mt-2 text-sm text-gray-500">View and edit your active job postings.</p>
            <div className="mt-4">
              <button
                onClick={() => router.push('/jobs/manage')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Manage Jobs
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Applicants</h3>
            <p className="mt-2 text-sm text-gray-500">Review candidates who applied to your jobs.</p>
            <div className="mt-4">
              <button
                onClick={() => router.push('/applicants')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                View Applicants
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Referrer Dashboard Component
function ReferrerDashboard() {
  const router = useRouter();
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Referral Tools</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Refer Candidates</h3>
            <p className="mt-2 text-sm text-gray-500">Recommend qualified candidates for open positions.</p>
            <div className="mt-4">
              <button
                onClick={() => router.push('/refer')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Make Referral
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Your Referrals</h3>
            <p className="mt-2 text-sm text-gray-500">Track the status of your referrals.</p>
            <div className="mt-4">
              <button
                onClick={() => router.push('/referrals')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Referrals
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Referral Rewards</h3>
            <p className="mt-2 text-sm text-gray-500">View your earned rewards and bonuses.</p>
            <div className="mt-4">
              <button
                onClick={() => router.push('/rewards')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                View Rewards
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}