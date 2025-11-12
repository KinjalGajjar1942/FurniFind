import Image from 'next/image';
import type { Furniture } from '@/lib/types';
import {
  Card,
  CardContent,
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
    <Card className={cn("overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1", className)}>
      <CardHeader className="p-0">
        <div className="aspect-video overflow-hidden">
          <Image
            src={furniture.images[0].url}
            alt={furniture.name}
            width={600}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={furniture.images[0].hint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="font-headline text-xl truncate">{furniture.name}</CardTitle>
      </CardContent>
    </Card>
  );
}
