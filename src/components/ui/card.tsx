// src/components/ui/card.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils/cn'; 

const cardVariants = cva(
  'bg-white shadow-lg rounded-2xl',
  {
    variants: {
      padding: {
        default: 'p-4',
        none: '',
      },
    },
    defaultVariants: {
      padding: 'default',
    },
  }
);

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export function Card({ className, padding, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ padding }), className)} {...props} />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6', className)} {...props} />
  );
}
