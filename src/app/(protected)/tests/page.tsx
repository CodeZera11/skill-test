import TestsPageContainer from "./tests-page-container"

const TestsPage = () => {

  return (
    <TestsPageContainer />
    // <div className="container mx-auto py-10">
    //   <div className="flex justify-between items-center mb-6">
    //     <h1 className="text-3xl font-bold">Available Tests</h1>
    //     <Link href="/">
    //       <Button variant="outline">Back to Home</Button>
    //     </Link>
    //   </div>

    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //     {tests.map((test) => (
    //       <Card key={test._id}>
    //         <CardHeader>
    //           <CardTitle>{test.name}</CardTitle>
    //           <CardDescription>{test.description}</CardDescription>
    //         </CardHeader>
    //         <CardContent>
    //           <div className="grid grid-cols-3 gap-4 text-sm">
    //             <div>
    //               <p className="text-muted-foreground">Questions</p>
    //               <p className="font-medium">{test.totalQuestions}</p>
    //             </div>
    //             <div>
    //               <p className="text-muted-foreground">Duration</p>
    //               <p className="font-medium">{test.duration} mins</p>
    //             </div>
    //             <div>
    //               <p className="text-muted-foreground">Total Marks</p>
    //               <p className="font-medium">{test.totalMarks}</p>
    //             </div>
    //           </div>
    //         </CardContent>
    //         <CardFooter>
    //           <Link href={`/tests/${test._id}`} className="w-full">
    //             <Button className="w-full">View Test</Button>
    //           </Link>
    //         </CardFooter>
    //       </Card>
    //     ))}
    //   </div>
    // </div>
  )
}

export default TestsPage;