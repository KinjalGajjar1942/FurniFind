
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useUser } from '@/firebase';
import { useParams, useRouter } from 'next/navigation';
import type { Furniture } from '@/lib/types';
import { getFurnitureById, deleteFurniture } from '@/lib/firebase/client';
import { useFirestore } from '@/firebase';

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
  const [isCarpenter, setIsCarpenter] = useState(false);
  const [isUserCheckLoading, setIsUserCheckLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;
  const { user, isUserLoading } = useUser();
  // Check if user is carpenter
  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        setIsCarpenter(false);
        setIsUserCheckLoading(false);
        return;
      }
      user.getIdTokenResult().then(idTokenResult => {
        if (idTokenResult.claims.role === 'carpenter') {
          setIsCarpenter(true);
        } else {
          setIsCarpenter(false);
        }
        setIsUserCheckLoading(false);
      });
    }
  }, [user, isUserLoading]);

  const firestore = useFirestore();

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
    if (!firestore || !id) return;
    try {
      await deleteFurniture(firestore, id);
      toast({ title: 'Success', description: 'Furniture item deleted.' });
      router.push('/');
    } catch (err) {
      console.error("Error deleting furniture:", err);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete item.' });
    }
  };
  
  // Share dialog state
  const [shareOpen, setShareOpen] = useState(false);

  const handleNativeShare = () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator.share) return;
    navigator.share({
      title: furniture?.name,
      text: `Check out this furniture: ${furniture?.name}`,
      url: window.location.href,
    })
      .then(() => setShareOpen(false))
      .catch(() => setShareOpen(false));
  };

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast({ title: 'Link Copied', description: 'Furniture link copied to clipboard.' });
          setShareOpen(false);
        })
        .catch(() => {
          window.prompt('Copy this link:', window.location.href);
        });
    } else {
      window.prompt('Copy this link:', window.location.href);
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window === 'undefined') return;
    const text = encodeURIComponent(`Check out this furniture: ${furniture?.name ?? ''}\n${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShareOpen(false);
  };


  if (isLoading || isUserCheckLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">Loading...</div>
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
              <CardFooter className="flex flex-col gap-2 pt-4">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Dialog open={shareOpen} onOpenChange={setShareOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full gap-2" type="button">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share Furniture</DialogTitle>
                        <DialogDescription>Select an app to share this furniture item.</DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-2 mt-2">
                        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                          <Button onClick={handleNativeShare} className="w-full" type="button">
                            Share via Device Apps
                          </Button>
                        )}
                        <Button onClick={handleWhatsAppShare} className="w-full bg-green-500 hover:bg-green-600 text-white" type="button">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="h-4 w-4 inline-block mr-2"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.236 6.393L4 29l7.824-2.05C13.41 27.634 14.686 28 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.18 0-2.334-.207-3.424-.615l-.245-.09-4.646 1.217 1.24-4.53-.16-.234C7.23 18.13 6.5 16.6 6.5 15c0-5.238 4.262-9.5 9.5-9.5s9.5 4.262 9.5 9.5-4.262 9.5-9.5 9.5zm5.07-6.13c-.276-.138-1.637-.808-1.89-.9-.253-.092-.437-.138-.62.138-.184.276-.713.9-.874 1.085-.161.184-.322.207-.598.069-.276-.138-1.166-.43-2.222-1.37-.822-.733-1.377-1.64-1.54-1.916-.161-.276-.017-.425.122-.563.126-.125.276-.322.414-.483.138-.161.184-.276.276-.46.092-.184.046-.345-.023-.483-.069-.138-.62-1.497-.85-2.05-.224-.54-.452-.467-.62-.476l-.527-.01c-.161 0-.46.069-.701.322-.241.253-.92.9-.92 2.192 0 1.292.943 2.54 1.074 2.717.138.184 1.857 2.834 4.5 3.862.63.272 1.12.434 1.504.555.632.202 1.208.174 1.663.106.508-.075 1.637-.668 1.87-1.312.23-.644.23-1.196.161-1.312-.069-.115-.253-.184-.529-.322z"/></svg>
                          WhatsApp
                        </Button>
                        <Button onClick={handleCopyLink} className="w-full" type="button">
                          Copy Link
                        </Button>
                      </div>
                      <DialogFooter>
                        <Button variant="secondary" onClick={() => setShareOpen(false)} type="button">Close</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                {/* Only show Edit/Delete if user is a carpenter */}
                {isCarpenter && (
                  <div className="flex w-full flex-col sm:flex-row gap-2 mt-2">
                    <Link href={`/furniture/${id}/edit`} passHref className="w-full">
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
