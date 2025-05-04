"use client";

import { UserButton } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import SaveStoryPopup from "./SaveStoryPopup";

type Props = {
  storyId: string;
  currentUserId: string;
  currentUserFirstName: string | null;
  currentUserLastName: string | null;
};
const NavbarStory = ({
  storyId,
  currentUserId,
  currentUserFirstName,
  currentUserLastName,
}: Props) => {
  const router = useRouter();
  const [showPopup, setShowPopup] = React.useState<boolean>(false);

  const publishStory = async (topics: string[]) => {
    try {
      const response = await axios.patch(`/api/publish-new-story`, {
        storyId,
        topics,
      });
      if (!response) {
        console.log(`error publishing story`);
      }
      console.log(`successfully publish story`);

      router.push(`/published/${response.data.id}`);
    } catch (error) {
      console.log(`Error publishing story:`, error);
    }
  };

  return (
    <div className="px-8 py-2 border-b-[1px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Image
              src="/medium-icon.svg"
              width={40}
              height={40}
              alt="Medium Logo"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-7">
          <button
            onClick={() => setShowPopup(!showPopup)}
            className="flex items-center opacity-90 hover:opacity-100 duration-100 ease-in cursor-pointer bg-green-600 hover:bg-green-700 text-[13px] text-white px-3 py-1 rounded-full"
          >
            Publish
          </button>
          <UserButton signInUrl="/" />
        </div>
      </div>
      {showPopup && (
        <SaveStoryPopup
          storyId={storyId}
          publishStory={publishStory}
          setShowPopup={setShowPopup}
          currentUserId={currentUserId}
          currentUserFirstName={currentUserFirstName}
          currentUserLastName={currentUserLastName}
        />
      )}
    </div>
  );
};

export default NavbarStory;
