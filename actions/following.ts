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
