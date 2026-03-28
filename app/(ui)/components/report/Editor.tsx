"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  date: string;
  initialContent: string;
}

export default function ReportEditor({ date, initialContent }: Props) {
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [content]);

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, content }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What happened today?"
        rows={8}
        className="w-full rounded-xl border bg-white px-4 py-3 text-base text-black resize-none outline-none focus:ring-2 focus:ring-black min-h-[200px]"
      />
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">
          {status === "saved" && "Saved"}
          {status === "saving" && "Saving…"}
          {status === "error" && "Error saving"}
        </span>
        <button
          onClick={save}
          disabled={status === "saving" || !content.trim()}
          className="bg-black text-white rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-40 min-h-[44px]"
        >
          Save
        </button>
      </div>
    </div>
  );
}
