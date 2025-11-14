'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Furniture } from '@/lib/types';
import { getFurnitureById } from '@/lib/firebase/client';
import { useFirestore } from '@/firebase';
import FurnitureForm from '@/components/FurnitureForm';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditFurniturePage() {
  const [initialData, setInitialData] = useState<Furniture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params.id as string;

  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore || !id) return;

    const fetchFurniture = async () => {
      try {
        setIsLoading(true);
        const furnitureData = await getFurnitureById(firestore, id);
        if (furnitureData) {
          setInitialData(furnitureData);
        } else {
          setError('Furniture not found.');
        }
      } catch (err) {
        console.error("Error fetching furniture for edit:", err);
        setError('Failed to load furniture data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFurniture();
  }, [firestore, id]);

  if (isLoading) {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="space-y-8">
                <Skeleton className="h-10 w-1/3" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-1/4" />
                <div className="flex justify-end gap-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
        </div>
    );
  }

  if (error) {
    return <div className="text-center py-16 text-destructive">{error}</div>;
  }

  if (!initialData) {
    return null; // Or a not found component
  }

  return <FurnitureForm initialData={initialData} />;
}
