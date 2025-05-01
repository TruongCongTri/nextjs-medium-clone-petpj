"use server";
import prisma from "@/app/prismadb";
import { getCurrentUserId } from "./user";

export const clapCount = async (storyId: string, commentId?: string) => {
  try {
    if (!commentId) {
      const clap = await prisma.clap.aggregate({
        where: {
          storyId: storyId,
          commentId: null,
        },
        _sum: {
          clapCount: true,
        },
      });
      return clap._sum?.clapCount || 0;
    }
    const clap = await prisma.clap.aggregate({
      where: {
        storyId: storyId,
        commentId: commentId,
      },
      _sum: {
        clapCount: true,
      },
    });

    return clap._sum?.clapCount || 0;
  } catch (error) {
    return 0;
  }
};

export const clapCountByUser = async (storyId: string, commentId?: string) => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User not found");
  try {
    if (!commentId) {
      const clap = await prisma.clap.aggregate({
        where: {
          storyId: storyId,
          userId: userId,
          commentId: null,
        },
        _sum: {
          clapCount: true,
        },
      });
      return clap._sum?.clapCount || 0;
    }
    const clap = await prisma.clap.aggregate({
      where: {
        storyId: storyId,
        userId: userId,
        commentId: commentId,
      },
      _sum: {
        clapCount: true,
      },
    });

    return clap._sum?.clapCount || 0;
  } catch (error) {
    return 0;
  }
};
