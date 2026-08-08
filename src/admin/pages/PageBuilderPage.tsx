/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Layout,
} from "lucide-react";
import { pageBuilderApi, componentLibraryApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import ui from "../components/ui.module.css";
import styles from "./PageBuilderPage.module.css";

// ─── SortableSection ──────────────────────────────────────────────────────────

interface SortableSectionProps {
  section: any;
  isActive: boolean;
  onSelect: (section: any) => void;
  onToggleVisibility: (section: any) => void;
  onDelete: (section: any) => void;
}

function SortableSection({
  section,
  isActive,
  onSelect,
  onToggleVisibility,
  onDelete,
}: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        styles.sectionCard,
        isActive ? styles.sectionCardActive : "",
        !section.is_visible ? styles.sectionCardHidden : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onSelect(section)}
    >
      <span className={styles.dragHandle} {...attributes} {...listeners}>
        <GripVertical size={16} />
      </span>
      <div className={styles.sectionInfo}>
        <p className={styles.sectionHeader}>
          {section.section_header || section.section_name || "Untitled Section"}
        </p>
        {section.component_display_name && (
          <p className={styles.sectionComponent}>
            {section.component_display_name}
            {section.component_category ? ` · ${section.component_category}` : ""}
          </p>
        )}
      </div>
      <div className={styles.sectionActions}>
        <button
          className={ui.iconBtn}
          title={section.is_visible ? "Hide section" : "Show section"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(section);
          }}
        >
          {section.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
        <button
          className={ui.iconBtnDanger}
          title="Delete section"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(section);
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── PageBuilderPage ──────────────────────────────────────────────────────────

export default function PageBuilderPage() {
  const { hasPermission } = useAuthContext();

  // Data state
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<any | null>(null);
  const [activeSection, setActiveSection] = useState<any | null>(null);
  const [components, setComponents] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  // UI state
  const [rightTab, setRightTab] = useState<"components" | "settings">(
    "components"
  );
  const [componentCategory, setComponentCategory] = useState("all");
  const [sectionHeaderDraft, setSectionHeaderDraft] = useState("");
  const [sectionConfigDraft, setSectionConfigDraft] = useState("");
  const [configError, setConfigError] = useState("");
  const [templateNameDraft, setTemplateNameDraft] = useState("");

  // Operation state
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Modal state
  const [modal, setModal] = useState <
    "delete-section" | "publish" | "add-section" | null
  >(null);;

  const rightPanelRef = useRef<HTMLDivElement>(null);

  // ── Sensors ────────────────────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ── Initial load ───────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadInitial() {
      setLoading(true);
      try {
        const [pagesData, componentsData, templatesData] = await Promise.all([
          pageBuilderApi.getPages(),
          componentLibraryApi.getAll(),
          pageBuilderApi.getTemplates(),
        ]);
        setPages(pagesData);
        setComponents(componentsData);
        setTemplates(templatesData);
      } catch (err: any) {
        setError(err?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  // ── Fetch full page when selection changes ─────────────────────────────────
  const fetchPage = useCallback(async (pageId: string) => {
    try {
      const data = await pageBuilderApi.getPage(pageId);
      setSelectedPage(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load page");
    }
  }, []);

  useEffect(() => {
    if (selectedPageId) {
      fetchPage(selectedPageId);
    } else {
      setSelectedPage(null);
    }
    setActiveSection(null);
  }, [selectedPageId, fetchPage]);

  // ── Sync drafts when activeSection changes ────────────────────────────────
  useEffect(() => {
    if (activeSection) {
      setSectionHeaderDraft(activeSection.section_header || "");
      setSectionConfigDraft(activeSection.component_config || "");
      setConfigError("");
      setTemplateNameDraft(activeSection.template_name || "");
    }
  }, [activeSection]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const refreshPage = useCallback(() => {
    if (selectedPageId) fetchPage(selectedPageId);
  }, [selectedPageId, fetchPage]);

  const updateSection = useCallback(
    async (body: Record<string, unknown>) => {
      if (!activeSection) return;
      setSaving(true);
      try {
        const updated = await pageBuilderApi.updateSection(
          activeSection.id,
          body
        );
        setActiveSection((prev: any) => ({ ...prev, ...updated }));
        refreshPage();
      } catch (err: any) {
        setError(err?.message || "Failed to update section");
      } finally {
        setSaving(false);
      }
    },
    [activeSection, refreshPage]
  );

  // ── Drag end ───────────────────────────────────────────────────────────────
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id || !selectedPage) return;

      const sections: any[] = selectedPage.sections || [];
      const oldIndex = sections.findIndex((s: any) => s.id === active.id);
      const newIndex = sections.findIndex((s: any) => s.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(sections, oldIndex, newIndex);

      // Optimistic update
      setSelectedPage((prev: any) => ({ ...prev, sections: reordered }));

      try {
        await pageBuilderApi.reorder({
          sections: reordered.map((s: any, i: number) => ({
            id: s.id,
            layout_order: i,
          })),
        });
      } catch {
        // Roll back on failure
        refreshPage();
      }
    },
    [selectedPage, refreshPage]
  );

  // ── Add section from component ─────────────────────────────────────────────
  const handleAddComponent = useCallback(
    async (component: any) => {
      if (!selectedPageId) return;
      try {
        await pageBuilderApi.addSection(selectedPageId, {
          component_id: component.id,
          section_name: component.name?.toLowerCase() ?? component.display_name?.toLowerCase(),
          section_header: component.display_name,
          layout_order: selectedPage?.sections?.length || 0,
          component_config: null,
        });
        refreshPage();
      } catch (err: any) {
        setError(err?.message || "Failed to add section");
      }
    },
    [selectedPageId, selectedPage, refreshPage]
  );

  // ── Use template ───────────────────────────────────────────────────────────
  const handleUseTemplate = useCallback(
    async (template: any) => {
      if (!selectedPageId) return;
      try {
        await pageBuilderApi.useTemplate(template.id, {
          pageId: selectedPageId,
          layout_order: selectedPage?.sections?.length || 0,
        });
        refreshPage();
      } catch (err: any) {
        setError(err?.message || "Failed to use template");
      }
    },
    [selectedPageId, selectedPage, refreshPage]
  );

  // ── Publish ────────────────────────────────────────────────────────────────
  const handlePublish = useCallback(async () => {
    if (!selectedPageId) return;
    setPublishing(true);
    setPublishResult(null);
    try {
      const result = await pageBuilderApi.publishPage(selectedPageId);
      setPublishResult(result);
    } catch (err: any) {
      setPublishResult({ error: err?.message || "Publish failed" });
    } finally {
      setPublishing(false);
    }
  }, [selectedPageId]);

  // ── Delete section ─────────────────────────────────────────────────────────
  const handleDeleteSection = useCallback(async () => {
    if (!activeSection) return;
    try {
      await pageBuilderApi.deleteSection(activeSection.id);
      setActiveSection(null);
      setModal(null);
      refreshPage();
    } catch (err: any) {
      setError(err?.message || "Failed to delete section");
    }
  }, [activeSection, refreshPage]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const categories = [
    "all",
    ...Array.from(
      new Set(components.map((c: any) => c.category).filter(Boolean))
    ),
  ];

  const filteredComponents =
    componentCategory === "all"
      ? components
      : components.filter((c: any) => c.category === componentCategory);

  const sections: any[] = selectedPage?.sections || [];

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) return <p className={ui.loading}>Loading…</p>;

  return (
    <div className={styles.layout}>
      {/* ── LEFT PANEL: Pages list ── */}
      <aside className={styles.leftPanel}>
        <div className={styles.panelHeader}>Pages</div>
        {pages.map((page: any) => (
          <div
            key={page.id}
            className={[
              styles.pageItem,
              selectedPageId === page.id ? styles.pageItemActive : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setSelectedPageId(page.id)}
          >
            {page.name}
            {page.sections && page.sections.length > 0 && (
              <span
                className={ui.badge}
                style={{ marginLeft: 6, fontSize: 10 }}
              >
                {page.sections.length}
              </span>
            )}
          </div>
        ))}
      </aside>

      {/* ── CENTER PANEL: Canvas ── */}
      <main className={styles.centerPanel}>
        {error && <p className={ui.errorMsg}>{error}</p>}

        {!selectedPageId ? (
          <div className={styles.emptyCanvas}>
            <Layout size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
            <span>Select a page from the list to start building</span>
          </div>
        ) : (
          <>
            <div className={styles.canvasHeader}>
              <h1 className={styles.canvasTitle}>{selectedPage?.name}</h1>
              <button
                className={`${ui.btn} ${ui.btnPrimary}`}
                onClick={() => {
                  setPublishResult(null);
                  setModal("publish");
                }}
                disabled={publishing}
              >
                {publishing ? "Publishing…" : "Publish Page"}
              </button>
            </div>

            {sections.length === 0 ? (
              <div className={styles.emptyCanvas}>
                <Plus size={28} style={{ marginBottom: 10, opacity: 0.3 }} />
                <span>No sections yet. Add a component from the right panel.</span>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map((s: any) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((section: any) => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      isActive={activeSection?.id === section.id}
                      onSelect={(s) => {
                        setActiveSection(s);
                        setRightTab("settings");
                      }}
                      onToggleVisibility={(s) => {
                        setActiveSection(s);
                        updateSection({ is_visible: !s.is_visible });
                      }}
                      onDelete={(s) => {
                        setActiveSection(s);
                        setModal("delete-section");
                      }}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}

            <button
              className={styles.addSectionBtn}
              onClick={() => {
                setRightTab("components");
                rightPanelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              + Add Section
            </button>
          </>
        )}
      </main>

      {/* ── RIGHT PANEL ── */}
      <aside className={styles.rightPanel} ref={rightPanelRef}>
        <div className={styles.tabBar}>
          <button
            className={[styles.tab, rightTab === "components" ? styles.tabActive : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setRightTab("components")}
          >
            Components
          </button>
          <button
            className={[styles.tab, rightTab === "settings" ? styles.tabActive : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setRightTab("settings")}
          >
            Section Settings
          </button>
        </div>

        {/* COMPONENTS TAB */}
        {rightTab === "components" && (
          <div className={styles.rightContent}>
            {/* Category filter */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`${ui.btn} ${componentCategory === cat ? ui.btnPrimary : ui.btnSecondary}`}
                  style={{ fontSize: 11, padding: "4px 10px" }}
                  onClick={() => setComponentCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Component cards */}
            {filteredComponents.length === 0 ? (
              <p style={{ fontSize: 12, color: "#999" }}>No components found.</p>
            ) : (
              filteredComponents.map((component: any) => (
                <div key={component.id} className={styles.componentCard}>
                  <p className={styles.componentName}>
                    {component.display_name}
                  </p>
                  {component.category && (
                    <p style={{ fontSize: 11, color: "#bbb", margin: "0 0 8px" }}>
                      {component.category}
                    </p>
                  )}
                  <button
                    className={`${ui.btn} ${ui.btnSecondary}`}
                    style={{ fontSize: 11, padding: "4px 10px" }}
                    disabled={!selectedPageId}
                    onClick={() => handleAddComponent(component)}
                  >
                    Add to Page
                  </button>
                </div>
              ))
            )}

            {/* Templates */}
            {templates.length > 0 && (
              <>
                <hr style={{ margin: "20px 0", borderColor: "#eee" }} />
                <div className={styles.panelHeader} style={{ padding: "0 0 12px" }}>
                  Templates
                </div>
                {templates.map((template: any) => (
                  <div key={template.id} className={styles.componentCard}>
                    <p className={styles.componentName}>{template.template_name}</p>
                    {template.page_name && (
                      <p style={{ fontSize: 11, color: "#bbb", margin: "0 0 8px" }}>
                        From: {template.page_name}
                      </p>
                    )}
                    <button
                      className={`${ui.btn} ${ui.btnSecondary}`}
                      style={{ fontSize: 11, padding: "4px 10px" }}
                      disabled={!selectedPageId}
                      onClick={() => handleUseTemplate(template)}
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {rightTab === "settings" && (
          <div className={styles.rightContent}>
            {!activeSection ? (
              <p style={{ fontSize: 13, color: "#bbb", fontStyle: "italic" }}>
                Click a section to edit its settings.
              </p>
            ) : (
              <>
                {/* Section Header */}
                <div className={styles.settingField}>
                  <label className={styles.settingLabel}>Section Header</label>
                  <input
                    className={ui.input}
                    value={sectionHeaderDraft}
                    onChange={(e) => setSectionHeaderDraft(e.target.value)}
                    onBlur={() =>
                      updateSection({ section_header: sectionHeaderDraft })
                    }
                  />
                </div>

                {/* Component Config */}
                <div className={styles.settingField}>
                  <label className={styles.settingLabel}>
                    Component Data (JSON)
                  </label>
                  <textarea
                    className={ui.textarea}
                    rows={6}
                    style={{ fontFamily: "monospace", fontSize: 11 }}
                    value={sectionConfigDraft}
                    onChange={(e) => {
                      setSectionConfigDraft(e.target.value);
                      setConfigError("");
                    }}
                    onBlur={() => {
                      if (!sectionConfigDraft.trim()) {
                        updateSection({ component_config: null });
                        return;
                      }
                      try {
                        JSON.parse(sectionConfigDraft);
                        updateSection({ component_config: sectionConfigDraft });
                      } catch {
                        setConfigError("Invalid JSON");
                      }
                    }}
                  />
                  {configError && (
                    <p className={ui.errorMsg} style={{ marginTop: 4 }}>
                      {configError}
                    </p>
                  )}
                  <p className={ui.hint}>Override component placeholder data</p>
                </div>

                {/* Visibility */}
                <div className={styles.settingField}>
                  <label className={styles.settingLabel}>Visibility</label>
                  <label className={ui.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={activeSection.is_visible}
                      onChange={() =>
                        updateSection({ is_visible: !activeSection.is_visible })
                      }
                    />
                    Show on website
                  </label>
                </div>

                {/* Save as Template */}
                <div className={styles.settingField}>
                  <label className={styles.settingLabel}>Save as Template</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input
                      className={ui.input}
                      placeholder="Template name (e.g. Hero with CTA)"
                      value={templateNameDraft}
                      onChange={(e) => setTemplateNameDraft(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button
                      className={`${ui.btn} ${ui.btnSecondary}`}
                      onClick={() => {
                        if (templateNameDraft.trim()) {
                          updateSection({ template_name: templateNameDraft.trim() });
                        }
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Danger zone */}
                <div style={{ marginTop: 24 }}>
                  <button
                    className={`${ui.btn} ${ui.btnDanger}`}
                    style={{ width: "100%" }}
                    onClick={() => setModal("delete-section")}
                  >
                    Remove Section
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </aside>

      {/* ── PUBLISH MODAL ── */}
      {modal === "publish" && (
        <div className={ui.overlay} onClick={() => !publishing && setModal(null)}>
          <div className={ui.modal} onClick={(e) => e.stopPropagation()}>
            <div className={ui.modalHeader}>
              <span className={ui.modalTitle}>Publish Page</span>
              <button
                className={ui.modalClose}
                onClick={() => !publishing && setModal(null)}
              >
                ×
              </button>
            </div>
            <div className={ui.modalBody}>
              {!publishResult ? (
                <>
                  <p className={ui.confirmText}>
                    This will generate the complete page code and commit it to{" "}
                    <strong>giftikabe/kekal_frontend</strong>.
                  </p>
                  <p className={ui.confirmSub}>
                    Deployment will trigger automatically. Page will be live after
                    deployment (30–90 seconds).
                  </p>
                </>
              ) : publishResult.error ? (
                <>
                  <p className={ui.errorMsg}>{publishResult.error}</p>
                  <p className={ui.confirmSub}>
                    Check that the GITHUB_TOKEN secret is configured in Cloudflare.
                  </p>
                </>
              ) : (
                <>
                  <p className={ui.confirmText}>
                    ✓ Published successfully!
                  </p>
                  {publishResult.commit_url && (
                    <p className={ui.confirmSub}>
                      <a
                        href={publishResult.commit_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View commit →
                      </a>
                    </p>
                  )}
                </>
              )}
            </div>
            {!publishResult && (
              <div className={ui.modalFooter}>
                <button
                  className={`${ui.btn} ${ui.btnSecondary}`}
                  onClick={() => setModal(null)}
                  disabled={publishing}
                >
                  Cancel
                </button>
                <button
                  className={`${ui.btn} ${ui.btnPrimary}`}
                  onClick={handlePublish}
                  disabled={publishing}
                >
                  {publishing ? "Publishing…" : "Publish Now"}
                </button>
              </div>
            )}
            {publishResult && (
              <div className={ui.modalFooter}>
                <button
                  className={`${ui.btn} ${ui.btnSecondary}`}
                  onClick={() => setModal(null)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── DELETE SECTION MODAL ── */}
      {modal === "delete-section" && activeSection && (
        <div className={ui.overlay} onClick={() => setModal(null)}>
          <div className={ui.modal} onClick={(e) => e.stopPropagation()}>
            <div className={ui.modalHeader}>
              <span className={ui.modalTitle}>Remove Section</span>
              <button className={ui.modalClose} onClick={() => setModal(null)}>
                ×
              </button>
            </div>
            <div className={ui.modalBody}>
              <p className={ui.confirmText}>
                Remove "
                {activeSection.section_header ||
                  activeSection.section_name ||
                  "this section"}
                "?
              </p>
              <p className={ui.confirmSub}>This action cannot be undone.</p>
            </div>
            <div className={ui.modalFooter}>
              <button
                className={`${ui.btn} ${ui.btnSecondary}`}
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
              <button
                className={`${ui.btn} ${ui.btnDanger}`}
                onClick={handleDeleteSection}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}