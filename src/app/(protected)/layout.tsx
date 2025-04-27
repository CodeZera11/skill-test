import PublicNav from "@/components/landing/public-nav"


const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {


  return (
    <div>
      <PublicNav />
      {children}
    </div>
  )
}

export default ProtectedLayout