import prisma from "@/app/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { userId }: { userId: string | null } = await auth();
  if (!userId) throw new Error("No user found");

  try {
    const { storyId, commentId } = await request.json();

    const storyExist = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
    });

    if (!storyExist) {
      throw new Error("Story does not exist");
    }

    const clapped = await prisma.clap.findFirst({
      where: {
        storyId,
        userId,
        commentId
      },
    });

    if (clapped && clapped.clapCount < 50) {
      await prisma.clap.update({
        where: {
          id: clapped.id,
        },
        data: {
          clapCount: clapped.clapCount + 1,
        },
      });

      // return NextResponse.json("Clap updated!");
      return NextResponse.json({ message: "Clap updated" });
    } else {
      const clapStory = await prisma.clap.create({
        data: {
          userId,
          storyId: storyExist.id,
          clapCount: 1,
          commentId
        },
      });
      // return NextResponse.json("Clap created");
      return NextResponse.json(clapStory);
    }
  } catch (error) {
    console.log("Error clapping comment", error);
    return NextResponse.error();
  }
}
