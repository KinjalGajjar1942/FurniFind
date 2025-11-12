import { getFurnitureItemsByCategory, getCategories } from '@/lib/data';
import FurnitureCard from '@/components/FurnitureCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    name: category.name.toLowerCase(),
  }));
}

export default async function CategoryPage({ params }: { params: { name: string } }) {
  const furnitureItems = await getFurnitureItemsByCategory(params.name);

  if (furnitureItems.length === 0) {
    // This can happen if a category has no items. 
    // We can show a friendly message.
    console.log(`No furniture found for category: ${params.name}`);
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
        {furnitureItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {furnitureItems.map((item) => (
                <Link key={item.id} href={`/furniture/${item.id}`} className="group">
                    <FurnitureCard furniture={item} />
                </Link>
                ))}
            </div>
        ) : (
            <div className="text-center text-muted-foreground mt-12">
                <p className="text-lg">No furniture found in this category yet.</p>
                <p>Check back later!</p>
            </div>
        )}
    </div>
  );
}
