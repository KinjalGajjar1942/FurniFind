'use client';
import FurnitureForm from '@/components/FurnitureForm';
import { getFurnitureItemById } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Furniture } from '@/lib/types';
import { useUser } from '@/firebase';


export default function EditFurniturePage({ params }: { params: { id: string } }) {
  const [furniture, setFurniture] = useState<Furniture | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isCarpenter, setIsCarpenter] = useState(false);

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push('/login');
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
    if (!isCarpenter) return;
    const fetchFurniture = async () => {
      const item = await getFurnitureItemById(params.id);
      if (!item) {
        notFound();
      } else {
        setFurniture(item);
      }
      setLoading(false);
    }
    fetchFurniture();
  }, [params.id, isCarpenter]);


  if (loading || isUserLoading || !isCarpenter) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {furniture && <FurnitureForm initialData={furniture} />}
    </div>
  );
}
