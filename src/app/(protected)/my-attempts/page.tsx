import { currentUser } from '@clerk/nextjs/server'
import MyAttemptsContainer from './my-attempts-container'
import { redirect } from 'next/navigation';
import { PageRoutes } from '@/constants/page-routes';

const MyAttemptsPage = async () => {

  const user = await currentUser();

  if (!user) {
    redirect(PageRoutes.SIGN_IN);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold">My Test Attempts</h1>
        <p className="text-muted-foreground">View your recent test attempts and performance metrics</p>
      </div>
      <MyAttemptsContainer clerkUserId={user?.id} />
    </div>
  )
}

export default MyAttemptsPage