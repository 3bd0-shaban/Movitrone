import { formatRoutes, getRoutes } from '@/utils/getRoutes';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

const baseDir = path.join(process.cwd(), 'src/app');

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const routes = getRoutes(baseDir);

    const formattedRoutes = formatRoutes(routes);

    return Response.json(formattedRoutes);
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' });
  }
}
