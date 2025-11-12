'use client';
import FurnitureForm from '@/components/FurnitureForm';
import { getFurnitureItemById } from '@/lib/data';
import { notFound, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth.tsx';
import { useEffect, useState } from 'react';
import type { Furniture } from '@/lib/types';


export default function EditFurniturePage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [furniture, setFurniture] = useState<Furniture | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
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
  }, [params.id]);


  if (authLoading || loading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {furniture && <FurnitureForm initialData={furniture} />}
    </div>
  );
}
