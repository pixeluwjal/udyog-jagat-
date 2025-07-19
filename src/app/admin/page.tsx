'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    const res = await fetch('/api/get-referral-requests');
    const data = await res.json();
    setRequests(data.requests || []);
  };

  const approveRequest = async (id: string, email: string) => {
    const res = await fetch('/api/approve-referral', {
      method: 'POST',
      body: JSON.stringify({ id, email }),
    });

    if (res.ok) {
      alert('Referral Approved & Email Sent!');
      fetchRequests(); // Refresh list
    } else {
      alert('Approval failed');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Referral Requests</h1>
      {requests.length === 0 ? (
        <p>No pending referral requests.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req._id} className="border p-4 rounded shadow">
              <p><strong>Email:</strong> {req.email}</p>
              <p><strong>Status:</strong> {req.status}</p>
              <button
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => approveRequest(req._id, req.email)}
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
