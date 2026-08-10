/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { customTablesApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import ImageUpload from "../components/ImageUpload";
import ui from "../components/ui.module.css";

type ModalType = "add-row" | "edit-row" | "delete-row" | null;

function truncate(value: string, length: number): string {
  if (value.length <= length) return value;
  return `${value.slice(0, length)}…`;
}

export default function CustomTableDataPage() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { hasPermission } = useAuthContext();

  const [table, setTable] = useState<any | null>(null);
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [modal, setModal] = useState<ModalType>(null);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [rowForm, setRowForm] = useState<Record<string, any>>({});
  const [modalError, setModalError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tableId) loadPage(tableId);
  }, [tableId]);

  async function loadPage(id: string) {
    setLoading(true);
    setPageError("");
    try {
      // Resolve the table record by fetching the full list and finding by id.
      // The existing GET /admin/custom-tables already returns everything we need;
      // no new endpoint is required.
      const res = await customTablesApi.getAll();
      const found = (res.customTables || []).find((t: any) => t.id === id);
      if (!found) {
        setPageError("Table not found.");
        setLoading(false);
        return;
      }
      setTable(found);

      const [columns, data] = await Promise.all([
        customTablesApi.getColumns(id),
        customTablesApi.getData(found.name),
      ]);
      setTableColumns(columns || []);
      setTableData(data || []);
    } catch {
      setPageError("Failed to load table data.");
    } finally {
      setLoading(false);
    }
  }

  async function refreshData() {
    if (!table) return;
    try {
      const data = await customTablesApi.getData(table.name);
      setTableData(data || []);
    } catch {
      setPageError("Failed to refresh data.");
    }
  }

  // ── Modal helpers ─────────────────────────────────────────────────────────

  function closeModal() {
    setModal(null);
    setSelectedRow(null);
    setRowForm({});
    setModalError("");
    setSaving(false);
  }

  function openAddRowModal() {
    setRowForm({});
    setSelectedRow(null);
    setModalError("");
    setModal("add-row");
  }

  function openEditRowModal(row: any) {
    setSelectedRow(row);
    setRowForm({ ...row });
    setModalError("");
    setModal("edit-row");
  }

  function openDeleteRowModal(row: any) {
    setSelectedRow(row);
    setModalError("");
    setModal("delete-row");
  }

  // ── Row CRUD ──────────────────────────────────────────────────────────────

  async function handleSaveRow() {
    if (!table) return;
    setSaving(true);
    setModalError("");
    try {
      if (modal === "edit-row" && selectedRow) {
        await customTablesApi.updateData(table.name, selectedRow.id, rowForm);
      } else {
        await customTablesApi.createData(table.name, rowForm);
      }
      await refreshData();
      closeModal();
    } catch (err: any) {
      setModalError(err?.message || "Failed to save row.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteRow() {
    if (!table || !selectedRow) return;
    setSaving(true);
    setModalError("");
    try {
      await customTablesApi.deleteData(table.name, selectedRow.id);
      await refreshData();
      closeModal();
    } catch (err: any) {
      setModalError(err?.message || "Failed to delete row.");
    } finally {
      setSaving(false);
    }
  }

  // ── Cell / form renderers (copied verbatim from original DatabasePage) ────

  function renderCellValue(column: any, value: any) {
    if (value === null || value === undefined || value === "") return "—";
    if (column.data_type === "boolean") return value ? "Yes" : "No";
    if (column.column_name.includes("image")) {
      return <img src={value} alt="" width={40} height={40} style={{ objectFit: "cover" }} />;
    }
    return truncate(String(value), 60);
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

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) return <div className={ui.loading}>Loading…</div>;
  if (pageError) return <div className={ui.errorMsg}>{pageError}</div>;
  if (!table) return null;

  return (
    <div>
      <button
        className={ui.btn}
        onClick={() => navigate("/admin/database")}
        style={{ marginBottom: "var(--space-sm)" }}
      >
        <ArrowLeft size={16} /> All Tables
      </button>

      <div className={ui.pageHeader}>
        <h1 className={ui.pageTitle}>{table.displayName}</h1>
        {hasPermission("custom_tables", "create") && (
          <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={openAddRowModal}>
            <Plus size={16} /> Add Row
          </button>
        )}
      </div>

      {loading ? (
        <div className={ui.loading}>Loading…</div>
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
                    <td key={col.column_name}>{renderCellValue(col, row[col.column_name])}</td>
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

      {/* ── Add / Edit row modal ──────────────────────────────────────── */}
      {(modal === "add-row" || modal === "edit-row") && (
        <div className={ui.overlay} onClick={closeModal}>
          <div className={ui.modal} onClick={(e) => e.stopPropagation()}>
            <div className={ui.modalHeader}>
              <h2 className={ui.modalTitle}>{modal === "edit-row" ? "Edit Row" : "Add Row"}</h2>
              <button className={ui.modalClose} onClick={closeModal}>×</button>
            </div>
            <div className={ui.modalBody}>
              {modalError && <div className={ui.errorMsg}>{modalError}</div>}
              <div className={ui.form}>{tableColumns.map((col) => renderFormField(col))}</div>
            </div>
            <div className={ui.modalFooter}>
              <button className={ui.btn} onClick={closeModal}>Cancel</button>
              <button
                className={`${ui.btn} ${ui.btnPrimary}`}
                onClick={handleSaveRow}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete row modal ──────────────────────────────────────────── */}
      {modal === "delete-row" && (
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
              <button className={ui.btn} onClick={closeModal}>Cancel</button>
              <button className={ui.btnDanger} onClick={handleDeleteRow} disabled={saving}>
                {saving ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}