"use client";
import { checkFollowing } from "@/actions/following";
import { getCurrentUserId } from "@/actions/user";
import axios from "axios";
import React, { useState, useEffect } from "react";

type Props = {
  authorId: string;
};
const FollowComponent = ({ authorId }: Props) => {
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>();

  useEffect(() => {
    const fetchFollowingStatus = async () => {
      try {
        const response = await checkFollowing(authorId);
        if (response?.isFollowing) setIsFollowed(response?.isFollowing);
      } catch (error) {
        console.log(`error while fetching for the following status`, error);
      }
    };

    // 
    const fetchCurrentUserId = async () => {
      try {
        const userId = await getCurrentUserId();
        if (userId) setCurrentUserId(userId);
      } catch (error) {
        console.log("No user found", error);
      }
    };
    fetchFollowingStatus();
    fetchCurrentUserId();
  }, [authorId]);

  const followAuthor = async () => {
    setIsFollowed(!isFollowed);
    try {
      await axios.post("/api/following", {
        authorId: authorId,
      });
      console.log(`Success following author`);
    } catch (error) {
      console.log(`Error while following author`, error);
      setIsFollowed(!isFollowed);
    }
  };
  return (
    <span
      onClick={followAuthor}
      className={`font-medium cursor-pointer ${
        isFollowed ? "text-green-700" : "text-red-400"
      } ${currentUserId === authorId ? "hidden" : ""}`}
    >
      . {`${isFollowed ? "followed" : "follow"}`}
    </span>
  );
};

export default FollowComponent;
