'use client';

import { useEffect, useState } from 'react';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

type Referral = {
  _id: string;
  email: string;
  status: 'pending' | 'approved';
  code: string | null;
  createdAt?: string;
  role?: string;
};

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/admin/referrals');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (!data.referrals) {
          throw new Error('Invalid response format');
        }
        
        setReferrals(data.referrals);
      } catch (err) {
        console.error('Failed to fetch referrals:', err);
        setError('Failed to load referrals. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  const handleApprove = async (id: string, email: string) => {
    setApproving(id);
    try {
      const res = await fetch('/api/admin/approve-referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, email }),
      });

      if (!res.ok) {
        throw new Error('Failed to approve referral');
      }

      const { code, role } = await res.json();

      setReferrals(prev =>
        prev.map(ref =>
          ref._id === id 
            ? { ...ref, status: 'approved', code, role } 
            : ref
        )
      );
    } catch (err) {
      console.error(err);
      setError('Failed to approve referral. Please try again.');
    } finally {
      setApproving(null);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    if (status === 'approved') {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-yellow-100 text-yellow-800`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="sm:flex sm:items-center mb-8">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-gray-900">Referral Requests</h1>
            <p className="mt-2 text-sm text-gray-700">
              Review and approve pending referral requests
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No referrals</h3>
              <p className="mt-1 text-sm text-gray-500">There are currently no pending referral requests.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Referral Code
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {referrals.map((referral) => (
                    <tr key={referral._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {referral.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {referral.role || 'Unknown'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={getStatusBadge(referral.status)}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {referral.code ? (
                          <div className="flex items-center">
                            <code className="bg-gray-100 px-2 py-1 rounded font-mono">
                              {referral.code}
                            </code>
                            <button
                              onClick={() => copyToClipboard(referral.code!)}
                              className="ml-2 text-gray-400 hover:text-gray-500"
                            >
                              {copiedCode === referral.code ? (
                                <CheckIcon className="h-4 w-4 text-green-500" />
                              ) : (
                                <ClipboardDocumentIcon className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {referral.createdAt ? new Date(referral.createdAt).toLocaleString() : '-'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {referral.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(referral._id, referral.email)}
                            disabled={approving === referral._id}
                            className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
                              approving === referral._id
                                ? 'bg-blue-300'
                                : 'bg-blue-600 hover:bg-blue-500'
                            } text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
                          >
                            {approving === referral._id ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Approving
                              </>
                            ) : (
                              'Approve'
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}