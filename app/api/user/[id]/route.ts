import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.query);
  try {
    const userId = req.query.id as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        nickname: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
