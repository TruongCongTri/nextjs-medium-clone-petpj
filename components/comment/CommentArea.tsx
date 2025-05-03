"use client";
import React, { useState } from "react";
import {} from "@/actions/comment";
import { usePathname } from "next/navigation";
import axios from "axios";

type Props = {
  commentId: string;
  setShowCommentArea: React.Dispatch<React.SetStateAction<boolean>>;
};
const CommentArea = ({ commentId, setShowCommentArea }: Props) => {
  const [content, setContent] = useState<string>();
  const pathname = usePathname();
  const storyId = pathname.split("/")?.[2] as string;

  const replyComments = async () => {
    try {
      await axios.post("/api/reply-comment", {
        storyId,
        content,
        parentCommentId: commentId,
      });
      setContent("");
      console.log("Success");
    } catch (error) {
      console.log("Error while replying to comment", error);
    }
  };
  return (
    <div className="m-4 shadow-md">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="what is your thoughts?"
        className="w-full h-[100px] p-3 focus:outline-none placeholder:text-sm text-sm mt-3"
      />
      <div className="flex flex-row-reverse p-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setShowCommentArea(false);
              setContent("");
            }}
            className="text-sm"
          >
            Cancel
          </button>
          <button
            onClick={replyComments}
            className="text-sm px-4 py-[6px] bg-green-500 rounded-full text-white"
          >
            Respond
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentArea;
