import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <section className='py-5 md:h-[calc(100vh-100px)] flex items-center justify-center'>
      <SignIn />
    </section >
  )
}