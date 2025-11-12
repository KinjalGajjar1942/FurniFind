'use client';

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
import { useAuth } from '@/lib/firebase/auth.tsx';

const ADMIN_EMAIL = "admin@example.com";

export default function FurnitureDetailClient({ furniture }: { furniture: Furniture }) {
  const { toast } = useToast();
  const { user } = useAuth();

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
            {user && (
                <Button size="lg" variant="outline" asChild>
                <Link href={`/edit/${furniture.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Item
                </Link>
                </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
