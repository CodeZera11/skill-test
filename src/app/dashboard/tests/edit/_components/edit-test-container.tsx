"use client"
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import EditTestForm from "./edit-test-form";

const EditTestContainer = ({ id }: { id: string }) => {

  const test = useQuery(api.tests.getTestWithDetails, { testId: id as Id<"tests"> })

  if (test === undefined) return <div className="h-[calc(100vh-120px)] flex items-center justify-center">Loading...</div>


  return (
    <div>
      <EditTestForm test={test} />
    </div>
  )
}

export default EditTestContainer