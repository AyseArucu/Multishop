"use client";

import { useEditStore } from "@/store/useEditStore";
import { useEffect, useState, useRef } from "react";
import { FiEdit2 } from "react-icons/fi";

interface EditableTextProps {
  settingKey: string;
  defaultValue: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  multiline?: boolean;
}

export default function EditableText({
  settingKey,
  defaultValue,
  className = "",
  as: Component = "span",
  multiline = false
}: EditableTextProps) {
  const { isEditMode, draftSettings, updateDraftSetting } = useEditStore();
  const [content, setContent] = useState(defaultValue);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (draftSettings[settingKey] !== undefined) {
      setContent(draftSettings[settingKey]);
    } else {
      setContent(defaultValue);
    }
  }, [draftSettings, settingKey, defaultValue]);

  const handleBlur = () => {
    if (elementRef.current) {
      const newText = elementRef.current.innerText || "";
      if (newText !== draftSettings[settingKey]) {
        updateDraftSetting(settingKey, newText);
      }
    }
  };

  if (!isEditMode) {
    return <Component className={className}>{content}</Component>;
  }

  return (
    <div className={`relative inline-block group ${className}`}>
      <Component
        ref={elementRef}
        contentEditable={isEditMode}
        suppressContentEditableWarning={true}
        onBlur={handleBlur}
        className={`outline-none border-2 border-dashed border-transparent hover:border-primary-400 focus:border-primary-500 focus:bg-primary-50/50 rounded transition-all cursor-text min-w-[20px] ${multiline ? 'whitespace-pre-wrap' : 'whitespace-nowrap'} block`}
      >
        {content}
      </Component>
      <div className="absolute -top-3 -right-3 bg-primary-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-md">
        <FiEdit2 size={10} />
      </div>
    </div>
  );
}
