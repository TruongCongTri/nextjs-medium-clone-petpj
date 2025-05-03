"use client";
import React, { useState, useEffect } from "react";
import { Comments } from "./RenderComments";
import { clapCount } from "@/actions/clap";
import ClapComponent from "../published/ClapComponent";

import ReplyComments from "./ReplyComments";
import CommentArea from "./CommentArea";

type Props = {
  storyId: string;
  comment: Comments;
  totalClaps: number;
};
const UserEngagement = ({ storyId, comment, totalClaps }: Props) => {
  const [showCommentArea, setShowCommentArea] = useState<boolean>(false);
  const [showRepliedComments, setShowRepliedComments] =
    useState<boolean>(false);
  const [userClaps, setUserClaps] = useState<number>(0);

  useEffect(() => {
    const fetchClapCountsByUser = async () => {
      try {
        const claps = await clapCount(storyId, comment.id);
        setUserClaps(claps);
      } catch (error) {
        console.log("Error fetching the user clap counts", error);
      }
    };
    fetchClapCountsByUser();
  }, [storyId, comment.id]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ClapComponent
            storyId={storyId}
            clapCount={totalClaps}
            commentId={comment.id}
            userClapCount={userClaps || 0}
          />
          {comment.replies.length > 0 && (
            <button
              onClick={() => setShowRepliedComments(!showRepliedComments)}
              className="flex items-center space-x-2 text-sm opacity-80"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" className="ku">
                <path d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4 0 7.1 2.96 7.1 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"></path>
              </svg>
              {comment.replies.length} Replies
            </button>
          )}
          <div>
            <button
              onClick={() => setShowCommentArea(!showCommentArea)}
              className="text-sm opacity-80 cursor-pointer hover:opacity-100"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
      {showRepliedComments && (
        <ReplyComments storyId={comment.storyId} parentCommentId={comment.id} />
      )}
      {showCommentArea && (
        <div className="border-l-[3px] border-neutral-200 ml-5">
          <CommentArea
            setShowCommentArea={setShowCommentArea}
            commentId={comment.id}
          />
        </div>
      )}
    </div>
  );
};

export default UserEngagement;
