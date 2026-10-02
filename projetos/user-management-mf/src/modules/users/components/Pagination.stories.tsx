import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { fn } from '@storybook/test'
import { Pagination } from './Pagination'

const meta = {
  title: 'Users/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    onPageChange: fn(),
    onPageSizeChange: fn(),
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const FirstPage: Story = {
  args: { page: 1, pageSize: 20, total: 247, totalPages: 13 },
}

export const MiddlePage: Story = {
  args: { page: 6, pageSize: 20, total: 247, totalPages: 13 },
}

export const LastPage: Story = {
  args: { page: 13, pageSize: 20, total: 247, totalPages: 13 },
}

export const SinglePage: Story = {
  args: { page: 1, pageSize: 20, total: 8, totalPages: 1 },
}

export const Empty: Story = {
  args: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
}

function InteractivePagination(args: React.ComponentProps<typeof Pagination>) {
  const [page, setPage] = useState(args.page)
  const [pageSize, setPageSize] = useState(args.pageSize)
  const totalPages = Math.max(1, Math.ceil(args.total / pageSize))
  return (
    <Pagination
      {...args}
      page={Math.min(page, totalPages)}
      pageSize={pageSize}
      totalPages={totalPages}
      onPageChange={setPage}
      onPageSizeChange={(s) => {
        setPageSize(s)
        setPage(1)
      }}
    />
  )
}

export const Interactive: Story = {
  render: (args) => <InteractivePagination {...args} />,
  args: { page: 1, pageSize: 20, total: 247, totalPages: 13 },
}
