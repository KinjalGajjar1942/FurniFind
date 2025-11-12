'use client';
import FurnitureForm from '@/components/FurnitureForm';
import { getFurnitureItemById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Furniture } from '@/lib/types';


export default function EditFurniturePage({ params }: { params: { id: string } }) {
  const [furniture, setFurniture] = useState<Furniture | null>(null);
  const [loading, setLoading] = useState(true);

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


  if (loading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {furniture && <FurnitureForm initialData={furniture} />}
    </div>
  );
}
