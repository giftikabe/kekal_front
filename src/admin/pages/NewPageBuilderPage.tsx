/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  GripVertical, Plus, Trash2, Eye, EyeOff,
  ChevronLeft, Pencil, ExternalLink,
} from "lucide-react";
import { api, pagesApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import ui from "../components/ui.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Page { id: string; name: string; route: string; }

interface SectionTemplate {
  id: string; name: string; slug: string;
  description: string; data_source: string | null;
  field_schema: string; published: boolean;
}

interface SectionInstance {
  id: string; page_id: string; template_id: string;
  layout_order: number; field_values: string;
  data_source: string | null; is_visible: boolean;
  template: SectionTemplate | null;
}

const DATA_SOURCES = [
  { value: "",               label: "Placeholder data" },
  { value: "products",       label: "Products" },
  { value: "collections",    label: "Collections" },
  { value: "events",         label: "Events" },
  { value: "upcomingEvents", label: "Upcoming Events" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function NewPageBuilderPage() {
  const { hasPermission } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [pages, setPages] = useState<Page[]>([]);
  const [templates, setTemplates] = useState<SectionTemplate[]>([]);
  const [selectedPageId, setSelectedPageId] = useState(searchParams.get("page") || "");
  const [instances, setInstances] = useState<SectionInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modals
  const [addModal, setAddModal] = useState(false);
  const [editInstance, setEditInstance] = useState<SectionInstance | null>(null);
  const [addTemplateId, setAddTemplateId] = useState("");
  const [addSaving, setAddSaving] = useState(false);

  // Drag
  const dragIdx = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const canEdit   = hasPermission("page_sections", "update");
  const canCreate = hasPermission("page_sections", "create");
  const canDelete = hasPermission("page_sections", "delete");

  useEffect(() => {
    Promise.all([
      pagesApi.getAll(),
      api.get<SectionTemplate[]>("/admin/section-templates"),
    ]).then(([p, t]) => {
      setPages(p as Page[]);
      setTemplates(t);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedPageId) { setInstances([]); return; }
    setSearchParams({ page: selectedPageId }, { replace: true });
    setLoading(true);
    api.get<SectionInstance[]>(`/admin/page-section-instances/by-page/${selectedPageId}`)
      .then(setInstances)
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedPageId]);

  // ── Drag & drop ──────────────────────────────────────────────────────────────
  const handleDrop = async (targetIdx: number) => {
    setDragOver(null);
    const fromIdx = dragIdx.current;
    if (fromIdx === null || fromIdx === targetIdx) return;
    const reordered = [...instances];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(targetIdx, 0, moved);
    const updated = reordered.map((s, i) => ({ ...s, layout_order: i }));
    setInstances(updated);
    dragIdx.current = null;
    try {
      await api.patch("/admin/page-section-instances/reorder", {
        updates: updated.map((s) => ({ id: s.id, layout_order: s.layout_order })),
      });
    } catch (e: any) { setError(e.message); }
  };

  // ── Toggle visibility ────────────────────────────────────────────────────────
  const toggleVisible = async (inst: SectionInstance) => {
    try {
      await api.patch(`/admin/page-section-instances/${inst.id}`, { is_visible: !inst.is_visible });
      setInstances(instances.map((i) => i.id === inst.id ? { ...i, is_visible: !inst.is_visible } : i));
    } catch (e: any) { setError(e.message); }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const deleteInstance = async (id: string) => {
    if (!confirm("Remove this section from the page?")) return;
    try {
      await api.delete(`/admin/page-section-instances/${id}`);
      setInstances(instances.filter((i) => i.id !== id));
    } catch (e: any) { setError(e.message); }
  };

  // ── Add section instance ──────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!addTemplateId || !selectedPageId) return;
    setAddSaving(true);
    try {
      const created = await api.post<SectionInstance>("/admin/page-section-instances", {
        page_id: selectedPageId,
        template_id: addTemplateId,
        layout_order: instances.length,
        field_values: "{}",
        is_visible: true,
      });
      setInstances([...instances, created]);
      setAddModal(false);
      setAddTemplateId("");
    } catch (e: any) { setError(e.message); }
    finally { setAddSaving(false); }
  };

  const selectedPage = pages.find((p) => p.id === selectedPageId);
  const publishedTemplates = templates.filter((t) => t.published);

  return (
    <div>
      <div className={ui.pageHeader}>
        <div>
          <div className={ui.pageTitle}>Page Builder</div>
          {selectedPage && (
            <div className={ui.pageCount} style={{ fontFamily: "monospace" }}>
              {selectedPage.route}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className={`${ui.btn} ${ui.btnSecondary}`}
            onClick={() => navigate("/admin/component-library")}
          >
            <ChevronLeft size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
            Component Library
          </button>
          {canCreate && selectedPageId && (
            <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={() => setAddModal(true)}>
              <Plus size={13} style={{ marginRight: 6, verticalAlign: -2 }} />
              Add Section
            </button>
          )}
        </div>
      </div>

      {error && <div className={ui.errorMsg}>{error}</div>}

      {/* Page selector */}
      <div className={ui.card} style={{ marginBottom: 16, padding: "16px 20px" }}>
        <label className={ui.label}>Select a Page</label>
        <select
          className={ui.select}
          value={selectedPageId}
          onChange={(e) => setSelectedPageId(e.target.value)}
          style={{ maxWidth: 380 }}
        >
          <option value="">— choose a page —</option>
          {pages.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.route})</option>
          ))}
        </select>
      </div>

      {/* No published templates warning */}
      {selectedPageId && publishedTemplates.length === 0 && (
        <div className={ui.card} style={{ padding: "16px 20px", marginBottom: 16, background: "#fffbf0" }}>
          <div style={{ fontSize: 13, color: "#886" }}>
            No published templates yet.{" "}
            <button
              style={{ color: "#000", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}
              onClick={() => navigate("/admin/component-library")}
            >
              Go to Component Library
            </button>{" "}
            to create and publish section templates first.
          </div>
        </div>
      )}

      {/* Section list */}
      {!selectedPageId ? (
        <div className={ui.empty}>
          <div className={ui.emptyIcon}>◱</div>
          Select a page to start building.
        </div>
      ) : loading ? (
        <div className={ui.loading}>Loading sections…</div>
      ) : instances.length === 0 ? (
        <div className={ui.empty}>
          <div className={ui.emptyIcon}>＋</div>
          No sections yet — click "Add Section" to place a template here.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {instances.map((inst, idx) => (
            <InstanceRow
              key={inst.id}
              instance={inst}
              idx={idx}
              isDragOver={dragOver === idx}
              canEdit={canEdit}
              canDelete={canDelete}
              onDragStart={() => { dragIdx.current = idx; }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(idx); }}
              onDrop={() => handleDrop(idx)}
              onDragEnd={() => { setDragOver(null); dragIdx.current = null; }}
              onToggleVisible={() => toggleVisible(inst)}
              onDelete={() => deleteInstance(inst.id)}
              onEdit={() => setEditInstance(inst)}
              onPreview={() => navigate(`/admin/template-editor/${inst.template_id}`)}
            />
          ))}
        </div>
      )}

      {/* Add section modal */}
      {addModal && (
        <div className={ui.overlay}>
          <div className={ui.modal}>
            <div className={ui.modalHeader}>
              <div className={ui.modalTitle}>Add Section</div>
              <button className={ui.modalClose} onClick={() => setAddModal(false)}>✕</button>
            </div>
            <div className={ui.modalBody}>
              <div className={ui.form}>
                {publishedTemplates.length === 0 ? (
                  <div style={{ fontSize: 13, color: "#888", padding: "8px 0" }}>
                    No published templates available. Create and publish templates in the Component Library first.
                  </div>
                ) : (
                  <div className={ui.field}>
                    <label className={ui.label}>Choose a Template *</label>
                    <select
                      className={ui.select}
                      value={addTemplateId}
                      onChange={(e) => setAddTemplateId(e.target.value)}
                    >
                      <option value="">— select a template —</option>
                      {publishedTemplates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} {t.data_source ? `(${t.data_source})` : ""}
                        </option>
                      ))}
                    </select>
                    {addTemplateId && (
                      <div className={ui.hint}>
                        {templates.find((t) => t.id === addTemplateId)?.description}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className={ui.modalFooter}>
              <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={() => setAddModal(false)}>
                Cancel
              </button>
              <button
                className={`${ui.btn} ${ui.btnPrimary}`}
                onClick={handleAdd}
                disabled={addSaving || !addTemplateId}
              >
                {addSaving ? "Adding…" : "Add to Page"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit instance modal */}
      {editInstance && (
        <EditInstanceModal
          instance={editInstance}
          onClose={() => setEditInstance(null)}
          onSaved={(updated) => {
            setInstances(instances.map((i) => i.id === updated.id ? { ...i, ...updated } : i));
            setEditInstance(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Instance row ─────────────────────────────────────────────────────────────

function InstanceRow({
  instance, idx, isDragOver, canEdit, canDelete,
  onDragStart, onDragOver, onDrop, onDragEnd,
  onToggleVisible, onDelete, onEdit, onPreview,
}: {
  instance: SectionInstance; idx: number; isDragOver: boolean;
  canEdit: boolean; canDelete: boolean;
  onDragStart: () => void; onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void; onDragEnd: () => void;
  onToggleVisible: () => void; onDelete: () => void;
  onEdit: () => void; onPreview: () => void;
}) {
  return (
    <div
      draggable={canEdit}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={ui.card}
      style={{
        padding: "14px 16px",
        opacity: instance.is_visible ? 1 : 0.45,
        borderLeft: isDragOver ? "3px solid #000" : "3px solid transparent",
        display: "flex", alignItems: "center", gap: 12,
        transition: "border-color 0.1s",
        cursor: canEdit ? "grab" : "default",
      }}
    >
      {canEdit && <GripVertical size={16} style={{ color: "#ccc", flexShrink: 0 }} />}

      <span style={{ fontSize: 10, fontWeight: 700, color: "#bbb", minWidth: 20, textAlign: "center" }}>
        {idx + 1}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>
          {instance.template?.name ?? "Unknown Template"}
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: "#999", marginTop: 2 }}>
          {instance.template?.slug}.tsx
          {(instance.data_source || instance.template?.data_source) && (
            <span style={{ marginLeft: 8, background: "#f0f0f0", padding: "1px 6px", borderRadius: 4 }}>
              {instance.data_source || instance.template?.data_source}
            </span>
          )}
        </div>
        {!instance.template?.published && (
          <span style={{ fontSize: 10, color: "#e88", marginTop: 2, display: "inline-block" }}>
            ⚠ template not published
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        <button className={ui.iconBtn} onClick={onPreview} title="View template code">
          <ExternalLink size={14} />
        </button>
        {canEdit && (
          <button className={ui.iconBtn} onClick={onEdit} title="Configure section">
            <Pencil size={14} />
          </button>
        )}
        {canEdit && (
          <button className={ui.iconBtn} onClick={onToggleVisible} title={instance.is_visible ? "Hide" : "Show"}>
            {instance.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        )}
        {canDelete && (
          <button className={ui.iconBtn} onClick={onDelete} title="Remove" style={{ color: "#e53" }}>
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Edit instance modal — configure data source + field values ───────────────

function EditInstanceModal({
  instance, onClose, onSaved,
}: {
  instance: SectionInstance;
  onClose: () => void;
  onSaved: (updated: SectionInstance) => void;
}) {
  const [dataSource, setDataSource] = useState(instance.data_source || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  let parsedFields: Record<string, string> = {};
  try { parsedFields = JSON.parse(instance.field_values); } catch { /* ignore */ }

  const [fieldValues, setFieldValues] = useState<Record<string, string>>(parsedFields);

  // Parse template field_schema
  let templateFields: Array<{ name: string; type: string }> = [];
  try {
    templateFields = JSON.parse(instance.template?.field_schema ?? "[]");
  } catch { /* ignore */ }

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.patch<SectionInstance>(`/admin/page-section-instances/${instance.id}`, {
        data_source: dataSource || null,
        field_values: JSON.stringify(fieldValues),
      });
      onSaved({ ...instance, ...updated });
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className={ui.overlay}>
      <div className={ui.modal}>
        <div className={ui.modalHeader}>
          <div className={ui.modalTitle}>Configure: {instance.template?.name}</div>
          <button className={ui.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={ui.modalBody}>
          {error && <div className={ui.errorMsg}>{error}</div>}
          <div className={ui.form}>

            <div className={ui.field}>
              <label className={ui.label}>Data Source</label>
              <select
                className={ui.select}
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value)}
              >
                {DATA_SOURCES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <div className={ui.hint}>
                Overrides the template default. "Placeholder data" uses public/placeholder-data.json values.
              </div>
            </div>

            {templateFields.length > 0 && !dataSource && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 8, marginBottom: 8 }}>
                  Custom Field Values
                </div>
                {templateFields.map((f) => (
                  <div key={f.name} className={ui.field}>
                    <label className={ui.label}>
                      {f.name} <span style={{ fontWeight: 400, color: "#bbb" }}>({f.type})</span>
                    </label>
                    <input
                      className={ui.input}
                      value={fieldValues[f.name] || ""}
                      onChange={(e) => setFieldValues({ ...fieldValues, [f.name]: e.target.value })}
                      placeholder={`Placeholder: ${f.name}`}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <div className={ui.modalFooter}>
          <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={onClose}>Cancel</button>
          <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}