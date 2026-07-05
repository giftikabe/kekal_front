import styles from "./SizeSelector.module.css";

const STANDARD_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

interface SizeSelectorProps {
  value: string[];
  onChange: (sizes: string[]) => void;
  disabled?: boolean;
}

export default function SizeSelector({ value, onChange, disabled = false }: SizeSelectorProps) {
  const toggle = (size: string) => {
    if (disabled) return;
    if (value.includes(size)) {
      onChange(value.filter((s) => s !== size));
    } else {
      onChange([...value, size]);
    }
  };

  return (
    <div className={styles.wrap} role="group" aria-label="Available sizes">
      {STANDARD_SIZES.map((size) => (
        <button
          key={size}
          type="button"
          className={`${styles.size} ${value.includes(size) ? styles.selected : ""}`}
          onClick={() => toggle(size)}
          disabled={disabled}
          aria-pressed={value.includes(size)}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
