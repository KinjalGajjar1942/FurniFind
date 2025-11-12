import Link from 'next/link';
import { getCategories } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const categories = getCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-headline font-bold text-center mb-12">
        Browse by Category
      </h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category} href={`/category/${category.toLowerCase()}`} className="group">
             <Card className="overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl text-center">{category}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex justify-center items-center">
                    <div className="flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                        <span className="text-lg">View Products</span>
                        <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                    </div>
                </CardContent>
             </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
