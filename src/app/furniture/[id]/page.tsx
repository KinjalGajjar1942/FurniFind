import { getFurnitureItemById } from '@/lib/data';
import { notFound } from 'next/navigation';
import FurnitureDetailClient from './FurnitureDetailClient';

export default async function FurnitureDetailPage({ params }: { params: { id: string } }) {
  const furniture = await getFurnitureItemById(params.id);

  if (!furniture) {
    notFound();
  }

  return <FurnitureDetailClient furniture={furniture} />;
}
