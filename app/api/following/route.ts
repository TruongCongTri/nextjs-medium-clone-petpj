import prisma from "@/app/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId }: { userId: string | null } = await auth();
  if (!userId) {
    return NextResponse.json("User not present");
  }

  try {
    const { authorId } = await request.json();

    const followedCheck = await prisma.following.findFirst({
      where: {
        followingId: authorId,
        followerId: userId,
      },
    });

    if (followedCheck) {
      // If already followed, delete the existing follow
      await prisma.following.delete({
        where: {
          id: followedCheck.id,
        },
      });

      return NextResponse.json({
        message: "Unfollowed the author successfully",
      });
    } else {
      // If not followed, follow the author
      const followedStory = await prisma.following.create({
        data: {
          followingId: authorId,
          followerId: userId,
        },
      });

      return NextResponse.json(followedStory);
    }
  } catch (error) {
    console.error("Error following author:", error);
    return NextResponse.error();
  }
}
