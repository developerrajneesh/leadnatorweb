"use client";

import { useEffect, useRef, useState } from "react";
import type { OutputData } from "@editorjs/editorjs";

type Props = {
  initialData?: OutputData;
  onChange?: (data: OutputData) => void;
};

export default function EditorJs({ initialData, onChange }: Props) {
  const holderRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<import("@editorjs/editorjs").default | null>(null);
  const onChangeRef = useRef(onChange);
  const initialDataRef = useRef(initialData);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  onChangeRef.current = onChange;

  useEffect(() => {
    let destroyed = false;

    async function init() {
      if (!holderRef.current || editorRef.current) return;

      try {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const List = (await import("@editorjs/list")).default;
        const ImageTool = (await import("@editorjs/image")).default;
        const Quote = (await import("@editorjs/quote")).default;
        const Delimiter = (await import("@editorjs/delimiter")).default;
        const Embed = (await import("@editorjs/embed")).default;
        const Warning = (await import("@editorjs/warning")).default;
        const Code = (await import("@editorjs/code")).default;
        const Marker = (await import("@editorjs/marker")).default;
        const InlineCode = (await import("@editorjs/inline-code")).default;

        if (destroyed || !holderRef.current) return;

        const editor = new EditorJS({
          holder: holderRef.current,
          data: initialDataRef.current,
          placeholder: "Start writing your story…",
          autofocus: false,
          minHeight: 280,
          defaultBlock: "paragraph",
          tools: {
            header: {
              class: Header,
              config: { levels: [2, 3, 4], defaultLevel: 2 },
              shortcut: "CMD+SHIFT+H",
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: { defaultStyle: "unordered" },
            },
            image: {
              class: ImageTool,
              config: {
                uploader: {
                  uploadByFile: async (file: File) => {
                    const form = new FormData();
                    form.append("file", file);
                    const res = await fetch("/api/studio/upload", { method: "POST", body: form });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || "Upload failed");
                    return data;
                  },
                },
              },
            },
            quote: { class: Quote, inlineToolbar: true },
            warning: Warning,
            delimiter: Delimiter,
            embed: {
              class: Embed,
              config: { services: { youtube: true, twitter: true } },
            },
            code: Code,
            marker: Marker,
            inlineCode: InlineCode,
          },
          onChange: async () => {
            if (!editorRef.current || !onChangeRef.current) return;
            const data = await editorRef.current.save();
            onChangeRef.current(data);
          },
        });

        await editor.isReady;
        if (destroyed) {
          editor.destroy();
          return;
        }
        editorRef.current = editor;
        setStatus("ready");
      } catch (err) {
        if (!destroyed) {
          setStatus("error");
          setErrorMessage(err instanceof Error ? err.message : "Editor failed to load");
        }
      }
    }

    init();

    return () => {
      destroyed = true;
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
      if (holderRef.current) holderRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div className="blog-editor-wrap">
      {status === "loading" && (
        <div className="studio-editor-loading">
          <span className="studio-editor-loading-dot" />
          Loading editor…
        </div>
      )}
      {status === "error" && (
        <div className="studio-editor-error">{errorMessage}</div>
      )}
      <div
        ref={holderRef}
        className={`blog-editor-holder${status === "ready" ? " is-ready" : ""}`}
      />
    </div>
  );
}
