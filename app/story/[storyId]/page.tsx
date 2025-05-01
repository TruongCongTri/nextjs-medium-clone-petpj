import { getStoryById } from "@/actions/getStories";
import { getCurrentUser } from "@/actions/user";
import NavbarStory from "@/components/story/NavbarStory";
import NewStory from "@/components/story/NewStory";
import React from "react";

export default async function SingleStoryPage({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;

  const storyContent = await getStoryById(storyId);
  const user = await getCurrentUser();
  return (
    <div className="max-w-[1000px] mx-auto">
      <NavbarStory
        currentUserId={user.id}
        currentUserFirstName={user?.firstName}
        currentUserLastName={user?.lastName}
        storyId={storyId}
      />
      <NewStory
        storyId={storyId}
        storyContent={storyContent.response?.content}
      />
    </div>
  );
}
