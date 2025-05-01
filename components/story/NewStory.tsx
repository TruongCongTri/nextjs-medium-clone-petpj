"use client";
import { Plus, Image, MoreHorizontal, Code } from "lucide-react";
import React, { useEffect } from "react";
import MediumEditor from "medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";
import "./new_story.css";
import { createRoot } from "react-dom/client";
import "highlight.js/styles/github.css"; // Import the desired theme CSS
import CodeBlock from "./CodeBlock";
import Divider from "./Divider";
import ImageBlock from "./ImageBlock";

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
      const imageComponent = (
        <ImageBlock imageUrl={localImageUrl} file={file} />
      );

      const wrapperDiv = document.createElement("div");
      const root = createRoot(wrapperDiv);
      root.render(imageComponent);

      contentEditableRef.current?.appendChild(wrapperDiv);
    }
  };

  // This function is used to insert a divider component into the contentEditable div.
  const insertDivider = () => {
    const dividerComponent = <Divider />;
    setOpenTools(false);

    const wrapperDiv = document.createElement("div");
    const root = createRoot(wrapperDiv);
    root.render(dividerComponent);

    contentEditableRef.current?.appendChild(wrapperDiv);
  };

  // This function is used to insert a code block component into the contentEditable div.
  const insertCodeBlock = () => {
    const codeBlockComponent = <CodeBlock />;
    setOpenTools(false);

    const wrapperDiv = document.createElement("div");
    const root = createRoot(wrapperDiv);
    root.render(codeBlockComponent);

    contentEditableRef.current?.appendChild(wrapperDiv);
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
  // This effect is used to set the position of the button when the user types in the contentEditable div.
  useEffect(() => {
    const handleInput = () => {
      const { y } = getCaretPosition();
      setButtonPosition({ top: y, left: -50 });
    };
    contentEditableRef.current?.addEventListener("input", handleInput);
  }, []);

  // This effect is used to set the functions for the contentEditable div and initialize the MediumEditor.
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
            onClick={insertDivider}
            className={`border-[1.5px] border-green-500 rounded-full block p-[6px] ${
              openTools ? "scale-100 visible" : "scale-0 invisible"
            } ease-linear duration-100 delay-75 bg-white cursor-pointer`}
          >
            <MoreHorizontal size={20} className="opacity-60 text-green-800" />
          </span>
          <span
            onClick={insertCodeBlock}
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

// add image to cloudinary and get the secure URL component
// const ImageComp = ({ imageUrl, file }: { imageUrl: string; file: File }) => {
//   const [currentImageUrl, setCurrentImageUrl] =
//     React.useState<string>(imageUrl);

//   const updateImageUrl = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       uploadImage(formData).then(
//         (secureImageUrl) => setCurrentImageUrl(secureImageUrl) // Set the secure URL to the state
//       );
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   };

//   useEffect(() => {
//     updateImageUrl();
//   }, [imageUrl]);
//   return (
//     <div className="py-3">
//       <div>
//         <img
//           src={currentImageUrl}
//           alt={currentImageUrl}
//           className="max-w-full h-[450px]"
//         />
//         <div className="text-center text-sm max-w-md mx-auto">
//           <p data-p-placeholder="Type caption for your image"></p>
//         </div>
//       </div>
//       <p data-p-placeholder="..."></p>
//     </div>
//   );
// };

// Divider component to separate the content in the editor
// const Divider = () => {
//   return (
//     <div className="py-3 w-full">
//       <div
//         className="text-center flex items-center justify-center "
//         contentEditable={false}
//       >
//         <MoreHorizontal size={32} />
//       </div>
//       <p data-p-placeholder="Write your text ..."></p>
//     </div>
//   );
// };

// const CodeBlock = () => {
//   const [language, setLanguage] = React.useState<string>("javascript");
//   const [code, setCode] = React.useState<string>("");
//   const [highlightedCode, setHighlightedCode] = useState<string>("");

//   console.log(code);

//   const handleLanguageChange = (
//     event: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     setLanguage(event.target.value);
//   };

//   const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//     event.preventDefault();
//     setCode(event.currentTarget.value || "");
//   };

//   const handlePaste = async () => {
//     try {
//       const clipboardData = await navigator.clipboard.readText();
//       console.log(clipboardData);

//       setCode((prev) => prev + clipboardData);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     const highlighted = hljs.highlight(code, {
//       language,
//       ignoreIllegals: true,
//     }).value;
//     setHighlightedCode(highlighted);
//   }, [language, code, highlightedCode]);

//   return (
//     <div className="w-full">
//       <div className="prose w-full relative bg-gray-50 rounded-sm p-5 focus:outline-none">
//         <div>
//           <select
//             contentEditable={false}
//             className="bg-gray-100 border-dotted border-[2px] rounded-sm p-1 text-stone-700"
//             defaultValue={language}
//             onChange={handleLanguageChange}
//           >
//             <option value="javascript">JavaScript</option>
//             <option value="python">Python</option>
//             <option value="java">Java</option>
//           </select>
//         </div>
//         <textarea
//           className="focus:outline-none p-2 w-full mt-4"
//           onChange={handleCodeChange}
//         />
//         <button
//           onClick={handlePaste}
//           className="absolute top-2 right-2 cursor-pointer"
//         >
//           <ClipboardPaste />
//         </button>
//         <div
//           className={`language-${language} text-base block overflow-auto p-3 focus:outline-none`}
//           dangerouslySetInnerHTML={{ __html: highlightedCode }}
//           style={{ whiteSpace: "pre-wrap" }}
//         ></div>
//       </div>
//       <p data-p-placeholder="Write your text ..."></p>
//     </div>
//   );
// };
