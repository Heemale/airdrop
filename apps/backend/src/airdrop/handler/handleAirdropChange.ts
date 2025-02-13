import { Prisma } from '@prisma/client';
import { prisma } from '@/config/prisma';

export const handleAirdropChange = async (
  event: Prisma.AirdropUncheckedCreateInput,
) => {
  await prisma.$transaction(async (tx) => {
    // 由于 update 不能修改 id，所以要去掉 id
    const { id, ...updatedAirdropData } = {
      ...event,
      round: BigInt(event.round),
    };

    await tx.airdrop.upsert({
      where: { id: Number(event.id) }, // `id` 是唯一键
      update: updatedAirdropData, // `update` 不包含 `id`
      create: { ...event, round: BigInt(event.round) }, // `create` 需要 `id`
    });
  });
};
