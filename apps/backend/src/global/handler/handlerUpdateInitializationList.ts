import { Prisma } from '@prisma/client';
import { prisma } from '@/config/prisma';

export const handlerUpdateInitializationList = async (
  event: Prisma.ObjectUncheckedUpdateInput,
) => {
  try {
    // 使用事务确保一致性
    await prisma.$transaction(async (tx) => {
      // 由于 update 不能修改 id，所以要去掉 id
      const { id, ...updatedInitializationList } = event;

      // 执行更新操作
      await tx.object.update({
        where: { id: Number(id) },
        data: updatedInitializationList,
      });
    });
  } catch (error) {
    console.error('Object change synchronization failed', error.message);
  }
};
