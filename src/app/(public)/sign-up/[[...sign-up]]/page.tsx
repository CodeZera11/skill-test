import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <section className='h-[calc(100vh-100px)] flex items-center justify-center'>
      <SignUp />
    </section >
  )
}