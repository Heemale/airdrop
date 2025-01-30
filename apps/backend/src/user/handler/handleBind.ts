import { Prisma } from '@prisma/client';
import { prisma } from '@/config/prisma';

export const handleBind = async (event: Prisma.UserCreateInput) => {
  try {
    await prisma.$transaction(async (tx) => {
      // 1.查询上级信息
      let inviter = await tx.user.findUnique({
        where: {
          address: event.inviter,
        },
      });
      if (!inviter) {
        inviter = await tx.user.upsert({
          where: {
            address: event.inviter,
          },
          update: {
            address: event.inviter,
            isBind: true,
            updateAt: Math.floor(Date.now() / 1000),
          },
          create: {
            address: event.inviter,
            isBind: true,
            createAt: Math.floor(Date.now() / 1000),
            updateAt: Math.floor(Date.now() / 1000),
          },
        });
      }

      // 2. 登记用户信息
      const user = await tx.user.upsert({
        where: {
          address: event.address,
        },
        update: {
          inviterId: inviter.id,
          ...event,
          updateAt: Math.floor(Date.now() / 1000),
        },
        create: {
          inviterId: inviter.id,
          ...event,
          createAt: Math.floor(Date.now() / 1000),
          updateAt: Math.floor(Date.now() / 1000),
        },
      });

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
      await tx.user.upsert({
        where: {
          address: inviterNewData.address,
        },
        update: {
          ...inviterNewData,
          updateAt: Math.floor(Date.now() / 1000),
        },
        create: {
          ...inviterNewData,
          createAt: Math.floor(Date.now() / 1000),
          updateAt: Math.floor(Date.now() / 1000),
        },
      });
    });
  } catch (error) {
    console.error('Error in handleBind:', error.message);
    throw error;
  }
};
