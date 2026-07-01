/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { collectionsApi, pagesApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import ImageUpload from "../components/ImageUpload";
import RichTextarea from "../components/RichTextarea";
import ui from "../components/ui.module.css";

interface Collection {
  id: string; name: string; slug: string; description: string;
  coverImage: string; releaseYear: number; createdAt: string;
  status: "current" | "archive"; inStock: boolean; featured: boolean;
}
interface Seo {
  id?: string; route: string; metaTitle: string; metaDescription: string;
  keywords: string[]; socialImage: string;
}

const EMPTY: Partial<Collection> = {
  name: "", slug: "", description: "", coverImage: "",
  releaseYear: new Date().getFullYear(),
  createdAt: new Date().toISOString().split("T")[0],
  status: "current", inStock: true, featured: false,
};
const EMPTY_SEO: Seo = { route: "", metaTitle: "", metaDescription: "", keywords: [], socialImage: "" };

export default function CollectionsPage() {
  const { hasPermission } = useAuthContext();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Collection | null>(null);
  const [form, setForm] = useState<Partial<Collection>>(EMPTY);
  const [seoForm, setSeoForm] = useState<Seo>(EMPTY_SEO);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "seo">("details");

  const load = async () => {
    try { setLoading(true); setCollections(await collectionsApi.getAll() as Collection[]); }
    catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(EMPTY); setSeoForm(EMPTY_SEO); setActiveTab("details"); setModal("create");
  };

  const openEdit = async (c: Collection) => {
    setSelected(c); setForm(c); setActiveTab("details");
    const route = `/collections/${c.slug}`;
    try {
      const allSeo = await pagesApi.getSeo() as Seo[];
      const existing = allSeo.find((s) => s.route === route);
      setSeoForm(existing || { route, metaTitle: c.name, metaDescription: c.description, keywords: [], socialImage: c.coverImage });
    } catch { setSeoForm({ route, metaTitle: c.name, metaDescription: c.description, keywords: [], socialImage: c.coverImage }); }
    setModal("edit");
  };

  const openDelete = (c: Collection) => { setSelected(c); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); setForm(EMPTY); setSeoForm(EMPTY_SEO); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const slug = form.slug || form.name?.toLowerCase().replace(/\s+/g, "-") || "";
      if (modal === "create") {
        await collectionsApi.create({ ...form, slug });
        // Create SEO entry
        if (seoForm.metaTitle) {
          await pagesApi.createSeo({ ...seoForm, route: `/collections/${slug}` });
        }
      } else if (modal === "edit" && selected) {
        await collectionsApi.update(selected.id, form);
        if (seoForm.id) await pagesApi.updateSeo(seoForm.id, seoForm);
        else if (seoForm.metaTitle) await pagesApi.createSeo(seoForm);
      }
      await load(); closeModal();
    } catch (e: any) { setError(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try { await collectionsApi.delete(selected.id); await load(); closeModal(); }
    catch (e: any) { setError(e.message); } finally { setSaving(false); }
  };

  const set = (key: keyof Collection, value: any) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <div className={ui.pageHeader}>
        <div>
          <div className={ui.pageTitle}>Collections</div>
          <div className={ui.pageCount}>{collections.length} total</div>
        </div>
        {hasPermission("collections", "create") && (
          <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={openCreate}>+ New Collection</button>
        )}
      </div>

      {error && <div className={ui.errorMsg}>{error}</div>}

      {loading ? <div className={ui.loading}>Loading...</div> : collections.length === 0 ? (
        <div className={ui.empty}><div className={ui.emptyIcon}>◫</div>No collections yet.</div>
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead><tr><th>Image</th><th>Name</th><th>Year</th><th>Status</th><th>Featured</th><th>In Stock</th><th>Actions</th></tr></thead>
            <tbody>
              {collections.map((c) => (
                <tr key={c.id}>
                  <td>{c.coverImage ? <img src={c.coverImage} alt={c.name} className={ui.imagePreview} /> : <div className={ui.noImage}>No img</div>}</td>
                  <td><strong>{c.name}</strong><div style={{ fontSize: 11, color: "#999" }}>{c.slug}</div></td>
                  <td>{c.releaseYear}</td>
                  <td><span className={`${ui.badge} ${c.status === "current" ? ui.badgeGreen : ui.badgeGray}`}>{c.status}</span></td>
                  <td><span className={`${ui.badge} ${c.featured ? ui.badgeBlack : ui.badgeGray}`}>{c.featured ? "Yes" : "No"}</span></td>
                  <td><span className={`${ui.badge} ${c.inStock ? ui.badgeGreen : ui.badgeRed}`}>{c.inStock ? "Yes" : "No"}</span></td>
                  <td>
                    <div className={ui.actions}>
                      {hasPermission("collections", "update") && <button className={ui.actionBtn} onClick={() => openEdit(c)}>Edit</button>}
                      {hasPermission("collections", "delete") && <button className={`${ui.actionBtn} ${ui.actionBtnDanger}`} onClick={() => openDelete(c)}>Delete</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(modal === "create" || modal === "edit") && (
        <div className={ui.overlay}>
          <div className={ui.modal} style={{ maxWidth: 640 }}>
            <div className={ui.modalHeader}>
              <div className={ui.modalTitle}>{modal === "create" ? "New Collection" : "Edit Collection"}</div>
              <button className={ui.modalClose} onClick={closeModal}>✕</button>
            </div>
            <div className={ui.tabs} style={{ padding: "0 24px", borderBottom: "1px solid #eee" }}>
              <button className={`${ui.tab} ${activeTab === "details" ? ui.tabActive : ""}`} onClick={() => setActiveTab("details")}>Details</button>
              <button className={`${ui.tab} ${activeTab === "seo" ? ui.tabActive : ""}`} onClick={() => setActiveTab("seo")}>SEO</button>
            </div>
            <div className={ui.modalBody}>
              {activeTab === "details" && (
                <div className={ui.form}>
                  <div className={ui.fieldRow}>
                    <div className={ui.field}>
                      <label className={ui.label}>Name *</label>
                      <input className={ui.input} value={form.name || ""} onChange={(e) => set("name", e.target.value)} />
                    </div>
                    <div className={ui.field}>
                      <label className={ui.label}>Slug</label>
                      <input className={ui.input} value={form.slug || ""} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" />
                    </div>
                  </div>
                  <div className={ui.field}>
                    <label className={ui.label}>Description *</label>
                    <RichTextarea value={form.description || ""} onChange={(v) => set("description", v)} />
                  </div>
                  <ImageUpload label="Cover Image" value={form.coverImage || ""} onChange={(url) => set("coverImage", url)} />
                  <div className={ui.fieldRow}>
                    <div className={ui.field}>
                      <label className={ui.label}>Release Year *</label>
                      <input className={ui.input} type="number" value={form.releaseYear || ""} onChange={(e) => set("releaseYear", parseInt(e.target.value))} />
                    </div>
                    <div className={ui.field}>
                      <label className={ui.label}>Status *</label>
                      <select className={ui.select} value={form.status || "current"} onChange={(e) => set("status", e.target.value)}>
                        <option value="current">Current</option>
                        <option value="archive">Archive</option>
                      </select>
                    </div>
                  </div>
                  <div className={ui.fieldRow}>
                    <label className={ui.checkboxField}><input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} /><span className={ui.checkboxLabel}>Featured</span></label>
                    <label className={ui.checkboxField}><input type="checkbox" checked={!!form.inStock} onChange={(e) => set("inStock", e.target.checked)} /><span className={ui.checkboxLabel}>In Stock</span></label>
                  </div>
                </div>
              )}
              {activeTab === "seo" && (
                <div className={ui.form}>
                  <div className={ui.field}>
                    <label className={ui.label}>Meta Title</label>
                    <input className={ui.input} value={seoForm.metaTitle} onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })} placeholder={form.name || "Collection name"} />
                  </div>
                  <div className={ui.field}>
                    <label className={ui.label}>Meta Description</label>
                    <RichTextarea value={seoForm.metaDescription} onChange={(v) => setSeoForm({ ...seoForm, metaDescription: v })} minHeight={80} />
                  </div>
                  <div className={ui.field}>
                    <label className={ui.label}>Keywords</label>
                    <input className={ui.input} value={seoForm.keywords?.join(", ") || ""} onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean) })} placeholder="keyword1, keyword2" />
                    <div className={ui.hint}>Comma-separated</div>
                  </div>
                  <ImageUpload label="Social Image" value={seoForm.socialImage} onChange={(url) => setSeoForm({ ...seoForm, socialImage: url })} />
                </div>
              )}
            </div>
            <div className={ui.modalFooter}>
              <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={closeModal}>Cancel</button>
              <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {modal === "delete" && selected && (
        <div className={ui.overlay}>
          <div className={ui.modal}>
            <div className={ui.modalHeader}><div className={ui.modalTitle}>Delete Collection</div><button className={ui.modalClose} onClick={closeModal}>✕</button></div>
            <div className={ui.modalBody}>
              <div className={ui.confirmText}>Delete <strong>{selected.name}</strong>?</div>
              <div className={ui.confirmSub}>This will also delete all products in this collection.</div>
            </div>
            <div className={ui.modalFooter}>
              <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={closeModal}>Cancel</button>
              <button className={`${ui.btn} ${ui.btnDanger}`} onClick={handleDelete} disabled={saving}>{saving ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
