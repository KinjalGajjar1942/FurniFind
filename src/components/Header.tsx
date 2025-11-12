'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, PlusCircle, User as UserIcon } from 'lucide-react';
import { useAuth, getFirebaseAuth } from '@/lib/firebase/auth.tsx';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';

export default function Header() {
  const { user, loading } = useAuth();
  const auth = getFirebaseAuth();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  }

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/">
          <h1 className="text-3xl font-headline font-bold text-primary">
            FurniFind
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          {loading ? (
            <Skeleton className="h-10 w-24" />
          ) : user ? (
            <>
              <Button asChild>
                <Link href="/add">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Furniture
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={handleLogin}>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
