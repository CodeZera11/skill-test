import NewsTape from '@/components/landing/news-tape'
import PublicNav from '@/components/landing/public-nav'

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NewsTape />
      <PublicNav />
      {children}
    </div>
  )
}

export default PublicLayout