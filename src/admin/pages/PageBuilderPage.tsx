/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { Trash2, Layout, Plus } from "lucide-react";
import { pageBuilderApi, componentLibraryApi, sectionComponentsApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import SectionCanvas, { type CanvasInstance } from "../components/SectionCanvas";
import DataBindingSelect, { type DataBindingValue } from "../components/DataBindingSelect";
import ui from "../components/ui.module.css";
import styles from "./PageBuilderPage.module.css";

export default function PageBuilderPage() {
  useAuthContext();

  const [pages, setPages] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<any | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);

  const [library, setLibrary] = useState<any[]>([]); // published components only — the palette
  const [templates, setTemplates] = useState<any[]>([]);
  const [sourceCache, setSourceCache] = useState<Record<string, { tsx: string; css: string }>>({});

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"publish" | "new-section" | null>(null);
  const [newSectionHeader, setNewSectionHeader] = useState("");
  const [rightTab, setRightTab] = useState<"components" | "instance">("components");

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
        setLibrary((componentsData as any[]).filter((c) => c.status === "published"));
        setTemplates(templatesData);
      } catch (err: any) {
        setError(err?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  const fetchPage = useCallback(async (pageId: string) => {
    try {
      const data = await pageBuilderApi.getPage(pageId);
      setSelectedPage(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load page");
    }
  }, []);

  useEffect(() => {
    if (selectedPageId) fetchPage(selectedPageId);
    else setSelectedPage(null);
    setActiveSectionId(null);
    setSelectedInstanceId(null);
  }, [selectedPageId, fetchPage]);

  const refreshPage = useCallback(() => {
    if (selectedPageId) fetchPage(selectedPageId);
  }, [selectedPageId, fetchPage]);

  // Warm the source cache for a component so the canvas can actually
  // render it (PreviewFrame needs real code — there's nothing to render
  // from the DB, code only exists on GitHub).
  const ensureSource = useCallback(
    async (componentId: string) => {
      if (sourceCache[componentId]) return sourceCache[componentId];
      try {
        const src = await componentLibraryApi.getSource(componentId);
        setSourceCache((prev) => ({ ...prev, [componentId]: { tsx: src.tsx, css: src.css || "" } }));
        return src;
      } catch {
        return { tsx: "", css: "" };
      }
    },
    [sourceCache]
  );

  const activeSection = selectedPage?.sections?.find((s: any) => s.id === activeSectionId) ?? null;
  const selectedInstance = activeSection?.instances?.find((i: any) => i.id === selectedInstanceId) ?? null;
  const selectedInstanceComponent = selectedInstance
    ? library.find((c) => c.id === selectedInstance.componentId)
    : null;

  // Warm sources whenever the active section's instances change.
  useEffect(() => {
    if (!activeSection?.instances) return;
    activeSection.instances.forEach((inst: any) => {
      if (inst.componentId) ensureSource(inst.componentId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection?.instances?.length, activeSectionId]);

  async function handleAddSection() {
    if (!selectedPageId) return;
    try {
      const created = await pageBuilderApi.addSection(selectedPageId, {
        section_header: newSectionHeader || "New Section",
        layout_order: selectedPage?.sections?.length || 0,
        canvas_height: 480,
      });
      setModal(null);
      setNewSectionHeader("");
      await refreshPage();
      setActiveSectionId((created as any).id);
    } catch (err: any) {
      setError(err?.message || "Failed to add section");
    }
  }

  async function handleDeleteSection(sectionId: string) {
    try {
      await pageBuilderApi.deleteSection(sectionId);
      if (activeSectionId === sectionId) setActiveSectionId(null);
      await refreshPage();
    } catch (err: any) {
      setError(err?.message || "Failed to delete section");
    }
  }

  async function handleAddComponentToSection(component: any) {
    if (!activeSectionId) return;
    try {
      await sectionComponentsApi.create(activeSectionId, {
        componentId: component.id,
        x: 5,
        y: 5,
        width: 40,
        height: 30,
        zIndex: (activeSection?.instances?.length || 0) + 1,
        propsOverride: {},
        dataBindings: {},
      });
      await ensureSource(component.id);
      await refreshPage();
    } catch (err: any) {
      setError(err?.message || "Failed to add component");
    }
  }

  async function handleInstanceChange(id: string, patch: { x: number; y: number; width: number; height: number }) {
    // Optimistic local update so dragging feels instant.
    setSelectedPage((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((s: any) =>
          s.id !== activeSectionId
            ? s
            : { ...s, instances: s.instances.map((i: any) => (i.id === id ? { ...i, ...patch } : i)) }
        ),
      };
    });
    try {
      await sectionComponentsApi.update(id, patch);
    } catch {
      refreshPage(); // roll back on failure
    }
  }

  async function handleInstanceDelete(id: string) {
    try {
      await sectionComponentsApi.delete(id);
      if (selectedInstanceId === id) setSelectedInstanceId(null);
      await refreshPage();
    } catch (err: any) {
      setError(err?.message || "Failed to remove component");
    }
  }

  async function updateInstanceProp(propName: string, value: any, isBinding: boolean) {
    if (!selectedInstance) return;
    const propsOverride = { ...(selectedInstance.propsOverride || {}) };
    const dataBindings = { ...(selectedInstance.dataBindings || {}) };

    if (isBinding) {
      if (value === null) delete dataBindings[propName];
      else dataBindings[propName] = value;
      delete propsOverride[propName]; // binding takes precedence over a static value
    } else {
      propsOverride[propName] = value;
      delete dataBindings[propName];
    }

    setSelectedPage((prev: any) => ({
      ...prev,
      sections: prev.sections.map((s: any) =>
        s.id !== activeSectionId
          ? s
          : {
              ...s,
              instances: s.instances.map((i: any) =>
                i.id === selectedInstance.id ? { ...i, propsOverride, dataBindings } : i
              ),
            }
      ),
    }));

    try {
      await sectionComponentsApi.update(selectedInstance.id, { propsOverride, dataBindings });
    } catch {
      refreshPage();
    }
  }

  async function handleSaveAsTemplate(section: any) {
    const name = window.prompt("Template name:", section.templateName || section.sectionHeader || "");
    if (name === null) return;
    try {
      await pageBuilderApi.updateSection(section.id, { template_name: name.trim() || null });
      const [templatesData] = await Promise.all([pageBuilderApi.getTemplates(), refreshPage()]);
      setTemplates(templatesData);
    } catch (err: any) {
      setError(err?.message || "Failed to save template");
    }
  }

  async function handleUseTemplate(template: any) {
    if (!selectedPageId) return;
    try {
      await pageBuilderApi.useTemplate(template.id, {
        pageId: selectedPageId,
        layout_order: selectedPage?.sections?.length || 0,
      });
      await refreshPage();
    } catch (err: any) {
      setError(err?.message || "Failed to use template");
    }
  }

  async function handlePublish() {
    if (!selectedPageId) return;
    setPublishing(true);
    setPublishResult(null);
    try {
      setPublishResult(await pageBuilderApi.publishPage(selectedPageId));
    } catch (err: any) {
      setPublishResult({ success: false, error: err?.message || "Publish failed" });
    } finally {
      setPublishing(false);
    }
  }

  const canvasInstances: CanvasInstance[] = (activeSection?.instances || []).map((inst: any) => {
    const src = sourceCache[inst.componentId] || { tsx: "", css: "" };
    const comp = library.find((c) => c.id === inst.componentId);
    const propSchema = comp?.propSchema || [];
    // Resolve preview props: dataBindings show a "bound" placeholder tag
    // (we don't re-fetch the real record just for canvas preview — the
    // dropdown itself shows what's selected), everything else falls back
    // through propsOverride -> propSchema placeholder.
    const props: Record<string, any> = {};
    for (const p of propSchema) {
      if (inst.dataBindings?.[p.name]) {
        props[p.name] = `[bound: ${inst.dataBindings[p.name].source} → ${inst.dataBindings[p.name].field}]`;
      } else if (p.name in (inst.propsOverride || {})) {
        props[p.name] = inst.propsOverride[p.name];
      } else {
        props[p.name] = p.placeholder ?? "";
      }
    }
    return {
      id: inst.id,
      componentId: inst.componentId,
      componentName: inst.componentName || comp?.name || "Unknown",
      x: inst.x,
      y: inst.y,
      width: inst.width,
      height: inst.height,
      zIndex: inst.zIndex,
      props,
      tsxCode: src.tsx,
      cssCode: src.css,
    };
  });

  if (loading) return <p className={ui.loading}>Loading…</p>;

  return (
    <div className={styles.layout}>
      {/* LEFT: pages + this page's sections */}
      <aside className={styles.leftPanel}>
        <div className={styles.panelHeader}>Pages</div>
        {pages.map((page: any) => (
          <div
            key={page.id}
            className={[styles.pageItem, selectedPageId === page.id ? styles.pageItemActive : ""].filter(Boolean).join(" ")}
            onClick={() => setSelectedPageId(page.id)}
          >
            {page.name}
          </div>
        ))}

        {selectedPageId && (
          <>
            <div className={styles.panelHeader} style={{ borderTop: "1px solid #eee" }}>Sections</div>
            {(selectedPage?.sections || []).map((s: any) => (
              <div
                key={s.id}
                className={[styles.pageItem, activeSectionId === s.id ? styles.pageItemActive : ""].filter(Boolean).join(" ")}
                onClick={() => { setActiveSectionId(s.id); setSelectedInstanceId(null); setRightTab("components"); }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span>
                  {s.sectionHeader || s.sectionName || "Untitled"}
                  {s.templateName && <span className={ui.badge} style={{ marginLeft: 6, fontSize: 9 }}>Template</span>}
                </span>
                <button
                  className={ui.iconBtnDanger}
                  style={{ width: 22, height: 22, flexShrink: 0 }}
                  onClick={(e) => { e.stopPropagation(); handleDeleteSection(s.id); }}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
            <button className={styles.addSectionBtn} onClick={() => setModal("new-section")}>
              <Plus size={13} style={{ verticalAlign: -2, marginRight: 4 }} /> Add Section
            </button>
          </>
        )}
      </aside>

      {/* CENTER: canvas */}
      <main className={styles.centerPanel}>
        {error && <p className={ui.errorMsg}>{error}</p>}

        {!selectedPageId ? (
          <div className={styles.emptyCanvas}>
            <Layout size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
            <span>Select a page to start building</span>
          </div>
        ) : !activeSection ? (
          <div className={styles.emptyCanvas}>
            <span>Select or add a section to start placing components</span>
          </div>
        ) : (
          <>
            <div className={styles.canvasHeader}>
              <h1 className={styles.canvasTitle}>{activeSection.sectionHeader}</h1>
              <div style={{ display: "flex", gap: 8 }}>
                <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={() => handleSaveAsTemplate(activeSection)}>
                  {activeSection.templateName ? "Update Template" : "Save as Template"}
                </button>
                <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={() => setModal("publish")} disabled={publishing}>
                  {publishing ? "Publishing…" : "Publish Page"}
                </button>
              </div>
            </div>

            <SectionCanvas
              canvasHeight={activeSection.canvasHeight || 480}
              instances={canvasInstances}
              selectedId={selectedInstanceId}
              onSelect={(id) => { setSelectedInstanceId(id || null); if (id) setRightTab("instance"); }}
              onChange={handleInstanceChange}
              onDelete={handleInstanceDelete}
            />
          </>
        )}
      </main>

      {/* RIGHT: palette / instance settings */}
      <aside className={styles.rightPanel}>
        <div className={styles.tabBar}>
          <button className={[styles.tab, rightTab === "components" ? styles.tabActive : ""].filter(Boolean).join(" ")} onClick={() => setRightTab("components")}>
            Components
          </button>
          <button className={[styles.tab, rightTab === "instance" ? styles.tabActive : ""].filter(Boolean).join(" ")} onClick={() => setRightTab("instance")} disabled={!selectedInstance}>
            Selected
          </button>
        </div>

        {rightTab === "components" && (
          <div className={styles.rightContent}>
            {!activeSectionId ? (
              <p style={{ fontSize: 12, color: "#999" }}>Select a section first.</p>
            ) : (
              <>
                {library.map((component: any) => (
                  <div key={component.id} className={styles.componentCard} onClick={() => handleAddComponentToSection(component)}>
                    <p className={styles.componentName}>{component.displayName}</p>
                    <p style={{ fontSize: 11, color: "#bbb", margin: "0 0 8px" }}>{component.category}</p>
                    <button className={`${ui.btn} ${ui.btnSecondary}`} style={{ fontSize: 11, padding: "4px 10px" }}>
                      + Add to Section
                    </button>
                  </div>
                ))}
                {templates.length > 0 && (
                  <>
                    <hr style={{ margin: "20px 0", borderColor: "#eee" }} />
                    <div className={styles.panelHeader} style={{ padding: "0 0 12px" }}>Section Templates</div>
                    {templates.map((t: any) => (
                      <div key={t.id} className={styles.componentCard}>
                        <p className={styles.componentName}>{t.templateName}</p>
                        <p style={{ fontSize: 11, color: "#bbb", margin: "0 0 8px" }}>From: {t.pageName}</p>
                        <button className={`${ui.btn} ${ui.btnSecondary}`} style={{ fontSize: 11, padding: "4px 10px" }} disabled={!selectedPageId} onClick={() => handleUseTemplate(t)}>
                          Use Template
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {rightTab === "instance" && (
          <div className={styles.rightContent}>
            {!selectedInstance ? (
              <p style={{ fontSize: 13, color: "#bbb", fontStyle: "italic" }}>Click a component on the canvas to edit it.</p>
            ) : (
              <>
                <p className={styles.componentName} style={{ marginBottom: 12 }}>
                  {selectedInstanceComponent?.displayName || selectedInstance.componentName}
                </p>
                {(selectedInstanceComponent?.propSchema || []).length === 0 && (
                  <p style={{ fontSize: 12, color: "#999" }}>
                    This component has no configurable props defined in the Component Library yet.
                  </p>
                )}
                {(selectedInstanceComponent?.propSchema || []).map((p: any) => {
                  const isBound = !!selectedInstance.dataBindings?.[p.name];
                  return (
                    <div key={p.name} className={styles.settingField}>
                      <label className={styles.settingLabel}>{p.label || p.name}</label>

                      {p.bindable && (
                        <div style={{ marginBottom: 6 }}>
                          <DataBindingSelect
                            value={(selectedInstance.dataBindings?.[p.name] as DataBindingValue) || null}
                            onChange={(v) => updateInstanceProp(p.name, v, true)}
                          />
                        </div>
                      )}

                      {!isBound && (
                        p.type === "boolean" ? (
                          <label className={ui.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={!!selectedInstance.propsOverride?.[p.name]}
                              onChange={(e) => updateInstanceProp(p.name, e.target.checked, false)}
                            />
                            {" "}enabled
                          </label>
                        ) : p.type === "richtext" ? (
                          <textarea
                            className={ui.textarea}
                            rows={3}
                            value={selectedInstance.propsOverride?.[p.name] ?? ""}
                            onChange={(e) => updateInstanceProp(p.name, e.target.value, false)}
                          />
                        ) : (
                          <input
                            className={ui.input}
                            type={p.type === "number" ? "number" : "text"}
                            value={selectedInstance.propsOverride?.[p.name] ?? ""}
                            onChange={(e) => updateInstanceProp(p.name, p.type === "number" ? Number(e.target.value) : e.target.value, false)}
                            placeholder={p.placeholder ? String(p.placeholder) : ""}
                          />
                        )
                      )}
                    </div>
                  );
                })}

                <button className={`${ui.btn} ${ui.btnDanger}`} style={{ width: "100%", marginTop: 16 }} onClick={() => handleInstanceDelete(selectedInstance.id)}>
                  Remove from Section
                </button>
              </>
            )}
          </div>
        )}
      </aside>

      {/* NEW SECTION MODAL */}
      {modal === "new-section" && (
        <div className={ui.overlay} onClick={() => setModal(null)}>
          <div className={ui.modal} onClick={(e) => e.stopPropagation()}>
            <div className={ui.modalHeader}>
              <span className={ui.modalTitle}>New Section</span>
              <button className={ui.modalClose} onClick={() => setModal(null)}>×</button>
            </div>
            <div className={ui.modalBody}>
              <div className={ui.field}>
                <label className={ui.label}>Section Header</label>
                <input className={ui.input} value={newSectionHeader} onChange={(e) => setNewSectionHeader(e.target.value)} placeholder="e.g. Featured Products" />
              </div>
            </div>
            <div className={ui.modalFooter}>
              <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={() => setModal(null)}>Cancel</button>
              <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={handleAddSection}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* PUBLISH MODAL */}
      {modal === "publish" && (
        <div className={ui.overlay} onClick={() => !publishing && setModal(null)}>
          <div className={ui.modal} onClick={(e) => e.stopPropagation()}>
            <div className={ui.modalHeader}>
              <span className={ui.modalTitle}>Publish Page</span>
              <button className={ui.modalClose} onClick={() => !publishing && setModal(null)}>×</button>
            </div>
            <div className={ui.modalBody}>
              {!publishResult ? (
                <>
                  <p className={ui.confirmText}>
                    This bakes in current bound data and commits <code>{selectedPage?.name}</code> to
                    <strong> giftikabe/kekal_frontend</strong> as a real page file.
                  </p>
                  <p className={ui.confirmSub}>Deployment triggers automatically, live in ~30–90 seconds.</p>
                </>
              ) : publishResult.error || !publishResult.success ? (
                <p className={ui.errorMsg}>{publishResult.error || "Publish failed"}</p>
              ) : (
                <>
                  <p className={ui.confirmText}>✓ Published successfully!</p>
                  {publishResult.commit_url && (
                    <p className={ui.confirmSub}><a href={publishResult.commit_url} target="_blank" rel="noreferrer">View commit →</a></p>
                  )}
                </>
              )}
            </div>
            <div className={ui.modalFooter}>
              {!publishResult ? (
                <>
                  <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={() => setModal(null)} disabled={publishing}>Cancel</button>
                  <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={handlePublish} disabled={publishing}>
                    {publishing ? "Publishing…" : "Publish Now"}
                  </button>
                </>
              ) : (
                <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={() => setModal(null)}>Close</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
