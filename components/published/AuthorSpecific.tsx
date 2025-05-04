"use client";
import { getStoriesByAuthor } from "@/actions/getStories";
import { Story } from "@prisma/client";
import { MailPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import FollowComponent from "./FollowComponent";
import AuthorStories from "./AuthorStories";
import { numberOfFollowers } from "@/actions/following";

type Props = {
  authorFirstName: string | null;
  authorLastName: string | null;
  authorImage: string;
  authorEmail: string;
  publishedStory: Story;
};
const AuthorSpecific = ({
  authorFirstName,
  authorLastName,
  authorImage,
  authorEmail,
  publishedStory,
}: Props) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [noOfFollowers, setNoOfFollowers] = useState<number>();

  useEffect(() => {
    const fetchAuthorStories = async () => {
      try {
        const stories = await getStoriesByAuthor(
          publishedStory.id,
          publishedStory.authorId
        );
        if (stories.response) setStories(stories.response);
      } catch (error) {
        console.log(`error loading data`, error);
      }
    };
    fetchAuthorStories();

    const fetchNoOfFollowers = async () => {
      try {
        const num = await numberOfFollowers(publishedStory.authorId);
        setNoOfFollowers(num.followers);
      } catch (error) {
        console.log("Error getting no of followers", error);
      }
    };
    fetchNoOfFollowers();
  }, [publishedStory, publishedStory.authorId]);

  return (
    <div className="bg-gray-50 py-10 ">
      <div className="max-w-[700px] mx-auto">
        <Image
          src={authorImage}
          width={72}
          height={72}
          alt="author"
          className="rounded-full"
        />
        <div className="flex items-center justify-between border-b-[1px] border-neutral-200 pb-4">
          <div className="">
            <p className="text-xl font-medium mt-5 ">
              Written by {authorFirstName} {authorLastName}
            </p>
            <p className="text-sm opacity-60 mt-1">{noOfFollowers || 0} followers</p>
          </div>
          <div className="flex items-center space-x-4">
            <FollowComponent authorId={publishedStory.authorId} />
            <Link
              href={`mailto:${authorEmail}`}
              className="py-2 px-4 bg-orange-600 hover:bg-orange-700 p-2 rounded-full text-sm"
            >
              <MailPlus size={18} className="text-white font-thin p-[1px]" />
            </Link>
          </div>
        </div>
        <p className="text-sm py-5 font-medium ">
          More from {authorFirstName} {authorLastName}
        </p>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-10">
          {stories.map((story) => (
            <AuthorStories
              key={story.id}
              authorFirstName={authorFirstName}
              authorImage={authorImage}
              authorLastName={authorLastName}
              story={story}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorSpecific;
