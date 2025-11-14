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
        } else {
          setIsCarpenter(true);
        }
      });
    }
  }, [user, isUserLoading, router]);


  useEffect(() => {
    if (!isCarpenter || !firestore) return;
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
  }, [params.id, isCarpenter, firestore]);


  if (loading || isUserLoading || !isCarpenter) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {furniture && <FurnitureForm initialData={furniture} />}
    </div>
  );
}
