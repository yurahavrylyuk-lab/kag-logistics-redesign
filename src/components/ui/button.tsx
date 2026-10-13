import type { ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva('button', {
  variants: {
    variant: {
      default: 'button-primary',
      primary: 'button-primary',
      secondary: 'button-secondary',
      outline: 'button-outline',
      ghost: 'button-ghost',
      link: 'button-link',
      destructive: 'button-destructive',
    },
    size: { default: '', sm: 'button-sm', lg: 'button-lg', icon: 'button-icon' },
  },
  defaultVariants: { variant: 'primary', size: 'default' },
});

export function Button({ className, variant, size, asChild = false, ...props }: ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot : 'button';
  return <Component data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
