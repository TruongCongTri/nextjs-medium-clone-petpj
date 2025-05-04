"use server";
import prisma from "@/app/prismadb";

export const getStoryById = async (storyId: string) => {
  if (!storyId) {
    throw new Error("Story ID is required");
  }

  try {
    const storyById = await prisma.story.findUnique({
      where: {
        id: storyId,
      },
    });
    return { response: storyById };
  } catch (error) {
    console.log("Error fetching story by ID", error);
    return { error: "Error fetching story by ID" };
  }
};

export const getPublishedStoryById = async (storyId: string) => {
  if (!storyId) {
    throw new Error("Story ID is required");
  }

  try {
    const storyById = await prisma.story.findUnique({
      where: {
        id: storyId,
        publish: true,
      },
    });
    return { response: storyById };
  } catch (error) {
    console.log("Error fetching story by ID", error);
    return { error: "Error fetching story by ID" };
  }
};

export const getStoriesByAuthor = async (storyId: string, authorId: string) => {
  try {
    const authorStories = await prisma.story.findMany({
      where: {
        authorId,
        NOT: {
          id: storyId,
        },
        publish: true,
      },
    });

    return { response: authorStories };
  } catch (error) {
    console.log("error getting stories by author", error);

    return { error: "Error on getting stories by author" };
  }
};
