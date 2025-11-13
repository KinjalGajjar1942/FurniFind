
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wrench } from 'lucide-react';
import { fixCorsAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

export default function Header() {
  const { toast } = useToast();
  const [isFixing, setIsFixing] = React.useState(false);

  const handleFixCORS = async () => {
    setIsFixing(true);
    try {
      const result = await fixCorsAction();
      if (result.success) {
        toast({
          title: 'CORS Fixed!',
          description: "The storage policy was updated. Please try uploading again.",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Fixing CORS',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/">
          <h1 className="text-3xl font-headline font-bold text-primary">
            FurniFind
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <Button onClick={handleFixCORS} variant="outline" disabled={isFixing}>
            <Wrench className="mr-2 h-4 w-4" />
            {isFixing ? 'Fixing...' : 'Fix CORS'}
          </Button>
          <Button asChild>
            <Link href="/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Furniture
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
