import { defaultHandler } from 'ra-data-simple-prisma';
import { prisma } from '@/config/prisma';
import { HttpException, HttpStatus } from '@nestjs/common';

export const handleCrudRequest = async (request: any, resource: string) => {
  try {
    const result = await defaultHandler(
      {
        ...request,
        resource,
      },
      prisma,
    );
    return handleBigInt(result);
  } catch (err) {
    throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
  }
};

export const handleBigInt = (result: any) => {
  return JSON.stringify(result, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  );
};
