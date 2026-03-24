import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

export function Progress({ value = 0, className, ...props }: ProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('relative w-full overflow-hidden rounded-full bg-neutral-200', className)} {...props}>
      <div
        className="h-full bg-neutral-900 transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
