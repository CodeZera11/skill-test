import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <section className='py-5 min-h-[calc(100vh-100px)] flex items-center justify-center'>
      <SignUp />
    </section >
  )
}