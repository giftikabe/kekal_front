import { useEffect, useState } from "react";
import { productsApi, collectionsApi, eventsApi, upcomingEventsApi, customTablesApi } from "../api/client";
import ui from "./ui.module.css";

export interface DataBindingValue {
  source: "products" | "collections" | "events" | "upcomingEvents" | string; // "custom:<tableName>"
  recordId: string;
  field: string;
}

interface DataBindingSelectProps {
  value: DataBindingValue | null;
  onChange: (value: DataBindingValue | null) => void;
}

const BUILT_IN_SOURCES = [
  { value: "products", label: "Products" },
  { value: "collections", label: "Collections" },
  { value: "events", label: "Events" },
  { value: "upcomingEvents", label: "Upcoming Events" },
];

/**
 * Three cascading dropdowns: source table -> record -> field.
 * On any change it emits the full binding (or null once "Unbound" is
 * selected). Field list is just Object.keys() of the chosen record — good
 * enough since these are already-typed API responses.
 */
export default function DataBindingSelect({ value, onChange }: DataBindingSelectProps) {
  const [customTables, setCustomTables] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const source = value?.source ?? "";
  const recordId = value?.recordId ?? "";
  const field = value?.field ?? "";

  useEffect(() => {
    customTablesApi.getAll().then((t: any) => setCustomTables(Array.isArray(t) ? t : [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!source) {
      setRecords([]);
      return;
    }
    setLoadingRecords(true);
    const load =
      source === "products"
        ? productsApi.getAll()
        : source === "collections"
        ? collectionsApi.getAll()
        : source === "events"
        ? eventsApi.getAll()
        : source === "upcomingEvents"
        ? upcomingEventsApi.getAll()
        : source.startsWith("custom:")
        ? customTablesApi.getData(source.slice("custom:".length))
        : Promise.resolve([]);

    load
      .then((rows: any) => setRecords(Array.isArray(rows) ? rows : []))
      .catch(() => setRecords([]))
      .finally(() => setLoadingRecords(false));
  }, [source]);

  const selectedRecord = records.find((r) => r.id === recordId);
  const fieldOptions = selectedRecord ? Object.keys(selectedRecord).filter((k) => k !== "id") : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <select
        className={ui.select}
        value={source}
        onChange={(e) => {
          const v = e.target.value;
          if (!v) return onChange(null);
          onChange({ source: v, recordId: "", field: "" });
        }}
      >
        <option value="">Unbound (use placeholder)</option>
        {BUILT_IN_SOURCES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
        {customTables.map((t: any) => (
          <option key={t.id} value={`custom:${t.name}`}>{t.display_name || t.name} (custom)</option>
        ))}
      </select>

      {source && (
        <select
          className={ui.select}
          value={recordId}
          disabled={loadingRecords}
          onChange={(e) => onChange({ source, recordId: e.target.value, field: "" })}
        >
          <option value="">{loadingRecords ? "Loading…" : "Choose a record…"}</option>
          {records.map((r: any) => (
            <option key={r.id} value={r.id}>{r.name || r.title || r.label || r.id}</option>
          ))}
        </select>
      )}

      {recordId && (
        <select
          className={ui.select}
          value={field}
          onChange={(e) => onChange({ source, recordId, field: e.target.value })}
        >
          <option value="">Choose a field…</option>
          {fieldOptions.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      )}
    </div>
  );
}
