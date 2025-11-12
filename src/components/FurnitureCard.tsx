import Image from 'next/image';
import type { Furniture } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FurnitureCardProps {
  furniture: Furniture;
  className?: string;
}

export default function FurnitureCard({ furniture, className }: FurnitureCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1", className)}>
      <CardHeader className="p-0">
        <div className="aspect-video overflow-hidden">
          <Image
            src={furniture.imageUrl}
            alt={furniture.name}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={furniture.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="font-headline text-xl truncate">{furniture.name}</CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <p className="text-lg font-semibold text-primary">
          ${furniture.price.toFixed(2)}
        </p>
      </CardFooter>
    </Card>
  );
}
