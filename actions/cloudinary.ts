import axios from "axios";

export const uploadImage = async (formData: FormData) => {
  const file = formData.get("file") as File;

  formData.append(
    "upload_preset",
    `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`
  );

  if (!file) {
    throw new Error("Image not found");
  }
  const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

  try {
    const response = await axios.post(cloudinaryUploadUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
};
