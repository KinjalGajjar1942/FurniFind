
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileX2 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4">
        <FileX2 className="w-24 h-24 text-muted-foreground mb-6" />
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            404 - Not Found
        </h1>
        <p className="mt-6 text-lg leading-7 text-muted-foreground">
            Oops! The page you&apos;re looking for doesn&apos;t seem to exist.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/" passHref>
                <Button>
                    Go back home
                </Button>
            </Link>
            <Link href="/add-furniture" passHref>
                 <Button variant="outline">
                    Report a problem
                 </Button>
            </Link>
        </div>
    </div>
  );
}
