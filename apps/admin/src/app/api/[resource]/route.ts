import { defaultHandler } from 'ra-data-simple-prisma';
import { prismaClient } from '@/config/prisma';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  const body = await req.json();
  const result = await defaultHandler(body, prismaClient);
  return new NextResponse(
    JSON.stringify(result, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value,
    ),
    { headers: { 'Content-Type': 'application/json' } },
  );
};

export { handler as GET, handler as POST };
