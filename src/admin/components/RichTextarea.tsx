import { useRef, useEffect } from "react";
import styles from "./RichTextarea.module.css";

interface RichTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: number;
}

export default function RichTextarea({
  value,
  onChange,
  placeholder,
  disabled = false,
  minHeight = 120,
}: RichTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.max(minHeight, el.scrollHeight) + "px";
  }, [value, minHeight]);

  const insertFormat = (before: string, after: string = "") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const newValue =
      value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(newValue);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(
        start + before.length,
        start + before.length + selected.length,
      );
    }, 0);
  };

  const toolbarActions = [
    { label: "B", title: "Bold", action: () => insertFormat("**", "**") },
    { label: "I", title: "Italic", action: () => insertFormat("_", "_") },
    { label: "•", title: "Bullet list", action: () => insertFormat("\n- ") },
    { label: "1.", title: "Numbered list", action: () => insertFormat("\n1. ") },
    { label: "——", title: "Divider", action: () => insertFormat("\n---\n") },
  ];

  return (
    <div className={`${styles.wrap} ${disabled ? styles.disabled : ""}`}>
      {!disabled && (
        <div className={styles.toolbar}>
          {toolbarActions.map((a) => (
            <button
              key={a.label}
              type="button"
              title={a.title}
              className={styles.toolbarBtn}
              onClick={a.action}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{ minHeight }}
      />
    </div>
  );
}
