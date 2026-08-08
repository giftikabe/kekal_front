/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Trash2, Table, ArrowLeft, Plus, Pencil } from "lucide-react";
import { customTablesApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import ImageUpload from "../components/ImageUpload";
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

type View = "tables" | "data";
type ModalType = "create-table" | "add-row" | "edit-row" | "delete-table" | "delete-row" | null;

interface CreateColumnDraft {
  label: string;
  type: string;
  required: boolean;
}

function toSnakeCase(value: string): string {
  const snake = value
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/^[^a-z]/, "table_");
  return snake;
}

function truncate(value: string, length: number): string {
  if (value.length <= length) return value;
  return `${value.slice(0, length)}...`;
}

export default function DatabasePage() {
  const { hasPermission } = useAuthContext();

  const [view, setView] = useState<View>("tables");
  const [customTables, setCustomTables] = useState<any[]>([]);
  const [coreTables, setCoreTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modal, setModal] = useState<ModalType>(null);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [createTableForm, setCreateTableForm] = useState<{
    displayName: string;
    columns: CreateColumnDraft[];
  }>({
    displayName: "",
    columns: [{ label: "", type: "text", required: false }],
  });
  const [rowForm, setRowForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTables();
  }, []);

  async function loadTables() {
    setLoading(true);
    setError("");
    try {
      const res = await customTablesApi.getAll();
      setCustomTables(res.customTables || []);
      setCoreTables(res.coreTables || []);
    } catch {
      setError("Failed to load tables.");
    } finally {
      setLoading(false);
    }
  }

  async function openTableData(table: any) {
    setSelectedTable(table);
    setView("data");
    setLoading(true);
    setError("");
    try {
      const [columns, data] = await Promise.all([
        customTablesApi.getColumns(table.id),
        customTablesApi.getData(table.name),
      ]);
      setTableColumns(columns || []);
      setTableData(data || []);
    } catch {
      setError("Failed to load table data.");
    } finally {
      setLoading(false);
    }
  }

  function backToTables() {
    setView("tables");
    setSelectedTable(null);
    setTableColumns([]);
    setTableData([]);
  }

  function closeModal() {
    setModal(null);
    setSelectedRow(null);
    setCreateTableForm({
      displayName: "",
      columns: [{ label: "", type: "text", required: false }],
    });
    setRowForm({});
  }

  function openCreateTableModal() {
    setCreateTableForm({
      displayName: "",
      columns: [{ label: "", type: "text", required: false }],
    });
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
      setError("Display name is required.");
      return;
    }
    if (createTableForm.columns.some((col) => !col.label.trim())) {
      setError("All column labels are required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
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
      await loadTables();
      closeModal();
    } catch {
      setError("Failed to create table.");
    } finally {
      setSaving(false);
    }
  }

  function openDeleteTableModal(table: any) {
    setSelectedTable(table);
    setModal("delete-table");
  }

  async function handleDeleteTable() {
    if (!selectedTable) return;
    setSaving(true);
    setError("");
    try {
      await customTablesApi.delete(selectedTable.id);
      await loadTables();
      closeModal();
      if (view === "data") backToTables();
    } catch {
      setError("Failed to delete table.");
    } finally {
      setSaving(false);
    }
  }

  function openAddRowModal() {
    setRowForm({});
    setSelectedRow(null);
    setModal("add-row");
  }

  function openEditRowModal(row: any) {
    setSelectedRow(row);
    setRowForm({ ...row });
    setModal("edit-row");
  }

  function openDeleteRowModal(row: any) {
    setSelectedRow(row);
    setModal("delete-row");
  }

  async function refreshTableData() {
    if (!selectedTable) return;
    const data = await customTablesApi.getData(selectedTable.name);
    setTableData(data || []);
  }

  async function handleSaveRow() {
    if (!selectedTable) return;
    setSaving(true);
    setError("");
    try {
      if (modal === "edit-row" && selectedRow) {
        await customTablesApi.updateData(selectedTable.name, selectedRow.id, rowForm);
      } else {
        await customTablesApi.createData(selectedTable.name, rowForm);
      }
      await refreshTableData();
      closeModal();
    } catch {
      setError("Failed to save row.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteRow() {
    if (!selectedTable || !selectedRow) return;
    setSaving(true);
    setError("");
    try {
      await customTablesApi.deleteData(selectedTable.name, selectedRow.id);
      await refreshTableData();
      closeModal();
    } catch {
      setError("Failed to delete row.");
    } finally {
      setSaving(false);
    }
  }

  function renderCellValue(column: any, value: any) {
    if (value === null || value === undefined || value === "") return "—";
    if (column.data_type === "boolean") return value ? "Yes" : "No";
    if (column.column_name.includes("image")) {
      return <img src={value} alt="" width={40} height={40} style={{ objectFit: "cover" }} />;
    }
    const stringValue = String(value);
    return truncate(stringValue, 60);
  }

  function renderFormField(column: any) {
    const name = column.column_name;
    const value = rowForm[name] ?? "";

    if (column.data_type === "boolean") {
      return (
        <label key={name} className={ui.checkboxField}>
          <input
            type="checkbox"
            checked={!!rowForm[name]}
            onChange={(e) => setRowForm((prev) => ({ ...prev, [name]: e.target.checked }))}
          />
          <span className={ui.checkboxLabel}>{name}</span>
        </label>
      );
    }

    if (name.includes("image")) {
      return (
        <div className={ui.field} key={name}>
          <label className={ui.label}>{name}</label>
          <ImageUpload
            value={value}
            onChange={(url: string) => setRowForm((prev) => ({ ...prev, [name]: url }))}
          />
        </div>
      );
    }

    if (name.includes("link") || name.includes("url")) {
      return (
        <div className={ui.field} key={name}>
          <label className={ui.label}>{name}</label>
          <input
            type="url"
            className={ui.input}
            value={value}
            onChange={(e) => setRowForm((prev) => ({ ...prev, [name]: e.target.value }))}
          />
        </div>
      );
    }

    if (column.data_type === "integer") {
      return (
        <div className={ui.field} key={name}>
          <label className={ui.label}>{name}</label>
          <input
            type="number"
            className={ui.input}
            value={value}
            onChange={(e) => setRowForm((prev) => ({ ...prev, [name]: e.target.value }))}
          />
        </div>
      );
    }

    const isLongField =
      column.data_type === "text" &&
      (name.includes("content") ||
        name.includes("description") ||
        name.includes("body") ||
        name.includes("text"));

    if (isLongField) {
      return (
        <div className={ui.field} key={name}>
          <label className={ui.label}>{name}</label>
          <textarea
            className={ui.textarea}
            value={value}
            onChange={(e) => setRowForm((prev) => ({ ...prev, [name]: e.target.value }))}
          />
        </div>
      );
    }

    return (
      <div className={ui.field} key={name}>
        <label className={ui.label}>{name}</label>
        <input
          type="text"
          className={ui.input}
          value={value}
          onChange={(e) => setRowForm((prev) => ({ ...prev, [name]: e.target.value }))}
        />
      </div>
    );
  }

  if (loading && customTables.length === 0 && coreTables.length === 0 && view === "tables") {
    return <div className={ui.loading}>Loading...</div>;
  }

  return (
    <div>
      {error && <div className={ui.errorMsg}>{error}</div>}

      {view === "tables" && (
        <>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customTables.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <strong>{t.displayName}</strong>
                        <div style={{ fontFamily: "monospace", fontSize: "0.8em", color: "#999" }}>
                          {t.name}
                        </div>
                      </td>
                      <td style={{ fontFamily: "monospace" }}>{t.name}</td>
                      <td>
                        <div className={ui.actions}>
                          <button
                            className={`${ui.btn} ${ui.btnSecondary}`}
                            onClick={() => openTableData(t)}
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
                  ))}
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
        </>
      )}

      {view === "data" && selectedTable && (
        <>
          <button
            className={ui.btn}
            onClick={backToTables}
            style={{ marginBottom: "var(--space-sm)" }}
          >
            <ArrowLeft size={16} /> All Tables
          </button>

          <div className={ui.pageHeader}>
            <h1 className={ui.pageTitle}>{selectedTable.displayName}</h1>
            {hasPermission("custom_tables", "create") && (
              <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={openAddRowModal}>
                <Plus size={16} /> Add Row
              </button>
            )}
          </div>

          {loading ? (
            <div className={ui.loading}>Loading...</div>
          ) : tableData.length === 0 ? (
            <div className={ui.empty}>No rows yet.</div>
          ) : (
            <div className={ui.tableWrap}>
              <table className={ui.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    {tableColumns.map((col) => (
                      <th key={col.column_name}>{col.column_name}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <tr key={row.id}>
                      <td style={{ fontFamily: "monospace" }}>{truncate(String(row.id), 8)}</td>
                      {tableColumns.map((col) => (
                        <td key={col.column_name}>
                          {renderCellValue(col, row[col.column_name])}
                        </td>
                      ))}
                      <td>
                        <div className={ui.actions}>
                          {hasPermission("custom_tables", "update") && (
                            <button className={ui.iconBtn} onClick={() => openEditRowModal(row)}>
                              <Pencil size={16} />
                            </button>
                          )}
                          {hasPermission("custom_tables", "delete") && (
                            <button
                              className={ui.iconBtnDanger}
                              onClick={() => openDeleteRowModal(row)}
                            >
                              <Trash2 size={16} />
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
        </>
      )}

      {modal === "create-table" && (
        <div className={ui.overlay} onClick={closeModal}>
          <div className={ui.modal} onClick={(e) => e.stopPropagation()}>
            <div className={ui.modalHeader}>
              <h2 className={ui.modalTitle}>Create New Table</h2>
              <button className={ui.modalClose} onClick={closeModal}>
                ×
              </button>
            </div>
            <div className={ui.modalBody}>
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
                    Internal name: {toSnakeCase(createTableForm.displayName) || "—"}
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
                <button type="button" className={`${ui.btn} ${ui.btnSecondary}`} onClick={addCreateColumn}>
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
                Create Table
              </button>
            </div>
          </div>
        </div>
      )}

      {(modal === "add-row" || modal === "edit-row") && (
        <div className={ui.overlay} onClick={closeModal}>
          <div className={ui.modal} onClick={(e) => e.stopPropagation()}>
            <div className={ui.modalHeader}>
              <h2 className={ui.modalTitle}>{modal === "edit-row" ? "Edit Row" : "Add Row"}</h2>
              <button className={ui.modalClose} onClick={closeModal}>
                ×
              </button>
            </div>
            <div className={ui.modalBody}>
              <div className={ui.form}>
                {tableColumns.map((col) => renderFormField(col))}
              </div>
            </div>
            <div className={ui.modalFooter}>
              <button className={ui.btn} onClick={closeModal}>
                Cancel
              </button>
              <button
                className={`${ui.btn} ${ui.btnPrimary}`}
                onClick={handleSaveRow}
                disabled={saving}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "delete-table" && selectedTable && (
        <div className={ui.overlay} onClick={closeModal}>
          <div className={ui.modal} onClick={(e) => e.stopPropagation()}>
            <div className={ui.modalHeader}>
              <h2 className={ui.modalTitle}>Delete Table</h2>
              <button className={ui.modalClose} onClick={closeModal}>
                ×
              </button>
            </div>
            <div className={ui.modalBody}>
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "delete-row" && (
        <div className={ui.overlay} onClick={closeModal}>
          <div className={ui.modal} onClick={(e) => e.stopPropagation()}>
            <div className={ui.modalHeader}>
              <h2 className={ui.modalTitle}>Delete Row</h2>
              <button className={ui.modalClose} onClick={closeModal}>
                ×
              </button>
            </div>
            <div className={ui.modalBody}>
              <p className={ui.confirmText}>Delete this row?</p>
              <p className={ui.confirmSub}>This cannot be undone.</p>
            </div>
            <div className={ui.modalFooter}>
              <button className={ui.btn} onClick={closeModal}>
                Cancel
              </button>
              <button className={ui.btnDanger} onClick={handleDeleteRow} disabled={saving}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
