"use client";
import { Plus, Image, MoreHorizontal, Code } from "lucide-react";
import React, { useEffect } from "react";
import MediumEditor from "medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";
import "./new_story.css";
import { createRoot } from "react-dom/client";
import { uploadImage } from "../../actions/cloudinary";

const NewStory = () => {
  const contentEditableRef = React.useRef<HTMLDivElement | null>(null);

  const [openTools, setOpenTools] = React.useState<boolean>(false);
  const [buttonPosition, setButtonPosition] = React.useState<{
    top: number;
    left: number;
  }>({
    top: 0,
    left: 0,
  });
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const insertImageComp = () => {
    fileInputRef.current?.click();
  };

  // This function is used to handle the file input change event.
  // It creates a local URL for the selected image file and renders the ImageComp component with that URL.
  // It also sets the openTools state to false to hide the tools menu.
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setOpenTools(false);
      const localImageUrl = URL.createObjectURL(file);
      const imageComponent = <ImageComp imageUrl={localImageUrl} file={file} />;

      const wrapperDiv = document.createElement("div");
      const root = createRoot(wrapperDiv);
      root.render(imageComponent);

      contentEditableRef.current?.appendChild(wrapperDiv);
    }
  };

  // This function is used to get the caret position in the contentEditable div
  // and set the position of the button accordingly.
  const getCaretPosition = () => {
    let x = 0;
    let y = 0;
    const isSupported = typeof window.getSelection !== "undefined";
    if (isSupported) {
      const selection = window.getSelection() as Selection;
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getClientRects()[0];
        if (rect) {
          x = rect.left + window.scrollX;
          y = rect.top + window.scrollY - 80;
        }
      }
    }
    return { x, y };
  };

  useEffect(() => {
    const handleInput = () => {
      const { y } = getCaretPosition();
      setButtonPosition({ top: y, left: -50 });
    };
    contentEditableRef.current?.addEventListener("input", handleInput);
  }, []);

  useEffect(() => {
    if (typeof window.document !== "undefined") {
      const editor = new MediumEditor(".editable", {
        elementsContainer: document.getElementById("container") as HTMLElement,
        toolbar: {
          buttons: [
            "bold",
            "italic",
            "underline",
            "anchor",
            "h1",
            "h2",
            "h3",
            "quote",
          ],
        },
      });
      return () => {
        editor.destroy();
      };
    }
  }, []);

  return (
    <main
      className="max-w-[800px] mx-auto relative font-mono mt-5"
      id="container"
    >
      <div
        id="editable"
        ref={contentEditableRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        className="outline-none focus:outline-none editable max-w-[800px] prose"
        style={{ whiteSpace: "pre-line" }}
      >
        <h1 className="font-medium" data-h1-placeholder="Title"></h1>
        <p className="" data-p-placeholder="Write your story ..."></p>
      </div>
      <div
        className={`z-10 ${buttonPosition.top === 0 ? "hidden" : ""}`}
        style={{
          position: "absolute",
          top: buttonPosition.top,
          left: buttonPosition.left,
        }}
      >
        <button
          id="tooltip"
          className="border-[1px] border-neutral-500 p-1 rounded-full inline-block"
          onClick={() => setOpenTools(!openTools)}
        >
          <Plus
            className={`duration-300 ease-linear ${
              openTools ? "rotate-135" : ""
            }`}
          />
        </button>
        <div
          id="tool"
          className={`flex items-center space-x-4 absolute top-0 left-14 ${
            openTools ? "visible" : "invisible"
          }`}
        >
          <span
            className={`border-[1.5px] border-green-500 rounded-full block p-[6px] ${
              openTools ? "scale-100 visible" : "scale-0 invisible"
            } ease-linear duration-100 bg-white cursor-pointer`}
            onClick={insertImageComp}
          >
            <Image size={20} className="opacity-60 text-green-800" />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
          </span>
          <span
            className={`border-[1.5px] border-green-500 rounded-full block p-[6px] ${
              openTools ? "scale-100 visible" : "scale-0 invisible"
            } ease-linear duration-100 delay-75 bg-white cursor-pointer`}
          >
            <MoreHorizontal size={20} className="opacity-60 text-green-800" />
          </span>
          <span
            className={`border-[1.5px] border-green-500 rounded-full block p-[6px] ${
              openTools ? "scale-100 visible" : "scale-0 invisible"
            } ease-linear duration-100 delay-100 bg-white cursor-pointer`}
          >
            <Code size={20} className="opacity-60 text-green-800" />
          </span>
        </div>
      </div>
    </main>
  );
};

export default NewStory;

const ImageComp = ({ imageUrl, file }: { imageUrl: string; file: File }) => {
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
};
