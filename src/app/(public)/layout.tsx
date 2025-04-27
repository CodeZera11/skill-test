import PublicNav from '@/components/landing/public-nav'

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <PublicNav />
      {children}
    </div>
  )
}

export default PublicLayout