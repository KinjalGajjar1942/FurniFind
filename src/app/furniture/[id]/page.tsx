'use client';

import { getFurnitureItemById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Mail, Share2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { Furniture } from '@/lib/types';
import { useEffect, useState } from 'react';

const ADMIN_EMAIL = "admin@example.com";

export default function FurnitureDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [furniture, setFurniture] = useState<Furniture | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFurniture = async () => {
      const item = await getFurnitureItemById(params.id);
      if (!item) {
        notFound();
      }
      setFurniture(item);
      setLoading(false);
    };
    fetchFurniture();
  }, [params.id]);


  if (loading) {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <div className="animate-pulse">
                <div className="h-8 w-1/4 bg-muted rounded mb-8"></div>
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    <div className="aspect-square w-full bg-muted rounded-lg"></div>
                    <div className="flex flex-col">
                        <div className="h-12 w-3/4 bg-muted rounded mb-4"></div>
                        <div className="h-4 w-full bg-muted rounded mb-2"></div>
                        <div className="h-4 w-full bg-muted rounded mb-2"></div>
                        <div className="h-4 w-2/3 bg-muted rounded mb-6"></div>
                        <div className="flex gap-4 mt-auto">
                            <div className="h-12 w-36 bg-muted rounded"></div>
                            <div className="h-12 w-36 bg-muted rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  if (!furniture) {
    return null; // notFound() would have been called in useEffect
  }


  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: furniture.name,
          text: `Check out this ${furniture.name}!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not share the item.',
        });
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link Copied!',
          description: 'The link to this furniture has been copied to your clipboard.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not copy the link.',
        });
      }
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all furniture
        </Link>
      </Button>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <Carousel className="w-full">
          <CarouselContent>
            {furniture.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-square w-full overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={image.url}
                    alt={`${furniture.name} - image ${index + 1}`}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                    data-ai-hint={image.hint}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="flex flex-col">
          <h1 className="text-4xl font-headline font-bold mb-2">{furniture.name}</h1>
          <p className="text-lg text-muted-foreground">{furniture.category}</p>
          <Separator className="my-4" />
          <p className="text-muted-foreground leading-relaxed my-6 flex-grow">{furniture.description}</p>
          <Separator className="my-4" />
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <a href={`mailto:${ADMIN_EMAIL}?subject=Inquiry about ${furniture.name}`}>
                <Mail className="mr-2 h-4 w-4" />
                Contact Admin
              </a>
            </Button>
            <Button size="lg" variant="secondary" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            {/* The Edit button will be conditionally rendered once admin auth is in place */}
            <Button size="lg" variant="outline" asChild>
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
