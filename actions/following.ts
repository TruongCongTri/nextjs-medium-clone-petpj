"use server";
import prisma from "@/app/prismadb";
import { getCurrentUserId } from "./user";

export const checkFollowing = async (authorId: string) => {
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return;
  try {
    const isFollowed = await prisma.following.findFirst({
      where: {
        followingId: authorId,
        followerId: currentUserId,
      },
    });
    return { isFollowing: !!isFollowed };
  } catch (error) {
    return { isFollowing: false };
  }
};

export const numberOfFollowers = async (authorId: string) => {
  try {
    const num = await prisma.following.aggregate({
      where: { followingId: authorId },
      _count: true,
    });

    return { followers: JSON.parse(JSON.stringify(num._count)) };
  } catch (error) {
    return { followers: 0 };
  }
};
