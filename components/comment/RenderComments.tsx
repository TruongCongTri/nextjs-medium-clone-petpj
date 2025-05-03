import { getAllComments } from "@/actions/comment";
import { Clap, Comment } from "@prisma/client";
import React, { useState, useEffect } from "react";
import UserBadge from "./UserBadge";
import UserEngagement from "./UserEngagement";

export interface Comments extends Comment {
  replies: Comment[];
  Clap: Clap[];
}
const RenderComments = ({
  storyId,
  parentCommentId,
  setRefetch
}: {
  storyId: string;
  parentCommentId?: string;
  setRefetch?: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [comments, setComments] = useState<Comments[]>([]);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const result = await getAllComments(storyId, parentCommentId);
        if (result && result.response) {
          setComments(result.response);
        } else {
          console.log(result.error);
        }
      } catch (error) {
        console.log("Error fetching comments", error);
      }
    };
    fetchComments();
  }, []);

  return (
    <div className="mt-10 border-t-[1px] border-neutral-200">
      {comments.map((comment, idx) => {
        const clapCounts = comment.Clap.map((clap) => clap.clapCount);
        const totalClaps = clapCounts.reduce((acc, curr) => acc + curr, 0);
        return (
          <div
            key={idx}
            className="m-4 mt-5 py-4 border-b-[1px] border-neutral-100"
          >
            <UserBadge userId={comment.userId} createdAt={comment.createdAt} />
            <p className="py-3 text-neutral-600 text-sm ml-3">
              {comment.content}
            </p>
            <UserEngagement
              storyId={storyId}
              comment={comment}
              totalClaps={totalClaps}
            />
          </div>
        );
      })}
    </div>
  );
};

export default RenderComments;
