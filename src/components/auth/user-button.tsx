import { UserButton } from '@clerk/nextjs'
import { Layout } from 'lucide-react'
import { redirect } from 'next/navigation'

const ClerkUserButton = () => {

  return (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Action
          label="Dashboard"
          labelIcon={<Layout className='h-[16px] w-[16px]' />}
          onClick={() => redirect("/dashboard/categories")}
        />
      </UserButton.MenuItems>
    </UserButton>
  )
}

export default ClerkUserButton