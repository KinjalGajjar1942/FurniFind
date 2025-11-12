import Link from 'next/link';
import { getFurnitureItems } from '@/lib/data';
import FurnitureCard from '@/components/FurnitureCard';

export default function Home() {
  const furnitureItems = getFurnitureItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {furnitureItems.map((item) => (
          <Link key={item.id} href={`/furniture/${item.id}`} className="group">
            <FurnitureCard furniture={item} />
          </Link>
        ))}
      </div>
    </div>
  );
}
