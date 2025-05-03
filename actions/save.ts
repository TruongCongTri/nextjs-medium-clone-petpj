"use server";
import prisma from "@/app/prismadb";
import { getCurrentUserId } from "./user";

export const checkSaved = async (storyId: string) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("User not found");
  try {
    const saved = await prisma.save.findFirst({
      where: {
        storyId: storyId,
        userId: userId,
      },
    });
    return { status: !!saved };
  } catch (error) {
    console.log("Error checking saved status:", error);
    return { status: false };
  }
};
