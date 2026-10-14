import type { ComponentProps } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

export function SheetOverlay({ className, ...props }: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return <DialogPrimitive.Overlay data-slot="sheet-overlay" className={cn('sheet-overlay', className)} {...props} />;
}

export function SheetContent({ className, children, side = 'right', ...props }: ComponentProps<typeof DialogPrimitive.Content> & { side?: 'top' | 'right' | 'bottom' | 'left' }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content data-slot="sheet-content" data-side={side} className={cn('sheet-content', className)} {...props}>
        {children}
        <DialogPrimitive.Close className="button button-ghost button-icon sheet-close" aria-label="Close">
          <X aria-hidden="true" size={20} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  );
}

export function SheetHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sheet-header" className={cn('sheet-header', className)} {...props} />;
}

export function SheetFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="sheet-footer" className={cn('sheet-footer', className)} {...props} />;
}

export function SheetTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="sheet-title" className={cn('sheet-title', className)} {...props} />;
}

export function SheetDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="sheet-description" className={cn('sheet-description', className)} {...props} />;
}
