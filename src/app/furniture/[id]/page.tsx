import { getFurnitureItemById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function FurnitureDetailPage({ params }: { params: { id: string } }) {
  const furniture = getFurnitureItemById(params.id);

  if (!furniture) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all furniture
        </Link>
      </Button>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src={furniture.imageUrl}
            alt={furniture.name}
            width={600}
            height={600}
            className="w-full h-full object-cover"
            data-ai-hint={furniture.imageHint}
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-4xl font-headline font-bold mb-2">{furniture.name}</h1>
          <p className="text-3xl font-semibold text-primary mb-6">${furniture.price.toFixed(2)}</p>
          <Separator className="my-2" />
          <p className="text-muted-foreground leading-relaxed my-6 flex-grow">{furniture.description}</p>
          <Separator className="my-2" />
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <a href={`mailto:${furniture.sellerContact}`}>
                <Mail className="mr-2 h-4 w-4" />
                Contact Seller
              </a>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href={`/edit/${furniture.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Item
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
