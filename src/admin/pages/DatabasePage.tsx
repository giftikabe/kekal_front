/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Table, Plus, AlertTriangle } from "lucide-react";
import { customTablesApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import { useCustomTables } from "../hooks/useCustomTables";
import ui from "../components/ui.module.css";

const COLUMN_TYPE_OPTIONS = [
  { value: "text", label: "Short Text" },
  { value: "longtext", label: "Long Text" },
  { value: "richtext", label: "Rich Text" },
  { value: "image", label: "Image" },
  { value: "link", label: "Link URL" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "True/False" },
  { value: "date", label: "Date" },
];

// Lookup for the Columns badges below — turns a stored column's `type`
// key (e.g. "richtext") into its human label (e.g. "Rich Text") for the
// badge's tooltip.
const COLUMN_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  COLUMN_TYPE_OPTIONS.map((o) => [o.value, o.label]),
);

type ModalType = "create-table" | "delete-table" | null;

interface CreateColumnDraft {
  label: string;
  type: string;
  required: boolean;
}

// This is only used to render a live PREVIEW of the internal name while the
// admin types. The server is the source of truth for the actual name it
// creates — it re-derives and, if needed, de-duplicates or falls back
// (e.g. for labels typed in a non-Latin script, or labels that collide with
// each other) — so the real result can differ slightly from this preview.
function toSnakeCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/^[^a-z]/, "table_");
}

