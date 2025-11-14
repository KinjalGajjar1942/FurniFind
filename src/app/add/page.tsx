'use client';
import FurnitureForm from '@/components/FurnitureForm';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AddFurniturePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isCarpenter, setIsCarpenter] = useState(false);

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
      });
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !isCarpenter) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <FurnitureForm />
    </div>
  );
}
