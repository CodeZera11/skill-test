import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <section className='pb-24 pt-32 sm:pt-40 w-full'>
      <div className='container flex max-w-5xl mx-auto items-center justify-center'>
        <SignIn />
      </div>
    </section>
  )
}