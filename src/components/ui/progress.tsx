import type { ComponentProps } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

export function Progress({ className, value, max = 100, ...props }: ComponentProps<typeof ProgressPrimitive.Root>) {
  const percentage = value == null ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <ProgressPrimitive.Root data-slot="progress" className={cn('progress', className)} value={value} max={max} {...props}>
      <ProgressPrimitive.Indicator data-slot="progress-indicator" className="progress-indicator" style={{ transform: `translateX(-${100 - percentage}%)` }} />
    </ProgressPrimitive.Root>
  );
}
