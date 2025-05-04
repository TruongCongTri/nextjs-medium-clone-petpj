"use client";
import { clapCount, clapCountByUser } from "@/actions/clap";
import { checkSaved } from "@/actions/save";
import { Story } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import ClapComponent from "./ClapComponent";
import SaveComponent from "./SaveComponent";

type Props = {
  authorFirstName: string | null;
  authorLastName: string | null;
  authorImage: string;
  story: Story;
};
const AuthorStories = ({
  authorFirstName,
  authorLastName,
  authorImage,
  story,
}: Props) => {
  const [userClaps, setUserClaps] = useState<number>(0);
  const [totalClaps, setTotalClaps] = useState<number>(0);
  const [savedStatus, setSavedStatus] = useState<boolean>(false);

  useEffect(() => {
    const fetchClapCountByUser = async () => {
      try {
        const claps = await clapCountByUser(story.id);
        setUserClaps(claps);
      } catch (error) {
        console.log("Error fetching the user claps", error);
      }
    };

    const fetchTotalClaps = async () => {
      try {
        const claps = await clapCount(story.id);
        setTotalClaps(claps);
      } catch (error) {
        console.log("Error fetching the  claps", error);
      }
    };

    const fetchSavedStatus = async () => {
      try {
        const savedStatus = await checkSaved(story.id);
        if (savedStatus.status) setSavedStatus(savedStatus.status);
      } catch (error) {
        console.log("Error fetching the saved status", error);
      }
    };

    fetchSavedStatus();
    fetchTotalClaps();
    fetchClapCountByUser();
  }, [story.id]);

  const stripHtmlTags = (htmlString: string) => {
    return htmlString.replace(/<[^>]*>/g, "");
  };

  //
  const match = story.content!.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/);
  const imgSrc = match ? match[1] : "";
  const h1Match = story.content!.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);

  const h1Element = h1Match ? h1Match[1] : "";

  const finalH1Element = stripHtmlTags(h1Element);
  // Use stripHtmlTags to remove HTML tags
  const textWithoutHtml = stripHtmlTags(story.content!);

  // Split the text into words and select the first 20
  const first10Words = textWithoutHtml.split(/\s+/).slice(0, 10).join(" ");

  return (
    <Link key={story.id} href={`/published/${story.id}`}>
      <Image
        src={imgSrc ? imgSrc : "/no-image.jpg"}
        width={250}
        height={200}
        alt="Image"
      />
      <div className="flex items-center space-x-2 mt-5">
        <Image src={authorImage} width={20} height={20} alt="User" />
        <p className="text-xs font-medium">
          {authorFirstName} {authorLastName}
        </p>
      </div>
      <p className="font-bold mt-4">{finalH1Element}</p>
      <p className="mt-2 text-sm text-neutral-500">{first10Words} ...</p>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-4">
          <ClapComponent
            storyId={story.id}
            userClapCount={userClaps}
            clapCount={totalClaps}
          />
          <SaveComponent storyId={story.id} savedStatus={savedStatus} />
        </div>
      </div>
    </Link>
  );
};

export default AuthorStories;
