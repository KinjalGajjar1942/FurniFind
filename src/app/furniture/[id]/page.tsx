'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Furniture } from '@/lib/types';
import { getFurnitureById, deleteFurniture } from '@/lib/firebase/client';
import { useFirestore, useUser } from '@/firebase';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Edit, Trash2, Share2, CornerUpLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';


export default function FurnitureDetailPage() {
  const [furniture, setFurniture] = useState<Furniture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;

  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [isCarpenter, setIsCarpenter] = useState(false);

  useEffect(() => {
    if (user) {
      user.getIdTokenResult().then(idTokenResult => {
        setIsCarpenter(idTokenResult.claims.role === 'carpenter');
      });
    } else {
      setIsCarpenter(false);
    }
  }, [user]);

  useEffect(() => {
    if (!firestore || !id) return;

    const fetchFurniture = async () => {
      try {
        setIsLoading(true);
        const furnitureData = await getFurnitureById(firestore, id);
        if (furnitureData) {
          setFurniture(furnitureData);
        } else {
          setError('Furniture not found.');
        }
      } catch (err) {
        console.error("Error fetching furniture:", err);
        setError('Failed to load furniture details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFurniture();
  }, [firestore, id]);

  const handleDelete = async () => {
    if (!firestore || !id || !isCarpenter) return;
    try {
      await deleteFurniture(firestore, id);
      toast({ title: 'Success', description: 'Furniture item deleted.' });
      router.push('/');
    } catch (err) {
      console.error("Error deleting furniture:", err);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete item.' });
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: furniture?.name,
        text: `Check out this furniture: ${furniture?.name}`,
        url: window.location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
        navigator.clipboard.writeText(window.location.href);
        toast({ title: 'Link Copied', description: 'Furniture link copied to clipboard.' });
    }
  };


  if (isLoading) {
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="animate-pulse">
                <div className="h-10 w-48 bg-muted rounded-md mb-8"></div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="h-[400px] w-full bg-muted rounded-lg"></div>
                    <div>
                        <div className="h-10 w-3/4 bg-muted rounded-md"></div>
                        <div className="h-6 w-1/4 bg-muted rounded-md mt-4"></div>
                        <div className="h-20 w-full bg-muted rounded-md mt-4"></div>
                        <div className="flex gap-4 mt-8">
                            <div className="h-10 w-24 bg-muted rounded-md"></div>
                            <div className="h-10 w-24 bg-muted rounded-md"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  if (error) {
    return <div className="text-center py-16 text-destructive">{error}</div>;
  }

  if (!furniture) {
    return null; 
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8 gap-2">
          <CornerUpLeft className="h-4 w-4" />
          <span>Back to Showcase</span>
        </Button>

        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-5 gap-0">
            <div className="md:col-span-3">
                {furniture.images && furniture.images.length > 0 ? (
                    <Carousel className="w-full">
                        <CarouselContent>
                            {furniture.images.map((image, index) => (
                                <CarouselItem key={index}>
                                    <div className="aspect-[4/3] relative">
                                        <Image
                                        src={image.url}
                                        alt={`${furniture.name} image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {furniture.images.length > 1 && (
                            <>
                                <CarouselPrevious className="left-4" />
                                <CarouselNext className="right-4" />
                            </>
                        )}
                    </Carousel>
                    
                ) : (
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                    </div>
                )}
            </div>

            <div className="md:col-span-2 flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="font-headline text-3xl">{furniture.name}</CardTitle>
                <Badge variant="secondary" className="w-fit">{furniture.category}</Badge>
              </CardHeader>
              <CardContent className="flex-grow">
                {furniture.description ? (
                  <CardDescription className="text-base">{furniture.description}</CardDescription>
                ) : (
                    <CardDescription className="text-base italic">No description provided.</CardDescription>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button onClick={handleShare} className="w-full gap-2">
                  <Share2 className="h-4 w-4" />
                  Share with Carpenter
                </Button>
                {!isUserLoading && isCarpenter && (
                  <div className="flex w-full gap-2">
                      <Link href={`/edit/${id}`} passHref className="w-full">
                          <Button variant="outline" className="w-full gap-2">
                              <Edit className="h-4 w-4" /> Edit
                          </Button>
                      </Link>
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <Button variant="destructive" className="w-full gap-2">
                              <Trash2 className="h-4 w-4" /> Delete
                              </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the furniture item.
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                  </div>
                )}
              </CardFooter>
            </div>
          </div>
        </Card>
    </div>
  );
}
