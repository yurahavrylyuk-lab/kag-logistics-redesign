import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

export function Field({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="field" className={cn('field', className)} {...props} />;
}

export function FieldGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="field-group" className={cn('field-group', className)} {...props} />;
}

export function FieldLabel({ className, ...props }: ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" className={cn('field-label', className)} {...props} />;
}

export function FieldDescription({ className, ...props }: ComponentProps<'p'>) {
  return <p data-slot="field-description" className={cn('field-description', className)} {...props} />;
}

export function FieldError({ className, ...props }: ComponentProps<'p'>) {
  return <p role="alert" data-slot="field-error" className={cn('form-error', className)} {...props} />;
}
