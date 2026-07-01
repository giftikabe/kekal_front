/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { upcomingEventsApi, pagesApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import ImageUpload from "../components/ImageUpload";
import RichTextarea from "../components/RichTextarea";
import ui from "../components/ui.module.css";

interface UpcomingEvent {
  id: string; title: string; slug: string; intro: string; content: string;
  featuredImage: string; category: string; eventDate: string;
  location: string; organizer: string; registrationUrl?: string;
  ctaText: string; featured: boolean;
}
interface Seo { id?: string; route: string; metaTitle: string; metaDescription: string; keywords: string[]; socialImage: string; }

const CATEGORIES = ["exhibition", "bazaar", "workshop", "talk", "collaboration", "other"];
const EMPTY: Partial<UpcomingEvent> = {
  title: "", slug: "", intro: "", content: "", featuredImage: "",
  category: "exhibition", eventDate: "", location: "", organizer: "",
  registrationUrl: "", ctaText: "Register Now", featured: false,
};
const EMPTY_SEO: Seo = { route: "", metaTitle: "", metaDescription: "", keywords: [], socialImage: "" };

export default function UpcomingEventsPage() {
  const { hasPermission } = useAuthContext();
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<UpcomingEvent | null>(null);
  const [form, setForm] = useState<Partial<UpcomingEvent>>(EMPTY);
  const [seoForm, setSeoForm] = useState<Seo>(EMPTY_SEO);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "seo">("details");

  const load = async () => {
    try { setLoading(true); setEvents(await upcomingEventsApi.getAll() as UpcomingEvent[]); }
    catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setSeoForm(EMPTY_SEO); setActiveTab("details"); setModal("create"); };

  const openEdit = async (e: UpcomingEvent) => {
    setSelected(e); setForm(e); setActiveTab("details");
    const route = `/events/${e.slug}`;
    try {
      const allSeo = await pagesApi.getSeo() as Seo[];
      const existing = allSeo.find((s) => s.route === route);
      setSeoForm(existing || { route, metaTitle: e.title, metaDescription: e.intro, keywords: [], socialImage: e.featuredImage });
    } catch { setSeoForm({ route, metaTitle: e.title, metaDescription: e.intro, keywords: [], socialImage: e.featuredImage }); }
    setModal("edit");
  };

  const openDelete = (e: UpcomingEvent) => { setSelected(e); setModal("delete"); };
  const closeModal = () => { setModal(null); setSelected(null); setForm(EMPTY); setSeoForm(EMPTY_SEO); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const slug = form.slug || form.title?.toLowerCase().replace(/\s+/g, "-") || "";
      if (modal === "create") {
        await upcomingEventsApi.create({ ...form, slug });
        if (seoForm.metaTitle) await pagesApi.createSeo({ ...seoForm, route: `/events/${slug}` });
      } else if (modal === "edit" && selected) {
        await upcomingEventsApi.update(selected.id, form);
        if (seoForm.id) await pagesApi.updateSeo(seoForm.id, seoForm);
        else if (seoForm.metaTitle) await pagesApi.createSeo(seoForm);
      }
      await load(); closeModal();
    } catch (e: any) { setError(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try { await upcomingEventsApi.delete(selected.id); await load(); closeModal(); }
    catch (e: any) { setError(e.message); } finally { setSaving(false); }
  };

  const set = (key: keyof UpcomingEvent, value: any) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <div className={ui.pageHeader}>
        <div><div className={ui.pageTitle}>Upcoming Events</div><div className={ui.pageCount}>{events.length} total</div></div>
        {hasPermission("upcoming_events", "create") && (
          <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={openCreate}>+ New Event</button>
        )}
      </div>

      {error && <div className={ui.errorMsg}>{error}</div>}

      {loading ? <div className={ui.loading}>Loading...</div> : events.length === 0 ? (
        <div className={ui.empty}><div className={ui.emptyIcon}>◈</div>No upcoming events yet.</div>
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Date</th><th>Location</th><th>CTA</th><th>Featured</th><th>Actions</th></tr></thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>{e.featuredImage ? <img src={e.featuredImage} alt={e.title} className={ui.imagePreview} /> : <div className={ui.noImage}>No img</div>}</td>
                  <td><strong>{e.title}</strong></td>
                  <td><span className={`${ui.badge} ${ui.badgeGray}`}>{e.category}</span></td>
                  <td style={{ fontSize: 12 }}>{e.eventDate}</td>
                  <td style={{ fontSize: 12, color: "#666" }}>{e.location}</td>
                  <td style={{ fontSize: 12 }}>{e.ctaText}</td>
                  <td><span className={`${ui.badge} ${e.featured ? ui.badgeBlack : ui.badgeGray}`}>{e.featured ? "Yes" : "No"}</span></td>
                  <td>
                    <div className={ui.actions}>
                      {hasPermission("upcoming_events", "update") && <button className={ui.actionBtn} onClick={() => openEdit(e)}>Edit</button>}
                      {hasPermission("upcoming_events", "delete") && <button className={`${ui.actionBtn} ${ui.actionBtnDanger}`} onClick={() => openDelete(e)}>Delete</button>}
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
              <div className={ui.modalTitle}>{modal === "create" ? "New Upcoming Event" : "Edit Upcoming Event"}</div>
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
                    <div className={ui.field}><label className={ui.label}>Title *</label><input className={ui.input} value={form.title || ""} onChange={(e) => set("title", e.target.value)} /></div>
                    <div className={ui.field}><label className={ui.label}>Slug</label><input className={ui.input} value={form.slug || ""} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" /></div>
                  </div>
                  <div className={ui.field}><label className={ui.label}>Intro *</label><RichTextarea value={form.intro || ""} onChange={(v) => set("intro", v)} minHeight={80} /></div>
                  <div className={ui.field}><label className={ui.label}>Content *</label><RichTextarea value={form.content || ""} onChange={(v) => set("content", v)} /></div>
                  <ImageUpload label="Featured Image" value={form.featuredImage || ""} onChange={(url) => set("featuredImage", url)} />
                  <div className={ui.fieldRow}>
                    <div className={ui.field}>
                      <label className={ui.label}>Category *</label>
                      <select className={ui.select} value={form.category || "exhibition"} onChange={(e) => set("category", e.target.value)}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className={ui.field}><label className={ui.label}>Event Date *</label><input className={ui.input} type="date" value={form.eventDate || ""} onChange={(e) => set("eventDate", e.target.value)} /></div>
                  </div>
                  <div className={ui.fieldRow}>
                    <div className={ui.field}><label className={ui.label}>Location *</label><input className={ui.input} value={form.location || ""} onChange={(e) => set("location", e.target.value)} /></div>
                    <div className={ui.field}><label className={ui.label}>Organizer *</label><input className={ui.input} value={form.organizer || ""} onChange={(e) => set("organizer", e.target.value)} /></div>
                  </div>
                  <div className={ui.fieldRow}>
                    <div className={ui.field}><label className={ui.label}>Registration URL</label><input className={ui.input} value={form.registrationUrl || ""} onChange={(e) => set("registrationUrl", e.target.value)} placeholder="https://..." /></div>
                    <div className={ui.field}><label className={ui.label}>CTA Text *</label><input className={ui.input} value={form.ctaText || ""} onChange={(e) => set("ctaText", e.target.value)} placeholder="Register Now" /></div>
                  </div>
                  <label className={ui.checkboxField}><input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} /><span className={ui.checkboxLabel}>Featured</span></label>
                </div>
              )}
              {activeTab === "seo" && (
                <div className={ui.form}>
                  <div className={ui.field}><label className={ui.label}>Meta Title</label><input className={ui.input} value={seoForm.metaTitle} onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })} /></div>
                  <div className={ui.field}><label className={ui.label}>Meta Description</label><RichTextarea value={seoForm.metaDescription} onChange={(v) => setSeoForm({ ...seoForm, metaDescription: v })} minHeight={80} /></div>
                  <div className={ui.field}><label className={ui.label}>Keywords</label><input className={ui.input} value={seoForm.keywords?.join(", ") || ""} onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean) })} placeholder="keyword1, keyword2" /></div>
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
            <div className={ui.modalHeader}><div className={ui.modalTitle}>Delete Upcoming Event</div><button className={ui.modalClose} onClick={closeModal}>✕</button></div>
            <div className={ui.modalBody}><div className={ui.confirmText}>Delete <strong>{selected.title}</strong>?</div><div className={ui.confirmSub}>This cannot be undone.</div></div>
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
