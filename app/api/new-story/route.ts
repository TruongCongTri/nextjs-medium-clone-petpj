import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/app/prismadb";

export async function POST(request: NextRequest) {
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
    // return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const newStory = await prisma.story.create({
      data: {
        authorId: userId,
      },
    });
    return NextResponse.json(newStory, { status: 200 });
  } catch (error) {
    console.log("Error creating new story", error);
    // return NextResponse.json(
    //   { message: "Internal Server Error" },
    //   { status: 500 }
    // );
    return NextResponse.error();
  }
}

// upto save function
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
    // return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { storyId, content } = body;
  if (!storyId || !content) {
    throw new Error("Missing fields");
  }

  const story = await prisma.story.findUnique({
    where: { id: storyId },
  });

  if (!story) {
    throw new Error("Story not found");
  }

  try {
    await prisma.story.update({
      where: { id: storyId },
      data: {
        content,
      },
    });

    return NextResponse.json(
      { message: "Successfully save the story" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.error();
  }
}
