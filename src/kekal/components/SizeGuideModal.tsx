import { useEffect, useRef } from "react";
import styles from "./SizeGuideModal.module.css";

interface SizeGuideModalProps {
  sizeGuide: string;
  onClose: () => void;
}

export default function SizeGuideModal({ sizeGuide, onClose }: SizeGuideModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const lines = sizeGuide.split("\n").filter((line) => line.trim() !== "");
  const headers = (lines[0] ?? "").split("|").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => line.split("|").map((cell) => cell.trim()));

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Size Guide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>Size Guide</h3>
          <button ref={closeBtnRef} className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.footer}>All measurements are approximate.</div>
      </div>
    </div>
  );
}