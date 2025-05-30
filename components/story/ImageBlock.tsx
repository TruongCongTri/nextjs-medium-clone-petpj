"use client";
import { imageUpload } from "@/actions/cloudinary";
import React, { useEffect, useState } from "react";

export default function ImageBlock({
  imageUrl,
  file,
  handleSave,
}: {
  imageUrl: string;
  file: File;
  handleSave: () => void;
}) {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(imageUrl);

  const updateImageUrl = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      await imageUpload(formData).then((SecureImageUrl) =>
        setCurrentImageUrl(SecureImageUrl)
      );
    } catch (error) {
      console.log("Error uploading the image", error);
    }
  };

  useEffect(() => {
    updateImageUrl().then(() => {
      handleSave();
    });
  }, [imageUrl]);
  return (
    <div className="py-3">
      <div>
        <img
          src={currentImageUrl}
          alt="Image"
          className="max-w-full h-[450px] mx-auto"
        />
        <div className="text-center text-sm max-w-md mx-auto">
          <p data-p-placeholder="Type caption for your image"></p>
        </div>
      </div>
      <p data-p-placeholder="..."></p>
    </div>
  );
}
