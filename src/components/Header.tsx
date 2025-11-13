
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Database, Wrench } from 'lucide-react';
import { fixCorsAction, seedDataAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

export default function Header() {
  const { toast } = useToast();
  const [isFixing, setIsFixing] = React.useState(false);
  const [isSeeding, setIsSeeding] = React.useState(false);

  const handleSeedData = async () => {
    setIsSeeding(true);
    const result = await seedDataAction();
    if (result.success) {
      toast({
        title: 'Success!',
        description: 'Categories have been seeded. You can now add furniture.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: result.message,
      });
    }
    setIsSeeding(false);
  };
 
  const handleFixCors = async () => {
    setIsFixing(true);
    const result = await fixCorsAction();
    if (result.success) {
      toast({
        title: 'Success!',
        description: 'CORS policy updated. Please try uploading an image again.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'CORS Fix Failed',
        description: result.message,
      });
    }
    setIsFixing(false);
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
           <Button onClick={handleSeedData} disabled={isSeeding} variant="outline" size="sm">
            <Database className="mr-2 h-4 w-4" />
            {isSeeding ? 'Seeding...' : 'Seed Categories'}
          </Button>
          <Button onClick={handleFixCors} disabled={isFixing} variant="outline" size="sm">
            <Wrench className="mr-2 h-4 w-4" />
            {isFixing ? 'Fixing...' : 'Fix CORS'}
          </Button>
        </div>
      </div>
    </header>
  );
}
