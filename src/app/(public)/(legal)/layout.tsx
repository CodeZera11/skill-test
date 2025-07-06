import Footer from '@/components/landing/footer'
import React from 'react'

const LegalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}

export default LegalLayout