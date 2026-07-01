/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { pagesApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import DragList from "../components/DragList";
import RichTextarea from "../components/RichTextarea";
import ui from "../components/ui.module.css";

type Tab = "pages" | "seo" | "navigation";

interface Page { id: string; name: string; route: string; }
interface PageSection { id: string; pageId: string; sectionName: string; sectionHeader: string; buttonLabels: string[]; }
interface PageSeo { id: string; route: string; metaTitle: string; metaDescription: string; keywords: string[]; socialImage: string; }
interface NavItem { id: string; label: string; href: string; order: number; }

export default function PagesPage() {
  const { hasPermission } = useAuthContext();
  const [tab, setTab] = useState<Tab>("pages");
  const [pages, setPages] = useState<Page[]>([]);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [seo, setSeo] = useState<PageSeo[]>([]);
  const [nav, setNav] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  // Nav modal
  const [navModal, setNavModal] = useState<"create" | "edit" | "delete" | null>(null);
  const [selectedNav, setSelectedNav] = useState<NavItem | null>(null);
  const [navForm, setNavForm] = useState<Partial<NavItem>>({ label: "", href: "", order: 0 });
  const [navSaving, setNavSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [p, s, se, n] = await Promise.all([
          pagesApi.getAll(), pagesApi.getSections(), pagesApi.getSeo(), pagesApi.getNavigation(),
        ]);
        setPages(p as Page[]); setSections(s as PageSection[]);
        setSeo(se as PageSeo[]); setNav((n as NavItem[]).sort((a, b) => a.order - b.order));
      } catch (e: any) { setError(e.message); } finally { setLoading(false); }
    };
    load();
  }, []);

  const showSaved = (id: string) => { setSaved(id); setTimeout(() => setSaved(null), 2000); };

  const updateSection = async (id: string, field: string, value: any) => {
    setSaving(id + field);
    try {
      await pagesApi.updateSection(id, { [field]: value });
      setSections(sections.map((s) => s.id === id ? { ...s, [field]: value } : s));
      showSaved(id + field);
    } catch (e: any) { setError(e.message); } finally { setSaving(null); }
  };

  const updateSeo = async (id: string, field: string, value: any) => {
    setSaving(id + field);
    try {
      await pagesApi.updateSeo(id, { [field]: value });
      setSeo(seo.map((s) => s.id === id ? { ...s, [field]: value } : s));
      showSaved(id + field);
    } catch (e: any) { setError(e.message); } finally { setSaving(null); }
  };

  // Nav reorder — update order field for each item
  const handleNavReorder = async (reordered: NavItem[]) => {
    const updated = reordered.map((item, index) => ({ ...item, order: index + 1 }));
    setNav(updated);
    try {
      await Promise.all(updated.map((item) => pagesApi.updateNavigation(item.id, { order: item.order })));
    } catch (e: any) { setError(e.message); }
  };

  const handleNavSave = async () => {
    setNavSaving(true);
    try {
      if (navModal === "create") {
        const result = await pagesApi.createNavigation({ ...navForm, order: nav.length + 1 }) as NavItem;
        setNav([...nav, result]);
      } else if (navModal === "edit" && selectedNav) {
        await pagesApi.updateNavigation(selectedNav.id, navForm);
        setNav(nav.map((n) => n.id === selectedNav.id ? { ...n, ...navForm } as NavItem : n));
      }
      setNavModal(null); setSelectedNav(null); setNavForm({ label: "", href: "", order: 0 });
    } catch (e: any) { setError(e.message); } finally { setNavSaving(false); }
  };

  const handleNavDelete = async () => {
    if (!selectedNav) return;
    setNavSaving(true);
    try {
      await pagesApi.deleteNavigation(selectedNav.id);
      setNav(nav.filter((n) => n.id !== selectedNav.id));
      setNavModal(null); setSelectedNav(null);
    } catch (e: any) { setError(e.message); } finally { setNavSaving(false); }
  };

  const canEdit = hasPermission("pages", "update");

  const TABS = [
    { key: "pages" as Tab, label: "Pages & Sections" },
    { key: "seo" as Tab, label: "SEO" },
    { key: "navigation" as Tab, label: "Navigation" },
  ];

  return (
    <div>
      <div className={ui.pageHeader}><div className={ui.pageTitle}>Pages & SEO</div></div>
      {error && <div className={ui.errorMsg}>{error}</div>}

      <div className={ui.tabs}>
        {TABS.map((t) => (
          <button key={t.key} className={`${ui.tab} ${tab === t.key ? ui.tabActive : ""}`} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {loading ? <div className={ui.loading}>Loading...</div> : (
        <>
          {/* ─── Pages & Sections ─── */}
          {tab === "pages" && (
            <div>
              {pages.map((page) => {
                const pageSections = sections.filter((s) => s.pageId === page.id);
                return (
                  <div key={page.id} className={ui.card} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <div>
                        <div className={ui.cardTitle} style={{ margin: 0 }}>{page.name}</div>
                        <div style={{ fontFamily: "monospace", fontSize: 11, color: "#999", marginTop: 2 }}>{page.route}</div>
                      </div>
                    </div>
                    {pageSections.length > 0 ? (
                      <div className={ui.tableWrap}>
                        <table className={ui.table}>
                          <thead><tr><th>Section</th><th>Header</th><th>Button Labels</th></tr></thead>
                          <tbody>
                            {pageSections.map((s) => (
                              <SectionRow key={s.id} section={s} canEdit={canEdit} saving={saving} saved={saved} onUpdate={updateSection} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: "#ccc", fontStyle: "italic" }}>No sections</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ─── SEO ─── */}
          {tab === "seo" && (
            <div>
              {seo.map((s) => (
                <SeoCard key={s.id} item={s} canEdit={canEdit} saving={saving} saved={saved} onUpdate={updateSeo} />
              ))}
            </div>
          )}

          {/* ─── Navigation with drag reorder ─── */}
          {tab === "navigation" && (
            <div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                {hasPermission("pages", "create") && (
                  <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={() => { setNavForm({ label: "", href: "", order: nav.length + 1 }); setNavModal("create"); }}>
                    + Add Nav Item
                  </button>
                )}
              </div>

              <DragList
                items={nav}
                onReorder={handleNavReorder}
                disabled={!canEdit}
                renderItem={(n) => (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <span style={{ fontSize: 11, color: "#ccc", width: 20 }}>{n.order}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{n.label}</div>
                        <div style={{ fontFamily: "monospace", fontSize: 11, color: "#999" }}>{n.href}</div>
                      </div>
                    </div>
                    <div className={ui.actions}>
                      {canEdit && <button className={ui.actionBtn} onClick={() => { setSelectedNav(n); setNavForm(n); setNavModal("edit"); }}>Edit</button>}
                      {hasPermission("pages", "delete") && <button className={`${ui.actionBtn} ${ui.actionBtnDanger}`} onClick={() => { setSelectedNav(n); setNavModal("delete"); }}>Delete</button>}
                    </div>
                  </div>
                )}
              />

              {(navModal === "create" || navModal === "edit") && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}><div className={ui.modalTitle}>{navModal === "create" ? "Add Nav Item" : "Edit Nav Item"}</div><button className={ui.modalClose} onClick={() => setNavModal(null)}>✕</button></div>
                    <div className={ui.modalBody}>
                      <div className={ui.form}>
                        <div className={ui.field}><label className={ui.label}>Label *</label><input className={ui.input} value={navForm.label || ""} onChange={(e) => setNavForm({ ...navForm, label: e.target.value })} /></div>
                        <div className={ui.field}><label className={ui.label}>Link (href) *</label><input className={ui.input} value={navForm.href || ""} onChange={(e) => setNavForm({ ...navForm, href: e.target.value })} placeholder="/collections" /></div>
                        <div className={ui.field}><label className={ui.label}>Order</label><input className={ui.input} type="number" value={navForm.order || 0} onChange={(e) => setNavForm({ ...navForm, order: parseInt(e.target.value) })} /></div>
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={() => setNavModal(null)}>Cancel</button>
                      <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={handleNavSave} disabled={navSaving}>{navSaving ? "Saving..." : "Save"}</button>
                    </div>
                  </div>
                </div>
              )}

              {navModal === "delete" && selectedNav && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}><div className={ui.modalTitle}>Delete Nav Item</div><button className={ui.modalClose} onClick={() => setNavModal(null)}>✕</button></div>
                    <div className={ui.modalBody}><div className={ui.confirmText}>Delete <strong>{selectedNav.label}</strong>?</div></div>
                    <div className={ui.modalFooter}>
                      <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={() => setNavModal(null)}>Cancel</button>
                      <button className={`${ui.btn} ${ui.btnDanger}`} onClick={handleNavDelete} disabled={navSaving}>Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Section row ──────────────────────────────────────────────────────────────
function SectionRow({ section, canEdit, saving, saved, onUpdate }: {
  section: PageSection; canEdit: boolean; saving: string | null; saved: string | null;
  onUpdate: (id: string, field: string, value: any) => void;
}) {
  const [header, setHeader] = useState(section.sectionHeader);
  const [buttons, setButtons] = useState(section.buttonLabels?.join(", ") || "");
  const headerChanged = header !== section.sectionHeader;
  const buttonsChanged = buttons !== (section.buttonLabels?.join(", ") || "");

  return (
    <tr>
      <td style={{ fontFamily: "monospace", fontSize: 11, color: "#999", whiteSpace: "nowrap" }}>{section.sectionName}</td>
      <td>
        {canEdit ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input className={ui.input} style={{ fontSize: 12, padding: "6px 8px" }} value={header} onChange={(e) => setHeader(e.target.value)} />
            <button className={`${ui.btn} ${ui.btnPrimary}`} style={{ padding: "6px 10px", fontSize: 10, opacity: headerChanged ? 1 : 0.3 }} disabled={!headerChanged || saving === section.id + "sectionHeader"} onClick={() => onUpdate(section.id, "sectionHeader", header)}>
              {saved === section.id + "sectionHeader" ? "✓" : "Save"}
            </button>
          </div>
        ) : <span style={{ fontSize: 13 }}>{section.sectionHeader}</span>}
      </td>
      <td>
        {canEdit ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input className={ui.input} style={{ fontSize: 12, padding: "6px 8px" }} value={buttons} onChange={(e) => setButtons(e.target.value)} placeholder="Button 1, Button 2" />
            <button className={`${ui.btn} ${ui.btnPrimary}`} style={{ padding: "6px 10px", fontSize: 10, opacity: buttonsChanged ? 1 : 0.3 }} disabled={!buttonsChanged || saving === section.id + "buttonLabels"} onClick={() => onUpdate(section.id, "buttonLabels", buttons.split(",").map((b) => b.trim()).filter(Boolean))}>
              {saved === section.id + "buttonLabels" ? "✓" : "Save"}
            </button>
          </div>
        ) : <span style={{ fontSize: 12, color: "#666" }}>{section.buttonLabels?.join(", ")}</span>}
      </td>
    </tr>
  );
}

// ─── SEO card ─────────────────────────────────────────────────────────────────
function SeoCard({ item, canEdit, saving, saved, onUpdate }: {
  item: PageSeo; canEdit: boolean; saving: string | null; saved: string | null;
  onUpdate: (id: string, field: string, value: any) => void;
}) {
  const [metaTitle, setMetaTitle] = useState(item.metaTitle);
  const [metaDesc, setMetaDesc] = useState(item.metaDescription);
  const [keywords, setKeywords] = useState(item.keywords?.join(", ") || "");
  const [socialImage, setSocialImage] = useState(item.socialImage);

  return (
    <div className={ui.card}>
      <div className={ui.cardTitle} style={{ fontFamily: "monospace", fontSize: 11 }}>{item.route}</div>
      <div className={ui.form}>
        <InlineSave label="Meta Title" value={metaTitle} onChange={setMetaTitle} original={item.metaTitle} onSave={() => onUpdate(item.id, "metaTitle", metaTitle)} id={item.id + "metaTitle"} saving={saving} saved={saved} canEdit={canEdit} />
        <InlineSaveRich label="Meta Description" value={metaDesc} onChange={setMetaDesc} original={item.metaDescription} onSave={() => onUpdate(item.id, "metaDescription", metaDesc)} id={item.id + "metaDescription"} saving={saving} saved={saved} canEdit={canEdit} />
        <InlineSave label="Keywords (comma-separated)" value={keywords} onChange={setKeywords} original={item.keywords?.join(", ") || ""} onSave={() => onUpdate(item.id, "keywords", keywords.split(",").map((k) => k.trim()).filter(Boolean))} id={item.id + "keywords"} saving={saving} saved={saved} canEdit={canEdit} />
        <InlineSave label="Social Image URL" value={socialImage} onChange={setSocialImage} original={item.socialImage} onSave={() => onUpdate(item.id, "socialImage", socialImage)} id={item.id + "socialImage"} saving={saving} saved={saved} canEdit={canEdit} />
      </div>
    </div>
  );
}

function InlineSave({ label, value, onChange, original, onSave, id, saving, saved, canEdit }: {
  label: string; value: string; onChange: (v: string) => void; original: string;
  onSave: () => void; id: string; saving: string | null; saved: string | null; canEdit: boolean;
}) {
  const changed = value !== original;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <div className={ui.field} style={{ flex: 1 }}>
        <label className={ui.label}>{label}</label>
        <input className={ui.input} value={value} onChange={(e) => onChange(e.target.value)} disabled={!canEdit} />
      </div>
      {canEdit && (
        <div style={{ paddingTop: 22 }}>
          <button className={`${ui.btn} ${ui.btnPrimary}`} style={{ padding: "8px 14px", fontSize: 11, opacity: changed ? 1 : 0.3 }} disabled={!changed || saving === id} onClick={onSave}>
            {saving === id ? "..." : saved === id ? "✓" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}

function InlineSaveRich({ label, value, onChange, original, onSave, id, saving, saved, canEdit }: {
  label: string; value: string; onChange: (v: string) => void; original: string;
  onSave: () => void; id: string; saving: string | null; saved: string | null; canEdit: boolean;
}) {
  const changed = value !== original;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <div className={ui.field} style={{ flex: 1 }}>
        <label className={ui.label}>{label}</label>
        <RichTextarea value={value} onChange={onChange} disabled={!canEdit} minHeight={70} />
      </div>
      {canEdit && (
        <div style={{ paddingTop: 22 }}>
          <button className={`${ui.btn} ${ui.btnPrimary}`} style={{ padding: "8px 14px", fontSize: 11, opacity: changed ? 1 : 0.3 }} disabled={!changed || saving === id} onClick={onSave}>
            {saving === id ? "..." : saved === id ? "✓" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}
