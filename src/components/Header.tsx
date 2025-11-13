
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/">
          <h1 className="text-3xl font-headline font-bold text-primary">
            FurniFind
          </h1>
        </Link>
        <div className="flex items-center gap-4">
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
