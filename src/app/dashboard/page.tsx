'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

interface DashboardPageProps {
  user: {
    username: string;
  } | null;
}

export default function DashboardPage({user}: DashboardPageProps) {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">
        Welcome, {user.username}!
      </h1>
      <p>
        This is your dashboard. You are now authenticated.
      </p>
    </div>
  );
}