import { useState } from "react";
import styles from "./ColorPicker.module.css";

const PRESET_COLORS = [
  "#000000", "#FFFFFF", "#F5F1E8", "#3A3A3A", "#264B73",
  "#D8C3A5", "#B7B7B7", "#8B4513", "#2F4F2F", "#4A4A6A",
  "#C9A96E", "#E8D5B7", "#5C3317", "#1C3A5C", "#6B4C3B",
  "#F0E6D3", "#2C2C2C", "#8B7355", "#4A7C59", "#9B4B4B",
];

interface ColorPickerProps {
  value: string[];
  onChange: (colors: string[]) => void;
  disabled?: boolean;
}

export default function ColorPicker({ value, onChange, disabled = false }: ColorPickerProps) {
  const [custom, setCustom] = useState("#000000");

  const toggle = (color: string) => {
    if (disabled) return;
    if (value.includes(color)) {
      onChange(value.filter((c) => c !== color));
    } else {
      onChange([...value, color]);
    }
  };

  const addCustom = () => {
    if (disabled) return;
    if (!value.includes(custom)) {
      onChange([...value, custom]);
    }
  };

  const remove = (color: string) => {
    if (disabled) return;
    onChange(value.filter((c) => c !== color));
  };

  return (
    <div className={styles.wrap}>
      {value.length > 0 && (
        <div className={styles.selected}>
          <div className={styles.selectedLabel}>Selected colors:</div>
          <div className={styles.selectedColors}>
            {value.map((color) => (
              <div key={color} className={styles.selectedChip}>
                <span
                  className={styles.swatch}
                  style={{ background: color, border: color === "#FFFFFF" ? "1px solid #eee" : "none" }}
                  aria-hidden="true"
                />
                <span className={styles.hex}>{color}</span>
                {!disabled && (
                  <button
                    type="button"
                    className={styles.removeColor}
                    onClick={() => remove(color)}
                    aria-label={`Remove color ${color}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!disabled && (
        <>
          <div className={styles.presets} role="group" aria-label="Preset colors">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`${styles.preset} ${value.includes(color) ? styles.presetSelected : ""}`}
                style={{ background: color, border: color === "#FFFFFF" ? "1px solid #ddd" : "1px solid transparent" }}
                onClick={() => toggle(color)}
                title={color}
                aria-label={color}
                aria-pressed={value.includes(color)}
              />
            ))}
          </div>

          <div className={styles.custom}>
            <label htmlFor="custom-color-picker" className="sr-only">
              Custom color
            </label>
            <input
              id="custom-color-picker"
              type="color"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              className={styles.colorInput}
            />
            <label htmlFor="custom-color-hex" className="sr-only">
              Custom color hex value
            </label>
            <input
              id="custom-color-hex"
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              className={styles.hexInput}
              placeholder="#000000"
              maxLength={7}
            />
            <button type="button" className={styles.addBtn} onClick={addCustom}>
              Add
            </button>
          </div>
        </>
      )}
    </div>
  );
}
