'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setError('Failed to fetch user data');
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      router.push('/login');
    }
  };

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-8">
      <div className="w-full max-w-4xl text-right">
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="flex flex-col items-center w-full mt-8">
        <h1 className="text-4xl font-bold">Welcome, {user.name}</h1>
        <p className="mt-4 text-lg">Your email is: {user.email}</p>

        <div className="grid w-full grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 text-center bg-gray-100 border rounded-lg">
            <h2 className="text-xl font-semibold">CRM Module</h2>
            <p className="mt-2 text-gray-600">Coming soon...</p>
          </div>
          <div className="p-6 text-center bg-gray-100 border rounded-lg">
            <h2 className="text-xl font-semibold">Website Builder</h2>
            <p className="mt-2 text-gray-600">Coming soon...</p>
          </div>
          <div className="p-6 text-center bg-gray-100 border rounded-lg">
            <h2 className="text-xl font-semibold">Community Engine</h2>
            <p className="mt-2 text-gray-600">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
