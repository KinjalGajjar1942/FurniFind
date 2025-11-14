'use client';
import FurnitureForm from '@/components/FurnitureForm';
import { useUser } from '@/firebase';
import { notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Furniture } from '@/lib/types';
import { getFurnitureById } from '@/lib/firebase/client';
import { useFirestore } from '@/firebase';


export default function EditFurniturePage({ params }: { params: { id: string } }) {
  const [furniture, setFurniture] = useState<Furniture | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isCarpenter, setIsCarpenter] = useState(false);
  const firestore = useFirestore();

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push('/admin');
        return;
      }
      user.getIdTokenResult().then(idTokenResult => {
        if (idTokenResult.claims.role !== 'carpenter') {
          router.push('/');
          setLoading(false);
        } else {
          setIsCarpenter(true);
          // Fetch furniture only if user is a carpenter
            if (!firestore) return;
            const fetchFurniture = async () => {
              const item = await getFurnitureById(firestore, params.id);
              if (!item) {
                notFound();
              } else {
                setFurniture(item);
              }
              setLoading(false);
            }
            fetchFurniture();
        }
      });
    }
  }, [user, isUserLoading, router, firestore, params.id]);


  if (loading || isUserLoading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>;
  }
  
  if (!isCarpenter) {
     return <div className="container mx-auto px-4 py-12">Access Denied. Redirecting...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {furniture && <FurnitureForm initialData={furniture} />}
    </div>
  );
}
