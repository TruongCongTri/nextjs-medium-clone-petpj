import { getStoryById } from "@/actions/getStories";
import NavbarStory from "@/components/story/NavbarStory";
import NewStory from "@/components/story/NewStory";
import React from "react";

export default async function SingleStoryPage({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;
  console.log(storyId);
  const storyContent = await getStoryById(storyId);
  return (
    <div className="max-w-[1000px] mx-auto">
      <NavbarStory />
      <NewStory
        storyId={storyId}
        storyContent={storyContent.response?.content}
      />
    </div>
  );
}
