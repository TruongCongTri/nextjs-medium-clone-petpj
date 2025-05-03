"use server";
import prisma from "@/app/prismadb";
import { log } from "console";

export const getAllComments = async (
  storyId: string,
  parentCommentId?: string
) => {
  if (!storyId) {
    throw new Error("No storyId provided");
  }

  try {
    if (!parentCommentId) {
      const comments = await prisma.comment.findMany({
        where: {
          storyId: storyId,
          parentCommentId: null,
        },
        include: {
          Clap: true,
          replies: true,
        },
      });
      return { response: comments };
    }
    const comments = await prisma.comment.findMany({
      where: {
        storyId: storyId,
        parentCommentId: parentCommentId,
      },
      include: {
        Clap: true,
        replies: true,
      },
    });
    return { response: comments };
  } catch (error) {
    log("Error in fetching comments", error);
    return { error: "Error getting the story comments" };
  }
};

export const numberOfComments = async (storyId: string) => {
  try {
    const commentsNo = await prisma.comment.aggregate({
      where: {
        storyId: storyId,
      },
      _count: true,
    });

    return {response: commentsNo._count};
  } catch (error) {
    console.log("Error getting number of comments", error);
    return { error: "Error getting number of comments" };
  }
};
