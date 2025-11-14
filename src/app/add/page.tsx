'use client';
import FurnitureForm from '@/components/FurnitureForm';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AddFurniturePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isCarpenter, setIsCarpenter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push('/admin');
        return;
      }
      user.getIdTokenResult().then(idTokenResult => {
        if (idTokenResult.claims.role !== 'carpenter') {
          router.push('/');
        } else {
          setIsCarpenter(true);
        }
        setIsLoading(false);
      });
    }
  }, [user, isUserLoading, router]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>;
  }
  
  if (!isCarpenter) {
    // This can be a brief flash or a more permanent state if redirection fails.
    return <div className="container mx-auto px-4 py-12">Access Denied. Redirecting...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <FurnitureForm />
    </div>
  );
}