export default function DatabasePage() {
  const { hasPermission } = useAuthContext();
  const navigate = useNavigate();

  // Use the shared hook so the sidebar stays in sync after create/delete.
  const { tables: customTables, refresh } = useCustomTables();

  const [coreTables, setCoreTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Page-level error (non-modal operations)
  const [pageError, setPageError] = useState("");

  const [modal, setModal] = useState<ModalType>(null);
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  // Per-modal error — visible inside the open modal
  const [modalError, setModalError] = useState("");
  const [saving, setSaving] = useState(false);

  const [createTableForm, setCreateTableForm] = useState<{
    displayName: string;
    columns: CreateColumnDraft[];
  }>({
    displayName: "",
    columns: [{ label: "", type: "text", required: false }],
  });

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setPageError("");
    try {
      const res = await customTablesApi.getAll();
      // customTables list is owned by the shared hook; we only need coreTables here.
      setCoreTables(res.coreTables || []);
    } catch {
      setPageError("Failed to load tables.");
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    setModal(null);
    setSelectedTable(null);
    setModalError("");
    setSaving(false);
    setCreateTableForm({
      displayName: "",
      columns: [{ label: "", type: "text", required: false }],
    });
  }

  // ── Create table ─────────────────────────────────────────────────────────

  function openCreateTableModal() {
    setCreateTableForm({
      displayName: "",
      columns: [{ label: "", type: "text", required: false }],
    });
    setModalError("");
    setModal("create-table");
  }

  function updateCreateColumn(index: number, patch: Partial<CreateColumnDraft>) {
    setCreateTableForm((prev) => ({
      ...prev,
      columns: prev.columns.map((col, i) => (i === index ? { ...col, ...patch } : col)),
    }));
  }

  function addCreateColumn() {
    setCreateTableForm((prev) => ({
      ...prev,
      columns: [...prev.columns, { label: "", type: "text", required: false }],
    }));
  }

  function removeCreateColumn(index: number) {
    setCreateTableForm((prev) => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index),
    }));
  }

  async function handleCreateTable() {
    const displayName = createTableForm.displayName.trim();
    if (!displayName) {
      setModalError("Display name is required.");
      return;
    }
    if (createTableForm.columns.some((col) => !col.label.trim())) {
      setModalError("All column labels are required.");
      return;
    }

    setSaving(true);
    setModalError("");
    try {
      // We still send a `name`/`label` hint per column, but the backend is
      // authoritative: it re-derives every identifier itself, so labels
      // that don't slugify cleanly (non-Latin script, symbols only) or that
      // collide with each other still produce a valid, complete table
      // instead of silently dropping columns or failing outright. The
      // `type` chosen here (e.g. "richtext"/"image"/"link"/"date") is now
      // persisted verbatim on the custom_tables row server-side, so it
      // survives round-trips instead of collapsing to a guess later.
      await customTablesApi.create({
        name: toSnakeCase(displayName),
        display_name: displayName,
        columns: createTableForm.columns.map((col) => ({
          name: toSnakeCase(col.label),
          label: col.label,
          type: col.type,
          required: col.required,
        })),
      });
      // Refresh the shared hook so both Sidebar and this page update.
      await refresh();
      closeModal();
    } catch (err: any) {
      // Preserve the backend's specific message (e.g. 409 "A table with this
      // name already exists") and show it inside the modal where the admin
      // is looking — not in the page body hidden behind the overlay.
      setModalError(err?.message || "Failed to create table.");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete table ──────────────────────────────────────────────────────────

  function openDeleteTableModal(table: any) {
    setSelectedTable(table);
    setModalError("");
    setModal("delete-table");
  }

  async function handleDeleteTable() {
    if (!selectedTable) return;
    setSaving(true);
    setModalError("");
    try {
      await customTablesApi.delete(selectedTable.id);
      await refresh();
      closeModal();
    } catch (err: any) {
      setModalError(err?.message || "Failed to delete table.");
    } finally {
      setSaving(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return <div className={ui.loading}>Loading...</div>;
  }

  return (
    <div>
      {pageError && <div className={ui.errorMsg}>{pageError}</div>}

      <div className={ui.pageHeader}>
        <h1 className={ui.pageTitle}>Database Manager</h1>
        {hasPermission("custom_tables", "create") && (
          <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={openCreateTableModal}>
            <Plus size={16} /> New Table
          </button>
        )}
      </div>

      <h2 className={ui.cardTitle}>Custom Tables</h2>
      {customTables.length === 0 ? (
        <div className={ui.empty}>
          <Table className={ui.emptyIcon} />
          No custom tables yet. Create your first table.
        </div>
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th>Display Name</th>
                <th>Internal Name</th>
                <th>Columns</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customTables.map((t) => {
                const columns = t.columns ?? [];
                const isGhost = columns.length === 0;
                return (
                  <tr key={t.id}>
                    <td>
                      <strong>{t.displayName}</strong>
                      <div style={{ fontFamily: "monospace", fontSize: "0.8em", color: "#999" }}>
                        {t.name}
                      </div>
                    </td>
                    <td style={{ fontFamily: "monospace" }}>{t.name}</td>
                    <td>
                      {isGhost ? (
                        <span
                          className={`${ui.badge} ${ui.badgeGray}`}
                          title="No columns found for this table — it may not have been created correctly."
                          style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                        >
                          <AlertTriangle size={12} /> No columns found
                        </span>
                      ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxWidth: 320 }}>
                          {/*
                            columns now come from the stored { name, label,
                            type, required } shape on the custom_tables row
                            (self-healed for legacy tables), not from a raw
                            information_schema introspection — so the badge
                            can show the real semantic type (e.g. "Image",
                            "Rich Text") instead of just "text" for
                            everything.
                          */}
                          {columns.map((col: any) => (
                            <span
                              key={col.name}
                              className={`${ui.badge} ${ui.badgeGray}`}
                              title={COLUMN_TYPE_LABEL[col.type] || col.type}
                            >
                              {col.label || col.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className={ui.actions}>
                        <button
                          className={`${ui.btn} ${ui.btnSecondary}`}
                          onClick={() =>
                            navigate("/admin/custom-data", { state: { tableId: t.id } })
                          }
                        >
                          View Data
                        </button>
                        {hasPermission("custom_tables", "delete") && (
                          <button
                            className={ui.iconBtnDanger}
                            onClick={() => openDeleteTableModal(t)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <h2 className={ui.cardTitle}>Core Tables</h2>
      <p className={ui.hint}>
        These tables are part of KEKAL's core structure and cannot be deleted.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {coreTables.map((t) => (
          <span key={t.name} className={`${ui.badge} ${ui.badgeGray}`}>
            {t.name}
          </span>
        ))}
      </div>

      {/* ── Create-table modal ─────────────────────────────────────────── */}
      {modal === "create-table" && (
        <div className={ui.overlay} onClick={closeModal}>
          <div className={ui.modal} onClick={(e) => e.stopPropagation()}>
            <div className={ui.modalHeader}>
              <h2 className={ui.modalTitle}>Create New Table</h2>
              <button className={ui.modalClose} onClick={closeModal}>×</button>
            </div>
            <div className={ui.modalBody}>
              {/* Error rendered INSIDE the modal so it's visible over the overlay */}
              {modalError && <div className={ui.errorMsg}>{modalError}</div>}
              <div className={ui.form}>
                <div className={ui.field}>
                  <label className={ui.label}>Display Name</label>
                  <input
                    type="text"
                    className={ui.input}
                    placeholder="e.g. Press Mentions"
                    value={createTableForm.displayName}
                    onChange={(e) =>
                      setCreateTableForm((prev) => ({ ...prev, displayName: e.target.value }))
                    }
                  />
                  <div className={ui.hint}>
                    Internal name preview: {toSnakeCase(createTableForm.displayName) || "—"}
                    {" "}(may be adjusted for uniqueness)
                  </div>
                </div>

                <h3 className={ui.cardTitle}>Columns</h3>
                <p className={ui.hint}>ID, Created At, and Updated At are added automatically.</p>

                {createTableForm.columns.map((col, index) => (
                  <div
                    key={index}
                    className={ui.fieldRow}
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <input
                      type="text"
                      className={ui.input}
                      placeholder="Label (e.g. Title)"
                      value={col.label}
                      onChange={(e) => updateCreateColumn(index, { label: e.target.value })}
                    />
                    <select
                      className={ui.select}
                      value={col.type}
                      onChange={(e) => updateCreateColumn(index, { type: e.target.value })}
                    >
                      {COLUMN_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <label className={ui.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={col.required}
                        onChange={(e) => updateCreateColumn(index, { required: e.target.checked })}
                      />
                      Required
                    </label>
                    {createTableForm.columns.length > 1 && (
                      <button
                        type="button"
                        className={ui.iconBtnDanger}
                        onClick={() => removeCreateColumn(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className={`${ui.btn} ${ui.btnSecondary}`}
                  onClick={addCreateColumn}
                >
                  + Add Column
                </button>
              </div>
            </div>
            <div className={ui.modalFooter}>
              <button className={ui.btn} onClick={closeModal}>
                Cancel
              </button>
              <button
                className={`${ui.btn} ${ui.btnPrimary}`}
                onClick={handleCreateTable}
                disabled={saving}
              >
                {saving ? "Creating…" : "Create Table"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete-table modal ─────────────────────────────────────────── */}
      {modal === "delete-table" && selectedTable && (
        <div className={ui.overlay} onClick={closeModal}>
          <div className={ui.modal} onClick={(e) => e.stopPropagation()}>
            <div className={ui.modalHeader}>
              <h2 className={ui.modalTitle}>Delete Table</h2>
              <button className={ui.modalClose} onClick={closeModal}>×</button>
            </div>
            <div className={ui.modalBody}>
              {modalError && <div className={ui.errorMsg}>{modalError}</div>}
              <p className={ui.confirmText}>Delete {selectedTable.displayName}?</p>
              <p className={ui.confirmSub}>
                This will permanently delete the table and ALL its data.
              </p>
            </div>
            <div className={ui.modalFooter}>
              <button className={ui.btn} onClick={closeModal}>
                Cancel
              </button>
              <button className={ui.btnDanger} onClick={handleDeleteTable} disabled={saving}>
                {saving ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}