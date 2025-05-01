'use client'
import { uploadImage } from '@/actions/cloudinary';
import React, {useEffect} from 'react'

export default function ImageBlock({ imageUrl, file }: { imageUrl: string; file: File }) {
  const [currentImageUrl, setCurrentImageUrl] =
      React.useState<string>(imageUrl);
  
    const updateImageUrl = async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        uploadImage(formData).then(
          (secureImageUrl) => setCurrentImageUrl(secureImageUrl) // Set the secure URL to the state
        );
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };
  
    useEffect(() => {
      updateImageUrl();
    }, [imageUrl]);
    return (
      <div className="py-3">
        <div>
          <img
            src={currentImageUrl}
            alt={currentImageUrl}
            className="max-w-full h-[450px]"
          />
          <div className="text-center text-sm max-w-md mx-auto">
            <p data-p-placeholder="Type caption for your image"></p>
          </div>
        </div>
        <p data-p-placeholder="..."></p>
      </div>
    );
}
