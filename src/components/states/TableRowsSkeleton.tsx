import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

interface TableRowsSkeletonProps {
  rows?: number
  columns?: number
  'data-testid'?: string
}

export function TableRowsSkeleton({
  rows = 8,
  columns = 6,
  'data-testid': testId = 'loading-state',
}: TableRowsSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow key={rowIdx} data-testid={rowIdx === 0 ? testId : undefined} aria-hidden="true">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <TableCell key={colIdx}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
