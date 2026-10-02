import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { fn } from '@storybook/test'
import { UserDetailsDrawer } from './UserDetailsDrawer'
import { Button } from '@/components/ui/button'
import { fixtureUsers } from '@/modules/users/mocks/fixtures'

const baseUser = fixtureUsers[0]!
const pendingUser = fixtureUsers.find((u) => u.status === 'pending') ?? baseUser

const meta = {
  title: 'Users/UserDetailsDrawer',
  component: UserDetailsDrawer,
  tags: ['autodocs'],
  parameters: {
    // Sheet usa createPortal(document.body); em Docs autodocs multiplas stories
    // com open=true sobrepõem a UI. Forçar iframe isola cada story num sandbox.
    docs: {
      story: { inline: false, iframeHeight: 600 },
    },
  },
  args: {
    open: true,
    onOpenChange: fn(),
  },
} satisfies Meta<typeof UserDetailsDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  args: {
    user: baseUser,
  },
}

export const PendingUserMissingLastLogin: Story = {
  args: {
    user: pendingUser,
  },
}

export const Loading: Story = {
  args: {
    user: null,
    isLoading: true,
  },
}

export const ErrorState: Story = {
  args: {
    user: null,
    error: {
      code: 'USER_NOT_FOUND',
      message: 'Usuário não encontrado ou foi removido.',
    },
    onRetry: fn(),
  },
}

export const NoSelection: Story = {
  args: {
    user: null,
  },
}

function Controlled(args: React.ComponentProps<typeof UserDetailsDrawer>) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Abrir drawer</Button>
      <UserDetailsDrawer {...args} open={open} onOpenChange={setOpen} />
    </div>
  )
}

export const Interactive: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    user: baseUser,
    open: false,
  },
}
