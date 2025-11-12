import Link from 'next/link';
import { getCategories } from '@/lib/data';
import { Card, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-headline font-bold text-center mb-12">
        Browse by Category
      </h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.name} href={`/category/${category.name.toLowerCase()}`} className="group">
             <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 h-full flex flex-col aspect-video relative">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={category.imageHint}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="relative flex flex-col h-full items-center justify-center p-6">
                    <CardTitle className="font-headline text-4xl text-white text-center drop-shadow-lg">{category.name}</CardTitle>
                </div>
             </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
