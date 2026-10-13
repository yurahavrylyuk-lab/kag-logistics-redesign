import type { ComponentProps } from 'react';
import { SectionChoreography } from '@/features/motion/SectionChoreography';

/** Run route DOM enhancement inside the same boundary as its hydrated content. */
export function RouteMain(props: ComponentProps<'main'>) {
  return <><main {...props} /><SectionChoreography /></>;
}
