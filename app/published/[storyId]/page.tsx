import React from "react";
import Navbar from "@/components/layouts/Navbar";
import { getPublishedStoryById } from "@/actions/getStories";
import { getPublishedUser } from "@/actions/user";
import RenderStory from "@/components/published/RenderStory";
export default async function PublishedStoryPage({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;

  const publishedStory = await getPublishedStoryById(storyId);
  if (!publishedStory.response) {
    return <div>Story not found</div>;
  }

  const author = await getPublishedUser(publishedStory.response?.authorId);

  return (
    <div>
      <Navbar />
      <RenderStory
        authorFirstName={author.firstName}
        authorLastName={author.lastName}
        authorImage={author.imageUrl}
        publishedStory={publishedStory.response}
      />
    </div>
  );
}
