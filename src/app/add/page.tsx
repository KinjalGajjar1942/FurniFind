'use client';
import FurnitureForm from '@/components/FurnitureForm';
import { useAuth } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddFurniturePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>;
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <FurnitureForm />
    </div>
  );
}
