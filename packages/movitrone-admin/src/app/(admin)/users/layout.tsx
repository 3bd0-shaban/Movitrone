import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session?.role !== 'Super Admin') {
    return (
      <div className='flex h-3 items-center justify-center text-xl font-semibold text-red-500'>
        {"you don't have permssions to acceess this resorces"}
      </div>
    );
  }
  return <>{children}</>;
}
