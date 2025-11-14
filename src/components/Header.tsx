'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, UserPlus, ShieldCheck } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import React from 'react';
import { setCustomUserClaims } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export default function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/');
    }
  };

  

  const isAdminPage = pathname === '/admin';

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/">
          <h1 className="text-3xl font-headline font-bold text-primary">
            FurniFind
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          {isUserLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <>
             
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
