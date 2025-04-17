import { McqCreationForm } from "@/forms/mcq-creation-form"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">MCQ Questions Creator</h1>
      <McqCreationForm />
    </main>
  )
}
