'use client';

import { useState, useEffect } from 'react';
import type { Furniture } from '@/lib/types';
import { getAllFurniture } from '@/lib/firebase/client';
import { useFirestore, useUser } from '@/firebase';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

type GroupedFurniture = {
  [category: string]: Furniture[];
};

export default function HomePage() {
  const [groupedFurniture, setGroupedFurniture] = useState<GroupedFurniture>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    if (!firestore) return;

    const fetchFurniture = async () => {
      try {
        setIsLoading(true);
        const furnitureData = await getAllFurniture(firestore);
        
        const grouped = furnitureData.reduce((acc, item) => {
          const category = item.category || 'Uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(item);
          return acc;
        }, {} as GroupedFurniture);

        setGroupedFurniture(grouped);
        setError(null);
      } catch (err) {
        console.error("Error fetching furniture:", err);
        setError('Failed to load furniture. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFurniture();
  }, [firestore]);

  const categories = Object.keys(groupedFurniture);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-primary text-primary-foreground py-20 px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">Furniture Showcase</h1>
          <p className="mt-4 text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Discover and share beautiful furniture designs with your carpenter.
          </p>
          {!isUserLoading && isCarpenter && (
            <Link href="/add" passHref>
              <Button className="mt-8 gap-2" size="lg">
                <Plus /> Add New Furniture
              </Button>
            </Link>
          )}
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
           <div className="space-y-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-8 w-1/4 bg-muted rounded-md mb-6 animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="bg-card p-4 rounded-lg animate-pulse">
                      <div className="w-full h-48 bg-muted rounded-md"></div>
                      <div className="mt-4 h-6 w-3/4 bg-muted rounded"></div>
                      <div className="mt-2 h-4 w-1/4 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive text-lg">{error}</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="space-y-16">
            {categories.map((category) => (
              <motion.section 
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-headline font-bold mb-8 border-b pb-4">{category}</h2>
                <div 
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                >
                  {groupedFurniture[category].map((item) => (
                    <motion.div key={item.id} whileHover={{ y: -5 }}>
                      <Link href={`/furniture/${item.id}`} passHref>
                        <Card className="overflow-hidden h-full flex flex-col group">
                          <div className="relative w-full aspect-[4/3] overflow-hidden">
                            {item.images?.[0] ? (
                              <Image
                                src={item.images[0].url}
                                alt={item.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <span className="text-muted-foreground">No image</span>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4 flex-grow flex flex-col justify-between">
                            <div>
                              <h3 className="font-semibold text-lg truncate group-hover:text-primary">{item.name}</h3>
                              <Badge variant="outline" className="mt-2">{item.category}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">No Furniture Found</h2>
            <p className="mt-2 text-muted-foreground">Start by adding some beautiful furniture pieces to your showcase.</p>
            {!isUserLoading && isCarpenter && (
             <Link href="/add" passHref>
              <Button className="mt-6 gap-2">
                <Plus /> Add Furniture
              </Button>
            </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
