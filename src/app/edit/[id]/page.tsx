import FurnitureForm from '@/components/FurnitureForm';
import { getFurnitureItemById } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function EditFurniturePage({ params }: { params: { id: string } }) {
  const furniture = await getFurnitureItemById(params.id);

  if (!furniture) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <FurnitureForm initialData={furniture} />
    </div>
  );
}
