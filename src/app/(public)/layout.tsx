import LandingNav from '@/components/landing/landing-nav'
import React from 'react'

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <LandingNav />
      {children}
    </div>
  )
}

export default PublicLayout