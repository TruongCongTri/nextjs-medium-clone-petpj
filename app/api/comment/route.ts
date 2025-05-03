import prisma from "@/app/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) throw new Error("No user found");

  try {
    const body = await request.json();
    const { storyId, content } = body;

    if (!storyId || !content) {
      throw new Error("Insufficient data");
    }

    const existingStory = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
    });

    if (!existingStory) {
      throw new Error("No stories were found to comment");
    }

    const newComment = await prisma.comment.create({
      data: {
        userId: userId,
        storyId: storyId,
        content: content,
      },
    });

    return NextResponse.json("Successfully commented on story");
  } catch (error) {
    console.log("Error in commenting", error);
    return NextResponse.error();
  }
}
