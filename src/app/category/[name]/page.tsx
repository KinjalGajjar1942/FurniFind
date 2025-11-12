import { getFurnitureItemsByCategory, getCategories } from '@/lib/data';
import FurnitureCard from '@/components/FurnitureCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {unstable_setRequestLocale} from 'next-intl/server';


export function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    name: category.name.toLowerCase(),
  }));
}

export default function CategoryPage({ params }: { params: { name: string } }) {
  const furnitureItems = getFurnitureItemsByCategory(params.name);

  if (furnitureItems.length === 0) {
    notFound();
  }
  
  const categoryName = params.name.charAt(0).toUpperCase() + params.name.slice(1);

  return (
    <div className="container mx-auto px-4 py-12">
        <Button asChild variant="ghost" className="mb-8">
            <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to categories
            </Link>
        </Button>
        <h1 className="text-4xl font-headline font-bold mb-8 text-center">{categoryName}</h1>
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
