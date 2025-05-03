"use client";
import axios from "axios";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import RenderComments, { Comments } from "../comment/RenderComments";
import { getAllComments } from "@/actions/comment";

type Props = {
  authorFirstName: string | null;
  authorLastName: string | null;
  authorImage: string;
  totalComments: number;
};
const CommentComponent = ({
  authorFirstName,
  authorLastName,
  authorImage,
  totalComments,
}: Props) => {
  const [showSideComp, setShowSideComp] = useState<boolean>(false);
  const [content, setContent] = useState<string>();

  const pathname = usePathname();
  const storyId = pathname.split("/")?.[2] as string;

  const [comments, setComments] = useState<Comments[]>([]);
  const [refetchComment, setRefetchComment] = useState<boolean>(false);

  const commentStory = async () => {
    try {
      await axios.post("/api/comment", {
        storyId,
        content,
      });
      setContent("");
      console.log("Success");
    } catch (error) {
      console.log("Error while commenting on story", error);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const result = await getAllComments(storyId);
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
  }, [refetchComment]);

  return (
    <div>
      <button
        onClick={() => setShowSideComp(!showSideComp)}
        className="flex items-center opacity-60 cursor-pointer hover:opacity-100"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" className="ku">
          <path d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4 0 7.1 2.96 7.1 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"></path>
        </svg>
        <p className="text-sm">{totalComments}</p>
      </button>
      <div
        className={`h-screen fixed top-0 right-0 w-[400px] shadow-xl bg-white z-20 duration-200 ease-linear transform overflow-y-scroll ${
          showSideComp ? "translate-x-0" : "translate-x-[450px]"
        }`}
      >
        <div className="px-6 pt-6 flex items-center justify-between">
          <p className="font-medium ">Responses ({totalComments})</p>
          <span
            onClick={() => setShowSideComp(false)}
            className="cursor-pointer opacity-60 scale-150 hover:opacity-100"
          >
            &times;
          </span>
        </div>
        <div className="m-4 shadow-md ">
          <div className="flex items-center space-x-3 px-3 pt-3">
            <Image
              src={authorImage}
              width={32}
              height={32}
              alt="User"
              className="rounded-full"
            />
            <div className="text-sm">
              <p>
                {authorFirstName} {authorLastName}
              </p>
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="what is your thoughts?"
            className="w-full h-[100px] p-3 focus:outline-none placeholder:text-sm text-sm mt-3"
          />
          <div className="flex flex-row-reverse p-3">
            <div className="flex items-center space-x-4">
              <button onClick={() => setContent("")} className="text-sm">
                Cancel
              </button>
              <button
                onClick={commentStory}
                className="text-sm px-4 py-[6px] bg-green-500 rounded-full text-white"
              >
                Respond
              </button>
            </div>
          </div>
        </div>
        <RenderComments setRefetch={setRefetchComment} storyId={storyId} />
      </div>
    </div>
  );
};

export default CommentComponent;
