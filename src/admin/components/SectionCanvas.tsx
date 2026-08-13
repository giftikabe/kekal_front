import { Rnd } from "react-rnd";
import PreviewFrame from "./PreviewFrame";
import { Trash2 } from "lucide-react";

export interface CanvasInstance {
  id: string;
  componentId: string;
  componentName: string;
  x: number; // % (as stored/published)
  y: number; // %
  width: number; // %
  height: number; // %
  zIndex: number;
  props: Record<string, unknown>;
  tsxCode: string; // fetched from GitHub for published components, cached per session
  cssCode: string;
}

interface SectionCanvasProps {
  canvasHeight: number; // px — same value published pages use as the section's reference height
  instances: CanvasInstance[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onChange: (id: string, patch: { x: number; y: number; width: number; height: number }) => void;
  onDelete: (id: string) => void;
}

// Fixed reference width the canvas is authored against. Percentages are
// computed against this constant rather than the live DOM width of
// whatever panel happens to contain the canvas — react-rnd works in px, so
// giving it a stable, known reference frame avoids drift/jitter that comes
// from converting through a resizable parent element on every drag frame.
// 1200px approximates the desktop content width used across the site's
// CSS (--content-max), so what you build here maps closely to production.
const CANVAS_REFERENCE_WIDTH = 1200;

function pctToPx(pct: number, dimension: number) {
  return (pct / 100) * dimension;
}
function pxToPct(px: number, dimension: number) {
  return Math.max(0, Math.min(100, (px / dimension) * 100));
}

/**
 * The visual editing surface for a section: every component instance
 * renders its ACTUAL live preview (via PreviewFrame) inside a react-rnd
 * draggable/resizable box. Internally everything is px against the fixed
 * CANVAS_REFERENCE_WIDTH; only on save (onChange) do we convert back to the
 * percentages that get stored in the DB and used by lib/codegen.ts at
 * publish time.
 */
export default function SectionCanvas({
  canvasHeight,
  instances,
  selectedId,
  onSelect,
  onChange,
  onDelete,
}: SectionCanvasProps) {
  return (
    <div style={{ overflowX: "auto", background: "#f5f5f5", padding: 16 }}>
      <div
        style={{
          position: "relative",
          width: CANVAS_REFERENCE_WIDTH,
          height: canvasHeight,
          margin: "0 auto",
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 23px, #eee 24px), repeating-linear-gradient(90deg, transparent, transparent 23px, #eee 24px)",
          border: "1px solid #ddd",
        }}
        onClick={() => onSelect("")}
      >
        {instances.length === 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#bbb",
              fontSize: 13,
              pointerEvents: "none",
            }}
          >
            Drag a component here from the right panel
          </div>
        )}

        {instances.map((inst) => (
          <Rnd
            key={inst.id}
            bounds="parent"
            size={{
              width: pctToPx(inst.width, CANVAS_REFERENCE_WIDTH),
              height: pctToPx(inst.height, canvasHeight),
            }}
            position={{
              x: pctToPx(inst.x, CANVAS_REFERENCE_WIDTH),
              y: pctToPx(inst.y, canvasHeight),
            }}
            style={{
              zIndex: inst.zIndex,
              border: selectedId === inst.id ? "2px solid #000" : "1px dashed #ccc",
              boxSizing: "border-box",
              background: "#fff",
            }}
            enableResizing={{ bottomRight: true, bottom: true, right: true }}
            onDragStop={(_e, d) => {
              onChange(inst.id, {
                x: pxToPct(d.x, CANVAS_REFERENCE_WIDTH),
                y: pxToPct(d.y, canvasHeight),
                width: inst.width,
                height: inst.height,
              });
            }}
            onResizeStop={(_e, _dir, ref, _delta, pos) => {
              onChange(inst.id, {
                x: pxToPct(pos.x, CANVAS_REFERENCE_WIDTH),
                y: pxToPct(pos.y, canvasHeight),
                width: pxToPct(ref.offsetWidth, CANVAS_REFERENCE_WIDTH),
                height: pxToPct(ref.offsetHeight, canvasHeight),
              });
            }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onSelect(inst.id);
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
              {selectedId === inst.id && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(inst.id);
                  }}
                  title="Remove from section"
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    zIndex: 10,
                    width: 22,
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff",
                    border: "1px solid #eee",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={12} color="#c00" />
                </button>
              )}
              <div style={{ width: "100%", height: "100%", pointerEvents: "none" }}>
                <PreviewFrame
                  tsxCode={inst.tsxCode}
                  cssCode={inst.cssCode}
                  componentName={inst.componentName}
                  props={inst.props}
                  height="100%"
                />
              </div>
            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
}
