import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/app/prismadb";

export async function PATCH(request: NextRequest) {
  const { storyId, topics }: { storyId: string; topics: string[] } =
    await request.json();
  if (!storyId) {
    throw new Error("No Story ID was found");
  }

  const story = await prisma.story.findUnique({
    where: { id: storyId },
  });
  if (!story) {
    throw new Error("No Story was found");
  }

  try {
    const updatedStory = await prisma.story.update({
      where: { id: storyId },
      data: {
        publish: true,
        topics: topics,
      },
    });

    // return NextResponse.json(
    //   { message: "Successfully published the story", storyId: updatedStory },
    //   { status: 200 }
    // );
    return NextResponse.json(updatedStory);
  } catch (error) {
    console.log("Error publishing story", error);
    return NextResponse.error();
  }
}
