import type { Meta, StoryObj } from '@storybook/react'
import { TableRowsSkeleton } from './TableRowsSkeleton'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const meta = {
  title: 'States/TableRowsSkeleton',
  component: TableRowsSkeleton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Table>
        <TableHeader>
          <TableRow>
            {['Col A', 'Col B', 'Col C', 'Col D', 'Col E', 'Col F'].map((h) => (
              <TableHead key={h}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <Story />
        </TableBody>
      </Table>
    ),
  ],
} satisfies Meta<typeof TableRowsSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { rows: 8, columns: 6 },
}

export const FewRows: Story = {
  args: { rows: 3, columns: 6 },
}
