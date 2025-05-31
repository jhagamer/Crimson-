
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={category.link} className="group block">
      <Card className={cn(
        "overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-xl h-full flex flex-col items-center justify-center text-center",
        category.bgColorClass || 'bg-muted/30'
      )}>
        <CardContent className="p-3 sm:p-4 w-full aspect-[3/2] sm:aspect-square flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2 sm:mb-3">
            <Image
              src={category.imageUrl}
              alt={category.name}
              layout="fill"
              objectFit="contain" // Changed to contain to better show icon-like images
              data-ai-hint={category.dataAiHint}
              className="group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
            {category.name}
          </h3>
        </CardContent>
      </Card>
    </Link>
  );
}
