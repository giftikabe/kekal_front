/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  GripVertical,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  ChevronLeft,
  Pencil,
  Check,
} from "lucide-react";
import { pagesApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import ui from "../components/ui.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Page {
  id: string;
  name: string;
  route: string;
}

interface Section {
  id: string;
  pageId: string;
  sectionName: string | null;
  sectionHeader: string | null;
  componentId: string | null;
  componentConfig: string | null;
  layoutOrder: number;
  isVisible: boolean;
  templateName: string | null;
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function displayName(s: Section) {
  return s.sectionHeader || s.sectionName || s.componentId || "Untitled Section";
}

function componentLabel(s: Section) {
  return s.componentId || s.sectionName || "—";
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PageBuilderPage() {
  const { hasPermission } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>(
    searchParams.get("page") || "",
  );
  const [sections, setSections] = useState<Section[]>([]);
  const [templates, setTemplates] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Drag state
  const dragIdx = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  // Modals
  const [addModal, setAddModal] = useState(false);
  const [editSection, setEditSection] = useState<Section | null>(null);
  const [addForm, setAddForm] = useState({
    sectionName: "",
    sectionHeader: "",
    componentId: "",
    fromTemplate: "",
  });
  const [addSaving, setAddSaving] = useState(false);

  const canEdit = hasPermission("page_sections", "update");
  const canCreate = hasPermission("page_sections", "create");
  const canDelete = hasPermission("page_sections", "delete");

  // ── Load pages on mount ──────────────────────────────────────────────────
  useEffect(() => {
    pagesApi.getAll().then((p) => setPages(p as Page[])).catch(() => {});
    pagesApi.getTemplates().then((t) => setTemplates(t as Section[])).catch(() => {});
  }, []);

  // ── Load sections when page changes ─────────────────────────────────────
  useEffect(() => {
    if (!selectedPageId) {
      setSections([]);
      return;
    }
    setSearchParams({ page: selectedPageId }, { replace: true });
    setLoading(true);
    setError("");
    pagesApi
      .getSectionsByPage(selectedPageId)
      .then((s) => setSections(s as Section[]))
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedPageId]);

  // ── Drag & drop ──────────────────────────────────────────────────────────
  const handleDragStart = (idx: number) => {
    dragIdx.current = idx;
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOver(idx);
  };

  const handleDrop = async (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    setDragOver(null);
    const fromIdx = dragIdx.current;
    if (fromIdx === null || fromIdx === targetIdx) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(targetIdx, 0, moved);

    // Assign new layoutOrder values
    const updated = reordered.map((s, i) => ({ ...s, layoutOrder: i }));
    setSections(updated);
    dragIdx.current = null;

    try {
      await pagesApi.reorderSections(
        updated.map((s) => ({ id: s.id, layoutOrder: s.layoutOrder })),
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDragEnd = () => {
    setDragOver(null);
    dragIdx.current = null;
  };

  // ── Toggle visibility ────────────────────────────────────────────────────
  const toggleVisible = async (s: Section) => {
    try {
      await pagesApi.updateSection(s.id, { isVisible: !s.isVisible });
      setSections(sections.map((sec) =>
        sec.id === s.id ? { ...sec, isVisible: !s.isVisible } : sec,
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ── Delete section ────────────────────────────────────────────────────────
  const deleteSection = async (id: string) => {
    if (!confirm("Remove this section from the page?")) return;
    try {
      await pagesApi.deleteSection(id);
      setSections(sections.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ── Duplicate section as template ────────────────────────────────────────
  const duplicateToPage = async (s: Section) => {
    if (!selectedPageId) return;
    try {
      const copy = await pagesApi.duplicateSection(s.id, {
        pageId: selectedPageId,
        layoutOrder: sections.length,
      });
      setSections([...sections, copy as Section]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ── Add section ────────────────────────────────────────────────────────────
  const openAddModal = () => {
    setAddForm({ sectionName: "", sectionHeader: "", componentId: "", fromTemplate: "" });
    setAddModal(true);
  };

  const handleAdd = async () => {
    if (!selectedPageId) return;
    setAddSaving(true);
    try {
      if (addForm.fromTemplate) {
        // Duplicate a template section onto this page
        const copy = await pagesApi.duplicateSection(addForm.fromTemplate, {
          pageId: selectedPageId,
          layoutOrder: sections.length,
        });
        setSections([...sections, copy as Section]);
      } else {
        // Brand new section
        if (!addForm.sectionName && !addForm.componentId) return;
        const created = await pagesApi.createSection({
          pageId: selectedPageId,
          sectionName: addForm.sectionName || null,
          sectionHeader: addForm.sectionHeader || null,
          componentId: addForm.componentId || null,
          layoutOrder: sections.length,
          isVisible: true,
        });
        setSections([...sections, created as Section]);
      }
      setAddModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAddSaving(false);
    }
  };

  // ── Save template name (mark as reusable template) ───────────────────────
  const saveAsTemplate = async (s: Section, templateName: string) => {
    try {
      const updated = await pagesApi.updateSection(s.id, { templateName });
      setSections(sections.map((sec) => (sec.id === s.id ? (updated as Section) : sec)));
      setTemplates((prev) => {
        const exists = prev.find((t) => t.id === s.id);
        return exists
          ? prev.map((t) => (t.id === s.id ? (updated as Section) : t))
          : [...prev, updated as Section];
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const selectedPage = pages.find((p) => p.id === selectedPageId);

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* ── Header ── */}
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
            onClick={() => navigate("/admin/pages")}
          >
            <ChevronLeft size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
            Pages & SEO
          </button>
          {canCreate && selectedPageId && (
            <button
              className={`${ui.btn} ${ui.btnPrimary}`}
              onClick={openAddModal}
            >
              <Plus size={13} style={{ marginRight: 6, verticalAlign: -2 }} />
              Add Section
            </button>
          )}
        </div>
      </div>

      {error && <div className={ui.errorMsg}>{error}</div>}

      {/* ── Page selector ── */}
      <div className={ui.card} style={{ marginBottom: 16, padding: "16px 20px" }}>
        <label className={ui.label}>Select a Page to Edit</label>
        <select
          className={ui.select}
          value={selectedPageId}
          onChange={(e) => setSelectedPageId(e.target.value)}
          style={{ maxWidth: 360 }}
        >
          <option value="">— choose a page —</option>
          {pages.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.route})
            </option>
          ))}
        </select>
      </div>

      {/* ── Section list ── */}
      {!selectedPageId ? (
        <div className={ui.empty}>
          <div className={ui.emptyIcon}>◱</div>
          Select a page above to start building.
        </div>
      ) : loading ? (
        <div className={ui.loading}>Loading sections…</div>
      ) : sections.length === 0 ? (
        <div className={ui.empty}>
          <div className={ui.emptyIcon}>＋</div>
          No sections yet — add one to start building.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {sections.map((s, idx) => (
            <SectionRow
              key={s.id}
              section={s}
              idx={idx}
              dragOver={dragOver === idx}
              canEdit={canEdit}
              canDelete={canDelete}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              onToggleVisible={() => toggleVisible(s)}
              onDelete={() => deleteSection(s.id)}
              onDuplicate={() => duplicateToPage(s)}
              onSaveAsTemplate={(name) => saveAsTemplate(s, name)}
              onEdit={() => setEditSection(s)}
            />
          ))}
        </div>
      )}

      {/* ── Add Section Modal ── */}
      {addModal && (
        <div className={ui.overlay}>
          <div className={ui.modal}>
            <div className={ui.modalHeader}>
              <div className={ui.modalTitle}>Add Section</div>
              <button className={ui.modalClose} onClick={() => setAddModal(false)}>✕</button>
            </div>
            <div className={ui.modalBody}>
              <div className={ui.form}>

                {templates.length > 0 && (
                  <div className={ui.field}>
                    <label className={ui.label}>Use a Template</label>
                    <select
                      className={ui.select}
                      value={addForm.fromTemplate}
                      onChange={(e) =>
                        setAddForm({ ...addForm, fromTemplate: e.target.value })
                      }
                    >
                      <option value="">— start from scratch —</option>
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.templateName}
                        </option>
                      ))}
                    </select>
                    {addForm.fromTemplate && (
                      <div className={ui.hint}>
                        A copy of this template will be added to the page.
                      </div>
                    )}
                  </div>
                )}

                {!addForm.fromTemplate && (
                  <>
                    <div className={ui.field}>
                      <label className={ui.label}>Component ID</label>
                      <input
                        className={ui.input}
                        value={addForm.componentId}
                        onChange={(e) =>
                          setAddForm({ ...addForm, componentId: e.target.value })
                        }
                        placeholder="e.g. Hero, FeaturedCollections, StatsBar"
                      />
                      <div className={ui.hint}>
                        Must match the .tsx component filename exactly.
                      </div>
                    </div>
                    <div className={ui.field}>
                      <label className={ui.label}>Section Name</label>
                      <input
                        className={ui.input}
                        value={addForm.sectionName}
                        onChange={(e) =>
                          setAddForm({ ...addForm, sectionName: e.target.value })
                        }
                        placeholder="e.g. hero, featured_collections"
                      />
                    </div>
                    <div className={ui.field}>
                      <label className={ui.label}>Section Header</label>
                      <input
                        className={ui.input}
                        value={addForm.sectionHeader}
                        onChange={(e) =>
                          setAddForm({ ...addForm, sectionHeader: e.target.value })
                        }
                        placeholder="e.g. Our Collections"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className={ui.modalFooter}>
              <button
                className={`${ui.btn} ${ui.btnSecondary}`}
                onClick={() => setAddModal(false)}
              >
                Cancel
              </button>
              <button
                className={`${ui.btn} ${ui.btnPrimary}`}
                onClick={handleAdd}
                disabled={addSaving}
              >
                {addSaving ? "Adding…" : "Add Section"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Section Modal ── */}
      {editSection && (
        <EditSectionModal
          section={editSection}
          onClose={() => setEditSection(null)}
          onSaved={(updated) => {
            setSections(sections.map((s) => (s.id === updated.id ? updated : s)));
            setEditSection(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Section row ──────────────────────────────────────────────────────────────

function SectionRow({
  section,
  idx,
  dragOver,
  canEdit,
  canDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onToggleVisible,
  onDelete,
  onDuplicate,
  onSaveAsTemplate,
  onEdit,
}: {
  section: Section;
  idx: number;
  dragOver: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onToggleVisible: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onSaveAsTemplate: (name: string) => void;
  onEdit: () => void;
}) {
  const [templateInput, setTemplateInput] = useState(section.templateName || "");
  const [showTemplateInput, setShowTemplateInput] = useState(false);

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
        opacity: section.isVisible ? 1 : 0.5,
        borderLeft: dragOver ? "3px solid #000" : "3px solid transparent",
        display: "flex",
        alignItems: "center",
        gap: 12,
        transition: "border-color 0.1s",
        cursor: canEdit ? "grab" : "default",
      }}
    >
      {/* Drag handle */}
      {canEdit && (
        <GripVertical size={16} style={{ color: "#ccc", flexShrink: 0 }} />
      )}

      {/* Order badge */}
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#999",
          minWidth: 20,
          textAlign: "center",
        }}
      >
        {idx + 1}
      </span>

      {/* Section info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: "#000" }}>
          {displayName(section)}
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            color: "#999",
            marginTop: 2,
          }}
        >
          {componentLabel(section)}
        </div>
        {section.templateName && (
          <span
            style={{
              fontSize: 10,
              background: "#f0f0f0",
              padding: "1px 6px",
              borderRadius: 4,
              color: "#666",
              marginTop: 4,
              display: "inline-block",
            }}
          >
            template: {section.templateName}
          </span>
        )}
      </div>

      {/* Template save inline */}
      {canEdit && (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {showTemplateInput ? (
            <>
              <input
                className={ui.input}
                style={{ fontSize: 11, padding: "4px 8px", width: 140 }}
                value={templateInput}
                onChange={(e) => setTemplateInput(e.target.value)}
                placeholder="Template name…"
                autoFocus
              />
              <button
                className={ui.iconBtn}
                onClick={() => {
                  if (templateInput.trim()) {
                    onSaveAsTemplate(templateInput.trim());
                  }
                  setShowTemplateInput(false);
                }}
                title="Save template name"
              >
                <Check size={13} />
              </button>
            </>
          ) : (
            <button
              className={ui.iconBtn}
              onClick={() => setShowTemplateInput(true)}
              title="Save as template"
              style={{ fontSize: 10, padding: "2px 8px" }}
            >
              {section.templateName ? "rename template" : "+ template"}
            </button>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        {canEdit && (
          <button
            className={ui.iconBtn}
            onClick={onEdit}
            title="Edit section"
          >
            <Pencil size={14} />
          </button>
        )}
        {canEdit && (
          <button
            className={ui.iconBtn}
            onClick={onToggleVisible}
            title={section.isVisible ? "Hide section" : "Show section"}
          >
            {section.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        )}
        {canEdit && (
          <button
            className={ui.iconBtn}
            onClick={onDuplicate}
            title="Duplicate to end of page"
          >
            <Copy size={14} />
          </button>
        )}
        {canDelete && (
          <button
            className={ui.iconBtn}
            onClick={onDelete}
            title="Remove section"
            style={{ color: "#e53" }}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Edit Section Modal ───────────────────────────────────────────────────────

function EditSectionModal({
  section,
  onClose,
  onSaved,
}: {
  section: Section;
  onClose: () => void;
  onSaved: (s: Section) => void;
}) {
  const [form, setForm] = useState({
    sectionName: section.sectionName || "",
    sectionHeader: section.sectionHeader || "",
    componentId: section.componentId || "",
    componentConfig: section.componentConfig || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await pagesApi.updateSection(section.id, {
        sectionName: form.sectionName || null,
        sectionHeader: form.sectionHeader || null,
        componentId: form.componentId || null,
        componentConfig: form.componentConfig || null,
      });
      onSaved(updated as Section);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={ui.overlay}>
      <div className={ui.modal}>
        <div className={ui.modalHeader}>
          <div className={ui.modalTitle}>Edit Section</div>
          <button className={ui.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={ui.modalBody}>
          {error && <div className={ui.errorMsg}>{error}</div>}
          <div className={ui.form}>
            <div className={ui.field}>
              <label className={ui.label}>Component ID</label>
              <input
                className={ui.input}
                value={form.componentId}
                onChange={(e) => setForm({ ...form, componentId: e.target.value })}
                placeholder="e.g. Hero, FeaturedCollections"
              />
              <div className={ui.hint}>Must match the .tsx component filename exactly.</div>
            </div>
            <div className={ui.field}>
              <label className={ui.label}>Section Name</label>
              <input
                className={ui.input}
                value={form.sectionName}
                onChange={(e) => setForm({ ...form, sectionName: e.target.value })}
                placeholder="e.g. hero"
              />
            </div>
            <div className={ui.field}>
              <label className={ui.label}>Section Header</label>
              <input
                className={ui.input}
                value={form.sectionHeader}
                onChange={(e) => setForm({ ...form, sectionHeader: e.target.value })}
                placeholder="e.g. Our Story"
              />
            </div>
            <div className={ui.field}>
              <label className={ui.label}>Component Config (JSON)</label>
              <textarea
                className={ui.input}
                style={{ fontFamily: "monospace", fontSize: 11, minHeight: 100 }}
                value={form.componentConfig}
                onChange={(e) => setForm({ ...form, componentConfig: e.target.value })}
                placeholder='{"dataSource": "products", "limit": 6}'
              />
              <div className={ui.hint}>
                Optional JSON passed as props to the component at render time.
              </div>
            </div>
          </div>
        </div>
        <div className={ui.modalFooter}>
          <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={onClose}>
            Cancel
          </button>
          <button
            className={`${ui.btn} ${ui.btnPrimary}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}