"use client";

import { useMemo, useRef } from "react";
import SunEditor from "suneditor-react";
import type SunEditorCore from "suneditor/src/lib/core";
import "suneditor/dist/css/suneditor.min.css";

type Props = {
  initialHtml?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
};

const FULL_BUTTON_LIST = [
  ["undo", "redo"],
  ["font", "fontSize", "formatBlock"],
  ["paragraphStyle", "blockquote"],
  ["bold", "underline", "italic", "strike", "subscript", "superscript"],
  ["fontColor", "hiliteColor", "textStyle"],
  ["removeFormat"],
  "/",
  ["outdent", "indent"],
  ["align", "horizontalRule", "list", "lineHeight"],
  ["table", "link", "image", "video", "audio"],
  ["fullScreen", "showBlocks", "codeView"],
  ["preview", "print"],
];

export default function BlogSunEditor({ initialHtml = "", onChange, placeholder }: Props) {
  const editorRef = useRef<SunEditorCore | null>(null);

  const options = useMemo(
    () => ({
      height: "420",
      minHeight: "360",
      placeholder: placeholder ?? "Start writing your story…",
      buttonList: FULL_BUTTON_LIST,
      formats: ["p", "div", "h2", "h3", "h4", "h5", "h6"] as ("p" | "div" | "h2" | "h3" | "h4" | "h5" | "h6")[],
      font: [
        "Plus Jakarta Sans",
        "Arial",
        "Georgia",
        "Tahoma",
        "Trebuchet MS",
        "Verdana",
        "Courier New",
      ],
      imageAccept: "image/*",
      videoFileInput: false,
      audioFileInput: false,
      linkProtocol: "https://",
      linkRelDefault: { default: "noopener noreferrer" },
      linkTargetNewWindow: true,
      resizingBar: true,
      charCounter: true,
      charCounterType: "char" as const,
      showPathLabel: false,
      attributesWhitelist: {
        all: "style|class|id|data-.+",
        table: "border|cellpadding|cellspacing|width|height",
        tr: "rowspan|colspan",
        td: "rowspan|colspan|width|height",
      },
    }),
    [placeholder],
  );

  function handleImageUpload(
    files: File[],
    _info: object,
    uploadHandler: (response: {
      result?: { url: string; name: string; size: number }[];
      errorMessage?: string;
    }) => void,
  ): boolean {
    const file = files[0];
    if (!file) return false;

    void (async () => {
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/studio/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) {
          uploadHandler({ errorMessage: data.error || "Image upload failed" });
          return;
        }
        uploadHandler({
          result: [{ url: data.file.url, name: file.name, size: file.size }],
        });
      } catch {
        uploadHandler({ errorMessage: "Image upload failed" });
      }
    })();

    return false;
  }

  return (
    <div className="blog-suneditor-wrap">
      <SunEditor
        getSunEditorInstance={(instance) => {
          editorRef.current = instance;
        }}
        defaultValue={initialHtml}
        onChange={(html) => onChange?.(html)}
        onImageUploadBefore={handleImageUpload}
        setOptions={{
          ...options,
          formats: ["p", "div", "h2", "h3", "h4", "h5", "h6"] as ("p" | "div" | "h2" | "h3" | "h4" | "h5" | "h6")[],
        }}
        setDefaultStyle="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; line-height: 1.65; color: #0f172a;"
      />
    </div>
  );
}
