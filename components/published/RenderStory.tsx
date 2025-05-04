import { Story } from "@prisma/client";
import Image from "next/image";
import React from "react";
import FollowComponent from "./FollowComponent";
import { MoreHorizontal } from "lucide-react";

import ClapComponent from "./ClapComponent";
import CommentComponent from "./CommentComponent";
import SaveComponent from "./SaveComponent";
import ShareComponent from "./ShareComponent";
import { clapCount, clapCountByUser } from "../../actions/clap";
import { checkSaved } from "@/actions/save";
import { getCurrentUser } from "@/actions/user";
import { numberOfComments } from "@/actions/comment";

import "highlight.js/styles/github.css"

type Props = {
  authorFirstName: string | null;
  authorLastName: string | null;
  authorImage: string;
  publishedStory: Story;
};

const RenderStory = async ({
  authorFirstName,
  authorLastName,
  authorImage,
  publishedStory,
}: Props) => {
  const stripHtmlTags = (htmlString: string) => {
    return htmlString.replace(/<[^>]*>/g, "");
  };
  // H1 tag for heading

  const h1Match = publishedStory.content!.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);

  const h1Element = h1Match ? h1Match[1] : "";

  const h1ElementWithoutTag = stripHtmlTags(h1Element);
  // comment
  const currentUser = await getCurrentUser();

  // clap
  const clapCounts = await clapCount(publishedStory.id);
  const userClapCounts = await clapCountByUser(publishedStory.id);

  // save
  const savedStatus = await checkSaved(publishedStory.id);

  // total number of comments
  const totalComments = await numberOfComments(publishedStory.id);

  //render content
  const content = publishedStory.content!;
  const firstH1Match = content.match(/<h1[^>]*>[\s\S]*?<\/h1>/);

  const sanitizedContent = firstH1Match
    ? content.replace(firstH1Match[0], "")
    : content;

  const finalSanitizedContent = sanitizedContent.replace(
    /<h1[^>]*>[\s\S]*?<\/h1>|<select[^>]*>[\s\S]*?<\/select>|<textarea[^>]*>[\s\S]*?<\/textarea>/gi,
    ""
  );

  return (
    <div className="flex items-center justify-center mt-6 max-w-[800px] mx-auto">
      <div>
        <h1 className="text-4xl font-bold my-8">{h1ElementWithoutTag}</h1>
        <div className="flex items-center space-x-5">
          <Image
            src={authorImage}
            className="rounded-full "
            width={44}
            height={44}
            alt="User"
          />
          <div className="text-sm">
            <p>
              {authorFirstName} {authorLastName}{" "}
              <FollowComponent authorId={publishedStory.authorId} />
            </p>
            <p className="opacity-60">
              Published on{" "}
              {new Date(publishedStory.updatedAt)
                .toDateString()
                .split(" ")
                .slice(1, 4)
                .join(" ")}
            </p>
          </div>
        </div>
        <div className="border-y-[1px] border-neutral-200 py-3 mt-6 flex items-center justify-between px-3">
          <div className="flex items-center space-x-4">
            <ClapComponent
              storyId={publishedStory.id}
              clapCount={clapCounts}
              userClapCount={userClapCounts}
            />
            <CommentComponent
              totalComments={
                totalComments.response ? totalComments.response : 0
              }
              authorFirstName={currentUser.firstName}
              authorImage={currentUser.imageUrl}
              authorLastName={currentUser.lastName}
            />
          </div>
          <div className="flex items-center space-x-4">
            <SaveComponent
              storyId={publishedStory.id}
              savedStatus={savedStatus.status}
            />
            <ShareComponent />
            <button className="cursor-pointer">
              <MoreHorizontal size={24} className="opacity-80 text-green-800" />
            </button>
          </div>
        </div>
        <div
          className="prose my-5 font-mono max-w-[800px]"
          dangerouslySetInnerHTML={{ __html: finalSanitizedContent }}
        ></div>
      </div>
    </div>
  );
};

export default RenderStory;
