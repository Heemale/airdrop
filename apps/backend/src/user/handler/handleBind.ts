// import { Prisma } from '@prisma/client';
import { prisma } from '@/config/prisma';
import { upsertUser } from '@/user/dao/user.dao';

export const handleBind = async (event: any) => {
  try {
    await prisma.$transaction(async (tx) => {
      // 1.查询上级信息
      const inviter = await upsertUser(
        { address: event.inviter, isBind: true },
        tx,
      );

      // 2. 登记用户信息
      const user = await upsertUser(
        { ...event, inviterId: inviter.id, isBind: true },
        tx,
      );

      // 3. 更新上级用户的 sharerIds
      const sharerIds = inviter.sharerIds
        ? inviter.sharerIds.split(',').map((item) => Number(item.trim()))
        : [];
      if (sharerIds.includes(user.id)) {
        return;
      }
      const updatedSharerIds = inviter.sharerIds
        ? `${inviter.sharerIds},${user.id.toString()}`
        : user.id.toString();
      const inviterNewData = {
        address: inviter.address,
        sharerIds: updatedSharerIds,
      };
      await upsertUser({ ...inviterNewData }, tx);
    });
  } catch (error) {
    console.error('Error in handleBind:', error.message);
    throw error;
  }
};
