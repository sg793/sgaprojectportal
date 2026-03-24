import * as React from 'react'
import { cn } from '@/lib/utils'

export function Progress({ value = 0, className }: { value?: number; className?: string }) {
  const safeValue = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('relative w-full overflow-hidden rounded-full bg-neutral-200', className)}>
      <div className="h-full bg-neutral-900 transition-all duration-500 ease-out" style={{ width: `${safeValue}%` }} />
    </div>
  )
}
