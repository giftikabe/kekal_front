import { useState, useRef } from "react";
import styles from "./DragList.module.css";

interface DragListProps<T extends { id: string }> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  disabled?: boolean;
}

export default function DragList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  disabled = false,
}: DragListProps<T>) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const dragItem = useRef<string | null>(null);

  const handleDragStart = (id: string) => {
    dragItem.current = id;
    setDragging(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setOver(id);
  };

  const handleDrop = (targetId: string) => {
    if (!dragItem.current || dragItem.current === targetId) {
      setDragging(null);
      setOver(null);
      return;
    }
    const from = items.findIndex((i) => i.id === dragItem.current);
    const to = items.findIndex((i) => i.id === targetId);
    const reordered = [...items];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    onReorder(reordered);
    setDragging(null);
    setOver(null);
    dragItem.current = null;
  };

  const handleDragEnd = () => {
    setDragging(null);
    setOver(null);
    dragItem.current = null;
  };

  return (
    <div className={styles.list}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`${styles.item} ${dragging === item.id ? styles.dragging : ""} ${over === item.id ? styles.over : ""}`}
          draggable={!disabled}
          onDragStart={() => handleDragStart(item.id)}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDrop={() => handleDrop(item.id)}
          onDragEnd={handleDragEnd}
        >
          {!disabled && (
            <div className={styles.handle} title="Drag to reorder" aria-hidden="true">
              ⠿
            </div>
          )}
          <div className={styles.content}>{renderItem(item, index)}</div>
        </div>
      ))}
    </div>
  );
}
