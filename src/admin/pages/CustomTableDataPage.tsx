/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Plus, RefreshCw, Pencil, Trash2, Database } from "lucide-react";
import { customTablesApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import ImageUpload from "../components/ImageUpload";
import RichTextarea from "../components/RichTextarea";
import ui from "../components/ui.module.css";
// Use the shared type so it never drifts from the hook/API shape.
import type { CustomTable } from "../hooks/useCustomTables";

// ─── Types ────────────────────────────────────────────────────────────────────

// Mirrors StoredColumnDef from db/schema/customTables.ts. This is the
// single source of truth for a column's semantic type — it comes straight
// from GET /admin/custom-tables/:id/columns, no more guessing from the
// column's physical SQL type or its name.
type ColumnType =
  | "text"
  | "longtext"
  | "richtext"
  | "image"
  | "link"
  | "number"
  | "boolean"
  | "date";

interface TableColumn {
  name: string;
  label: string;
  type: ColumnType;
  required: boolean;
}

interface RowData {
  id: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncate(value: string, length: number): string {
  if (!value) return "";
  if (value.length <= length) return value;
  return `${value.slice(0, length)}…`;
}

// ─── Cell display ─────────────────────────────────────────────────────────────

function CellValue({ column, value }: { column: TableColumn; value: any }) {
  if (value === null || value === undefined || value === "") return <>—</>;

  if (column.type === "boolean") {
    const bool = value === true || value === "true" || value === "t";
    return (
      <span className={`${ui.badge} ${bool ? ui.badgeGreen : ui.badgeGray}`}>
        {bool ? "Yes" : "No"}
      </span>
    );
  }

  if (column.type === "image") {
    return (
      <img
        src={String(value)}
        alt=""
        width={44}
        height={44}
        style={{ objectFit: "cover", border: "1px solid #eee", display: "block" }}
      />
    );
  }

  if (column.type === "link") {
    return (
      <a
        href={String(value)}
        target="_blank"
        rel="noreferrer"
        style={{ color: "#264B73" }}
        onClick={(e) => e.stopPropagation()}
      >
        {truncate(String(value), 40)}
      </a>
    );
  }

  return <>{truncate(String(value), 60)}</>;
}

// ─── Form field ───────────────────────────────────────────────────────────────

function FormField({
  column,
  value,
  onChange,
}: {
  column: TableColumn;
  value: any;
  onChange: (val: any) => void;
}) {
  const name = column.name;
  const label = column.label || name.replace(/_/g, " ");

  if (column.type === "boolean") {
    const checked = value === true || value === "true" || value === "t";
    return (
      <label className={ui.checkboxField} key={name}>
        <input
          type="checkbox"
          checked={!!checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className={ui.checkboxLabel}>{label}</span>
      </label>
    );
  }

  if (column.type === "image") {
    return (
      <div className={ui.field} key={name}>
        <label className={ui.label}>{label}</label>
        <ImageUpload value={value ?? ""} onChange={onChange} label={label} />
      </div>
    );
  }

  if (column.type === "link") {
    return (
      <div className={ui.field} key={name}>
        <label className={ui.label}>{label}</label>
        <input
          type="url"
          className={ui.input}
          value={value ?? ""}
          placeholder="https://"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (column.type === "number") {
    return (
      <div className={ui.field} key={name}>
        <label className={ui.label}>{label}</label>
        <input
          type="number"
          className={ui.input}
          value={value ?? ""}
          onChange={(e) =>
            onChange(e.target.value === "" ? null : Number(e.target.value))
          }
        />
      </div>
    );
  }

  if (column.type === "richtext") {
    return (
      <div className={ui.field} key={name}>
        <label className={ui.label}>{label}</label>
        <RichTextarea value={value ?? ""} onChange={onChange} placeholder={`Enter ${label}…`} />
      </div>
    );
  }

  if (column.type === "longtext") {
    return (
      <div className={ui.field} key={name}>
        <label className={ui.label}>{label}</label>
        <textarea
          className={ui.textarea}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label}…`}
        />
      </div>
    );
  }

  if (column.type === "date") {
    return (
      <div className={ui.field} key={name}>
        <label className={ui.label}>{label}</label>
        <input
          type="date"
          className={ui.input}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  // Default: short text
  return (
    <div className={ui.field} key={name}>
      <label className={ui.label}>{label}</label>
      <input
        type="text"
        className={ui.input}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${label}…`}
      />
    </div>
  );
}

// ─── Single table data panel ──────────────────────────────────────────────────

function TableDataPanel({
  table,
  hasPermission,
}: {
  table: CustomTable;
  hasPermission: (entity: string, action: string) => boolean;
}) {
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  type ModalType = "add" | "edit" | "delete" | null;
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [modalError, setModalError] = useState("");
  const [saving, setSaving] = useState(false);

  function buildBlankForm(cols: TableColumn[]): Record<string, any> {
    const blank: Record<string, any> = {};
    cols.forEach((col) => {
      if (col.type === "boolean") blank[col.name] = false;
      else if (col.type === "number") blank[col.name] = null;
      else blank[col.name] = "";
    });
    return blank;
  }

  function buildPayload(cols: TableColumn[], formValues: Record<string, any>) {
    const payload: Record<string, any> = {};
    cols.forEach((col) => {
      const v = formValues[col.name];
      if (col.type === "boolean") {
        payload[col.name] = !!v;
      } else if (col.type === "number") {
        payload[col.name] =
          v === "" || v === null || v === undefined ? null : Number(v);
      } else {
        payload[col.name] = v === "" || v === undefined ? null : v;
      }
    });
    return payload;
  }

  // FIX: validate required fields client-side before hitting the API.
  function validateForm(cols: TableColumn[], formValues: Record<string, any>): string {
    for (const col of cols) {
      if (!col.required) continue;
      const v = formValues[col.name];
      if (col.type === "boolean") continue; // false is a valid required value
      if (col.type === "number") {
        if (v === null || v === undefined || v === "") {
          return `"${col.label || col.name}" is required.`;
        }
      } else {
        if (!v || String(v).trim() === "") {
          return `"${col.label || col.name}" is required.`;
        }
      }
    }
    return "";
  }

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Columns: GET /admin/custom-tables/:id/columns — returns the stored
      // { name, label, type, required } definitions, not raw
      // information_schema rows.
      // Data:    GET /admin/custom-data/:tableName (uses the snake_case name)
      const [colsRaw, dataRaw] = await Promise.all([
        customTablesApi.getColumns(table.id),
        customTablesApi.getData(table.name),
      ]);

      const colList: TableColumn[] = Array.isArray(colsRaw) ? colsRaw : [];

      setColumns(colList);
      setRows(Array.isArray(dataRaw) ? dataRaw : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load table data.");
    } finally {
      setLoading(false);
    }
  }, [table.id, table.name]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function refreshRows() {
    setRefreshing(true);
    try {
      const data = await customTablesApi.getData(table.name);
      setRows(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to refresh.");
    } finally {
      setRefreshing(false);
    }
  }

  // FIX: closeModal no longer calls setSaving(false) — the finally block in
  // handleSave / handleDelete owns that. Calling it here caused a redundant
  // state update on success and had no effect on error (modal stays open).
  function closeModal() {
    setModal(null);
    setSelectedRow(null);
    setForm({});
    setModalError("");
  }

  function openAdd() {
    setForm(buildBlankForm(columns));
    setModalError("");
    setModal("add");
  }

  function openEdit(row: RowData) {
    setSelectedRow(row);
    const filled: Record<string, any> = {};
    columns.forEach((col) => {
      const v = row[col.name];
      if (col.type === "boolean") filled[col.name] = v === true || v === "true" || v === "t";
      else if (col.type === "number") filled[col.name] = v ?? null;
      else filled[col.name] = v ?? "";
    });
    setForm(filled);
    setModalError("");
    setModal("edit");
  }

  function openDelete(row: RowData) {
    setSelectedRow(row);
    setModalError("");
    setModal("delete");
  }

  async function handleSave() {
    // FIX: validate required fields before the round-trip.
    const validationError = validateForm(columns, form);
    if (validationError) {
      setModalError(validationError);
      return;
    }

    setSaving(true);
    setModalError("");
    try {
      const payload = buildPayload(columns, form);
      if (modal === "edit" && selectedRow) {
        await customTablesApi.updateData(table.name, selectedRow.id, payload);
      } else {
        await customTablesApi.createData(table.name, payload);
      }
      await refreshRows();
      closeModal();
    } catch (err: any) {
      setModalError(err?.message || "Failed to save row.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedRow) return;
    setSaving(true);
    setModalError("");
    try {
      await customTablesApi.deleteData(table.name, selectedRow.id);
      await refreshRows();
      closeModal();
    } catch (err: any) {
      setModalError(err?.message || "Failed to delete row.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className={ui.loading}>Loading…</div>;
  if (error) return <div className={ui.errorMsg}>{error}</div>;

  return (
    <div>
      {/* Panel header */}
      <div className={ui.pageHeader}>
        <div>
          <div className={ui.pageTitle}>{table.displayName}</div>
          <div className={ui.pageCount}>
            {rows.length} row{rows.length !== 1 ? "s" : ""}
            <span style={{ color: "#ccc", margin: "0 6px" }}>·</span>
            <span style={{ fontFamily: "monospace", fontSize: 11, color: "#bbb" }}>
              {table.name}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className={`${ui.btn} ${ui.btnSecondary}`}
            onClick={refreshRows}
            disabled={refreshing}
            title="Refresh rows"
          >
            <RefreshCw size={14} style={{ display: "block" }} />
          </button>
          {hasPermission("custom_tables", "create") && (
            <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={openAdd}>
              <Plus size={14} /> Add Row
            </button>
          )}
        </div>
      </div>

      {columns.length === 0 && (
        <div className={ui.errorMsg} style={{ marginBottom: 16 }}>
          No columns found for this table. Check that the table was created
          with at least one column beyond id / created_at / updated_at.
        </div>
      )}

      {/* Data table */}
      {rows.length === 0 ? (
        <div className={ui.empty}>
          <div className={ui.emptyIcon}>⬜</div>
          No rows yet. Add the first one.
        </div>
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th>ID</th>
                {columns.map((col) => (
                  <th key={col.name}>{col.label || col.name.replace(/_/g, " ")}</th>
                ))}
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 11, color: "#bbb" }}>
                    {truncate(String(row.id), 8)}
                  </td>
                  {columns.map((col) => (
                    <td key={col.name}>
                      <CellValue column={col} value={row[col.name]} />
                    </td>
                  ))}
                  <td style={{ fontSize: 11, color: "#999", whiteSpace: "nowrap" }}>
                    {row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}
                  </td>
                  <td>
                    <div className={ui.actions}>
                      {hasPermission("custom_tables", "update") && (
                        <button
                          className={ui.iconBtn}
                          onClick={() => openEdit(row)}
                          title="Edit"
                          aria-label="Edit row"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      {hasPermission("custom_tables", "delete") && (
                        <button
                          className={`${ui.iconBtn} ${ui.iconBtnDanger}`}
                          onClick={() => openDelete(row)}
                          title="Delete"
                          aria-label="Delete row"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add / Edit modal ── */}
      {(modal === "add" || modal === "edit") && (
        <div className={ui.overlay} onClick={closeModal}>
          <div
            className={ui.modal}
            style={{ maxWidth: 580 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={ui.modalHeader}>
              <h2 className={ui.modalTitle}>
                {modal === "edit" ? "Edit Row" : `Add Row to ${table.displayName}`}
              </h2>
              <button className={ui.modalClose} onClick={closeModal}>×</button>
            </div>
            <div className={ui.modalBody}>
              {modalError && <div className={ui.errorMsg}>{modalError}</div>}
              {columns.length === 0 ? (
                <p style={{ color: "#999", margin: 0 }}>
                  This table has no columns. Please recreate it with at least
                  one user-defined column.
                </p>
              ) : (
                <div className={ui.form}>
                  {columns.map((col) => (
                    <FormField
                      key={col.name}
                      column={col}
                      value={form[col.name]}
                      onChange={(val) =>
                        setForm((prev) => ({ ...prev, [col.name]: val }))
                      }
                    />
                  ))}
                </div>
              )}
            </div>
            <div className={ui.modalFooter}>
              <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={closeModal}>
                Cancel
              </button>
              <button
                className={`${ui.btn} ${ui.btnPrimary}`}
                onClick={handleSave}
                disabled={saving || columns.length === 0}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete modal ── */}
      {modal === "delete" && (
        <div className={ui.overlay} onClick={closeModal}>
          <div className={ui.modal} onClick={(e) => e.stopPropagation()}>
            <div className={ui.modalHeader}>
              <h2 className={ui.modalTitle}>Delete Row</h2>
              <button className={ui.modalClose} onClick={closeModal}>×</button>
            </div>
            <div className={ui.modalBody}>
              {modalError && <div className={ui.errorMsg}>{modalError}</div>}
              <p className={ui.confirmText}>Delete this row?</p>
              <p className={ui.confirmSub}>This cannot be undone.</p>
            </div>
            <div className={ui.modalFooter}>
              <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={closeModal}>
                Cancel
              </button>
              <button
                className={`${ui.btn} ${ui.btnDanger}`}
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
// Route: /admin/custom-data
//
// This is the ONE custom data page. It shows all custom tables as tabs.
// DatabasePage's "View Data" also navigates here, passing the table id
// via location.state so the correct tab is pre-selected.

export default function CustomTableDataPage() {
  const { hasPermission } = useAuthContext();
  const location = useLocation();

  const [tables, setTables] = useState<CustomTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<string>("");

  // FIX: loadTables is memoised with useCallback so the effect dependency is
  // stable, and the location.state check is removed from here entirely —
  // tab selection from state is handled exclusively by the effect below,
  // which avoids the race between the two useEffects.
  const loadTables = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await customTablesApi.getAll();
      const list: CustomTable[] = res.customTables || [];
      setTables(list);
      // Default to the first tab. If location.state overrides this, the
      // second effect will correct it once `tables` is set.
      if (list.length > 0) {
        setActiveTab(list[0].id);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load tables.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  // If DatabasePage navigated here with a specific table id in state,
  // override the default tab selection once tables are loaded.
  // This runs after loadTables sets `tables`, so the match is always reliable.
  useEffect(() => {
    const stateId = (location.state as any)?.tableId;
    if (!stateId || tables.length === 0) return;
    const match = tables.find((t) => t.id === stateId);
    if (match) setActiveTab(match.id);
  }, [location.state, tables]);

  if (loading) return <div className={ui.loading}>Loading…</div>;
  if (error) return <div className={ui.errorMsg}>{error}</div>;

  if (tables.length === 0) {
    return (
      <div>
        <div className={ui.pageHeader}>
          <div className={ui.pageTitle}>Custom Data</div>
        </div>
        <div className={ui.empty}>
          <Database size={40} style={{ marginBottom: 12, color: "#ccc" }} />
          <div>No custom tables yet.</div>
          <div style={{ marginTop: 6, fontSize: 13, color: "#999" }}>
            Go to{" "}
            <a href="/admin/database" style={{ color: "#000", fontWeight: 600 }}>
              Database Manager
            </a>{" "}
            to create one.
          </div>
        </div>
      </div>
    );
  }

  const activeTable = tables.find((t) => t.id === activeTab) ?? tables[0];

  return (
    <div>
      <div className={ui.pageHeader}>
        <div className={ui.pageTitle}>Custom Data</div>
      </div>

      {/* Tab bar — one tab per custom table */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #eee",
          marginBottom: 24,
          overflowX: "auto",
          gap: 0,
          flexShrink: 0,
        }}
      >
        {tables.map((t) => (
          <button
            key={t.id}
            className={`${ui.tab} ${activeTable?.id === t.id ? ui.tabActive : ""}`}
            onClick={() => setActiveTab(t.id)}
            style={{ whiteSpace: "nowrap" }}
          >
            {t.displayName}
          </button>
        ))}
      </div>

      {activeTable && (
        <TableDataPanel
          key={activeTable.id}
          table={activeTable}
          hasPermission={hasPermission}
        />
      )}
    </div>
  );
}