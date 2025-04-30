import React from "react";

export default async function SingleStoryPage({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const { storyId } = await params;
  console.log(storyId);

  return <div>page</div>;
}
