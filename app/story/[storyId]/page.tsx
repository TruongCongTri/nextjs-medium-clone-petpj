import Navbar from "@/components/layouts/Navbar";
import NewStory from "@/components/story/NewStory";
import React from "react";

export default async function SingleStoryPage({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;
  console.log(storyId);

  return (
    <div className="max-w-[1000px] mx-auto">
      <Navbar />
      <NewStory />
    </div>
  );
}
