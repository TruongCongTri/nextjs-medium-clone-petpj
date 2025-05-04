"use client";
import Select from "react-select";
import React, { useEffect } from "react";
import Image from "next/image";
import { Story } from "@prisma/client";
import { getStoryById } from "@/actions/getStories";

type SaveStoryPopupProps = {
  storyId: string;
  publishStory: (topics: string[]) => void;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  currentUserId: string;
  currentUserFirstName: string | null;
  currentUserLastName: string | null;
};
const SaveStoryPopup = ({
  storyId,
  publishStory,
  setShowPopup,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentUserId,
  currentUserFirstName,
  currentUserLastName,
}: SaveStoryPopupProps) => {
  const [story, setStory] = React.useState<Story>();
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>([]);

  useEffect(() => {
    const fetchStoryById = async () => {
      try {
        const result = await getStoryById(storyId);
        if (result.response) {
          setStory(result.response);
          
        }
      } catch (error) {
        console.log(`Error fetching story:`, error);
      }
    };
    fetchStoryById();
  });

  const topics = [
    { value: "Artificial Intelligence", label: "Artificial Intelligence" },
    { value: "Python", label: "Python" },
    { value: "Programming", label: "Programming" },
    { value: "Fashion", label: "Fashion" },
    { value: "World", label: "World" },
    { value: "Politics", label: "Politics" },
  ];

  if (!story) return null;

  // first 10 words for description

  const stripHtmlTags = (htmlString: string) => {
    return htmlString.replace(/<[^>]*>/g, "");
  };

  const contentWithoutH1 = story.content!.replace(
    /<h1[^>]*>[\s\S]*?<\/h1>/g,
    ""
  );

  const textWithoutHtml = stripHtmlTags(contentWithoutH1);

  const first10Words = textWithoutHtml.split(/\s+/).slice(0, 10).join(" ");

  // H1 tag for heading

  const h1Match = story.content!.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);

  const h1Element = h1Match ? h1Match[1] : "";

  const h1ElementWithoutTag = stripHtmlTags(h1Element);

  // img src for Image preview
  const ImageMatch = story.content!.match(
    /<img[^>]*src=["']([^"']*)["'][^>]*>/
  );
  const imgSrc = ImageMatch ? ImageMatch[1] : "";

  return (
    <div className="fixed bg-gray-50 w-full z-20 overflow-auto top-0 left-0 right-0 bottom-0">
      <span
        onClick={(e) => {
          e.preventDefault();
          setShowPopup(false);
        }}
        className="absolute top-4 right-6 text-3xl cursor-pointer"
      >
        &times;
      </span>
      <div className="max-w-[900px] mx-auto md:mt-28 mt-10 grid md:grid-cols-2 grid-cols-1 gap-14">
        <div className="max-md:hidden">
          <p className="font-semibold ">Story Preview</p>
          <div className="w-full h-[250px] bg-gray-100 rounded my-3 border-b-[1px] border-neutral-200">
            {imgSrc && (
              <Image
                src={imgSrc}
                alt="Preview Image"
                width={250}
                height={250}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <h1 className="border-b-[1px] border-neutral-200 text-[18px] font-semibold py-2">
            {h1ElementWithoutTag}
          </h1>
          <p className="border-b-[1px] border-neutral-200 py-2 text-sm text-neutral-500 pt-3">
            {first10Words}
          </p>
          <p className="font-medium text-sm pt-2">
            Note:{" "}
            <span className="font-normal text-neutral-500">
              Changes here will affect how your story appears in public places
              like Medium’s homepage and in subscribers’ inboxes — not the
              contents of the story itself.
            </span>
          </p>
        </div>
        <div className="">
          <p className="py-2 ">
            Publishing to:{" "}
            <span>
              {currentUserFirstName} {currentUserLastName}
            </span>
          </p>
          <p className="text-sm pb-3 pt-1">
            Add or change topics (up to 5) so readers know what your story is
            about
          </p>
          <Select
            placeholder="tags"
            isMulti
            onChange={(selectedValues) => {
              const values = selectedValues as {
                value: string;
                label: string;
              }[];
              const stringValues = values.map((val) => val.value);
              setSelectedTopics(stringValues);
            }}
            isOptionDisabled={() => selectedTopics?.length >= 5}
            name="topics"
            options={topics}
            className="basic-multi-select"
            classNamePrefix="Add a topic"
          />
          <button
            onClick={() => publishStory(selectedTopics)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white text-sm mt-8 cursor-pointer"
          >
            Publish now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveStoryPopup;
