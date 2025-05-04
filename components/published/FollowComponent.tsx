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
    <button
      onClick={followAuthor}
      className={`py-2 px-4 p-2 rounded-full text-sm text-white cursor-pointer ${
        isFollowed ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"
      } ${currentUserId === authorId ? "hidden" : ""}`}
    >
      {`${isFollowed ? "Followed" : "Follow"}`}
    </button>
  );
};

export default FollowComponent;
