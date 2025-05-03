"use client";
import React, { useState, useEffect } from "react";
import { clapCount, clapCountByUser } from "@/actions/clap";
import RenderComments from "./RenderComments";

type Props = {
  storyId: string;
  parentCommentId: string;
};
const ReplyComments = ({ storyId, parentCommentId }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userClaps, setUserClaps] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalClaps, setTotalClaps] = useState<number>(0);

  useEffect(() => {
    const fetchClapCountsByUser = async () => {
      try {
        const claps = await clapCountByUser(storyId, parentCommentId);
        setUserClaps(claps);
      } catch (error) {
        console.log("Error fetching the user clap counts", error);
      }
    };

    const fetchTotalClaps = async () => {
      try {
        const claps = await clapCount(storyId, parentCommentId);
        setTotalClaps(claps);
      } catch (error) {
        console.log("Error fetching the total claps", error);
      }
    };

    fetchClapCountsByUser();
    fetchTotalClaps();
  }, [storyId]);

  return (
    <div>
      <RenderComments storyId={storyId} parentCommentId={parentCommentId} />
    </div>
  );
};

export default ReplyComments;
