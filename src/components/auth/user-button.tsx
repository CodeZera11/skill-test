"use client"

import { checkRole } from '@/actions/user'
import { PageRoutes } from '@/constants/page-routes'
import { UserButton } from '@clerk/nextjs'
import { Layout } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'

const ClerkUserButton = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const isAdmin = await checkRole("admin");
      setIsAdmin(isAdmin);
    }

    checkUserRole();
  }, [])

  return (
    <UserButton>
      <UserButton.MenuItems>
        {isAdmin && (
          <UserButton.Action
            label="Dashboard"
            labelIcon={<Layout className='h-[16px] w-[16px]' />}
            onClick={() => redirect(PageRoutes.DASHBOARD.TOPICS)}
          />
        )}
        {!isAdmin && (
          <UserButton.Action
            label="My Attempts"
            labelIcon={<Layout className='h-[16px] w-[16px]' />}
            onClick={() => redirect(PageRoutes.MY_ATTEMPTS)}
          />
        )}
      </UserButton.MenuItems>
    </UserButton>
  )
}

export default ClerkUserButton