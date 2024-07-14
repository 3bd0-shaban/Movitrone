import AdminWraper from '@/components/AdminWraper';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/signin');
  return <AdminWraper session={session}>{children}</AdminWraper>;
}
