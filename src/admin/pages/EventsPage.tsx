/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { eventsApi, eventCategoriesApi, pagesApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import ImageUpload from "../components/ImageUpload";
import MultiImageUpload from "../components/MultiImageUpload";
import RichTextarea from "../components/RichTextarea";
import ui from "../components/ui.module.css";

interface EventCategory {
  id: string;
  name: string;
  slug: string;
}
interface Event {
  id: string;
  title: string;
  slug: string;
  intro: string;
  content: string;
  featuredImage: string;
  gallery: string[];
  videoUrl?: string;
  categoryId: string;
  category?: string;
  type: "event" | "community-impact";
  eventDate: string;
  location: string;
  organizer: string;
  featured: boolean;
}
interface Seo {
  id?: string;
  route: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  socialImage: string;
}

const EMPTY: Partial<Event> = {
  title: "",
  slug: "",
  intro: "",
  content: "",
  featuredImage: "",
  gallery: [],
  videoUrl: "",
  categoryId: "",
  type: "event",
  eventDate: "",
  location: "",
  organizer: "",
  featured: false,
};
const EMPTY_SEO: Seo = {
  route: "",
  metaTitle: "",
  metaDescription: "",
  keywords: [],
  socialImage: "",
};

export default function EventsPage() {
  const { hasPermission } = useAuthContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Event | null>(null);
  const [form, setForm] = useState<Partial<Event>>(EMPTY);
  const [seoForm, setSeoForm] = useState<Seo>(EMPTY_SEO);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "seo">("details");

  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);

  const canEdit = hasPermission("events", "update");

  const load = async () => {
    try {
      setLoading(true);
      const [e, c] = await Promise.all([
        eventsApi.getAll(),
        eventCategoriesApi.getAll(),
      ]);
      setEvents(e as Event[]);
      setCategories(c as EventCategory[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = filterType
    ? events.filter((e) => e.type === filterType)
    : events;

  const openCreate = () => {
    setForm(EMPTY);
    setSeoForm(EMPTY_SEO);
    setActiveTab("details");
    setShowNewCategory(false);
    setModal("create");
  };

  const openEdit = async (e: Event) => {
    if (!canEdit) return;
    setSelected(e);
    setForm(e);
    setActiveTab("details");
    setShowNewCategory(false);
    const route = `/events/${e.slug}`;
    try {
      const allSeo = (await pagesApi.getSeo()) as Seo[];
      const existing = allSeo.find((s) => s.route === route);
      setSeoForm(
        existing || {
          route,
          metaTitle: e.title,
          metaDescription: e.intro,
          keywords: [],
          socialImage: e.featuredImage,
        },
      );
    } catch {
      setSeoForm({
        route,
        metaTitle: e.title,
        metaDescription: e.intro,
        keywords: [],
        socialImage: e.featuredImage,
      });
    }
    setModal("edit");
  };

  const openDelete = (e: Event) => {
    setSelected(e);
    setModal("delete");
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setForm(EMPTY);
    setSeoForm(EMPTY_SEO);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    try {
      const result = (await eventCategoriesApi.create({
        name: newCategoryName.trim(),
      })) as EventCategory;
      setCategories([...categories, result]);
      set("categoryId", result.id);
      setNewCategoryName("");
      setShowNewCategory(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAddingCategory(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const slug =
        form.slug || form.title?.toLowerCase().replace(/\s+/g, "-") || "";
      if (modal === "create") {
        await eventsApi.create({ ...form, slug });
        if (seoForm.metaTitle)
          await pagesApi.createSeo({ ...seoForm, route: `/events/${slug}` });
      } else if (modal === "edit" && selected) {
        await eventsApi.update(selected.id, form);
        if (seoForm.id) await pagesApi.updateSeo(seoForm.id, seoForm);
        else if (seoForm.metaTitle) await pagesApi.createSeo(seoForm);
      }
      await load();
      closeModal();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await eventsApi.delete(selected.id);
      await load();
      closeModal();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof Event, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <div className={ui.pageHeader}>
        <div>
          <div className={ui.pageTitle}>Events</div>
          <div className={ui.pageCount}>{filtered.length} total</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select
            className={ui.select}
            style={{ width: 160 }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="event">Event</option>
            <option value="community-impact">Community Impact</option>
          </select>
          {hasPermission("events", "create") && (
            <button
              className={`${ui.btn} ${ui.btnPrimary}`}
              onClick={openCreate}
            >
              + New Event
            </button>
          )}
        </div>
      </div>

      {error && <div className={ui.errorMsg}>{error}</div>}

      {loading ? (
        <div className={ui.loading}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className={ui.empty}>
          <div className={ui.emptyIcon}>◷</div>No events yet.
        </div>
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Date</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr
                  key={e.id}
                  className={canEdit ? ui.tableRowClickable : ""}
                  onClick={() => openEdit(e)}
                >
                  <td>
                    {e.featuredImage ? (
                      <img
                        src={e.featuredImage}
                        alt={e.title}
                        className={ui.imagePreview}
                      />
                    ) : (
                      <div className={ui.noImage}>No img</div>
                    )}
                  </td>
                  <td>
                    <strong>{e.title}</strong>
                  </td>
                  <td>
                    <span className={`${ui.badge} ${ui.badgeGray}`}>
                      {e.category ||
                        categories.find((c) => c.id === e.categoryId)?.name ||
                        "—"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${ui.badge} ${e.type === "community-impact" ? ui.badgeGreen : ui.badgeBlack}`}
                    >
                      {e.type}
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>{e.eventDate}</td>
                  <td style={{ fontSize: 12, color: "#666" }}>{e.location}</td>
                  <td onClick={(ev) => ev.stopPropagation()}>
                    <div className={ui.actions}>
                      {canEdit && (
                        <button
                          className={ui.iconBtn}
                          onClick={() => openEdit(e)}
                          aria-label="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      {hasPermission("events", "delete") && (
                        <button
                          className={`${ui.iconBtn} ${ui.iconBtnDanger}`}
                          onClick={() => openDelete(e)}
                          aria-label="Delete"
                        >
                          <Trash2 size={14} />
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

      {(modal === "create" || modal === "edit") && (
        <div className={ui.overlay}>
          <div className={ui.modal} style={{ maxWidth: 640 }}>
            <div className={ui.modalHeader}>
              <div className={ui.modalTitle}>
                {modal === "create" ? "New Event" : "Edit Event"}
              </div>
              <button className={ui.modalClose} onClick={closeModal}>
                ✕
              </button>
            </div>
            <div
              className={ui.tabs}
              style={{ padding: "0 24px", borderBottom: "1px solid #eee" }}
            >
              <button
                className={`${ui.tab} ${activeTab === "details" ? ui.tabActive : ""}`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={`${ui.tab} ${activeTab === "seo" ? ui.tabActive : ""}`}
                onClick={() => setActiveTab("seo")}
              >
                SEO
              </button>
            </div>
            <div className={ui.modalBody}>
              {activeTab === "details" && (
                <div className={ui.form}>
                  <div className={ui.fieldRow}>
                    <div className={ui.field}>
                      <label className={ui.label}>Title *</label>
                      <input
                        className={ui.input}
                        value={form.title || ""}
                        onChange={(e) => set("title", e.target.value)}
                        placeholder="e.g. Autumn Pop-Up Bazaar"
                      />
                    </div>
                    <div className={ui.field}>
                      <label className={ui.label}>Slug</label>
                      <input
                        className={ui.input}
                        value={form.slug || ""}
                        onChange={(e) => set("slug", e.target.value)}
                        placeholder="auto-generated"
                      />
                    </div>
                  </div>
                  <div className={ui.field}>
                    <label className={ui.label}>Intro *</label>
                    <RichTextarea
                      value={form.intro || ""}
                      onChange={(v) => set("intro", v)}
                      minHeight={80}
                    />
                  </div>
                  <div className={ui.field}>
                    <label className={ui.label}>Content *</label>
                    <RichTextarea
                      value={form.content || ""}
                      onChange={(v) => set("content", v)}
                    />
                  </div>
                  <ImageUpload
                    label="Featured Image *"
                    value={form.featuredImage || ""}
                    onChange={(url) => set("featuredImage", url)}
                  />
                  <MultiImageUpload
                    label="Gallery Images"
                    value={form.gallery || []}
                    onChange={(urls) => set("gallery", urls)}
                  />
                  <div className={ui.field}>
                    <label className={ui.label}>Video URL</label>
                    <input
                      className={ui.input}
                      value={form.videoUrl || ""}
                      onChange={(e) => set("videoUrl", e.target.value)}
                      placeholder="https://youtube.com/embed/..."
                    />
                  </div>
                  <div className={ui.fieldRow}>
                    <div className={ui.field}>
                      <label className={ui.label}>Category *</label>
                      {!showNewCategory ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <select
                            className={ui.select}
                            value={form.categoryId || ""}
                            onChange={(e) => set("categoryId", e.target.value)}
                          >
                            <option value="">Select category</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className={ui.iconBtn}
                            onClick={() => setShowNewCategory(true)}
                            aria-label="Add new category"
                            title="Add new category"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 6 }}>
                          <input
                            className={ui.input}
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="New category name"
                            autoFocus
                          />
                          <button
                            type="button"
                            className={`${ui.btn} ${ui.btnPrimary}`}
                            style={{ padding: "8px 14px", fontSize: 11 }}
                            onClick={handleAddCategory}
                            disabled={addingCategory}
                          >
                            {addingCategory ? "..." : "Add"}
                          </button>
                          <button
                            type="button"
                            className={`${ui.btn} ${ui.btnSecondary}`}
                            style={{ padding: "8px 14px", fontSize: 11 }}
                            onClick={() => {
                              setShowNewCategory(false);
                              setNewCategoryName("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    <div className={ui.field}>
                      <label className={ui.label}>Type *</label>
                      <select
                        className={ui.select}
                        value={form.type || "event"}
                        onChange={(e) => set("type", e.target.value)}
                      >
                        <option value="event">Event</option>
                        <option value="community-impact">
                          Community Impact
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className={ui.fieldRow}>
                    <div className={ui.field}>
                      <label className={ui.label}>Event Date *</label>
                      <input
                        className={ui.input}
                        type="date"
                        value={form.eventDate || ""}
                        onChange={(e) => set("eventDate", e.target.value)}
                      />
                    </div>
                    <div className={ui.field}>
                      <label className={ui.label}>Location *</label>
                      <input
                        className={ui.input}
                        value={form.location || ""}
                        onChange={(e) => set("location", e.target.value)}
                        placeholder="e.g. Addis Ababa Exhibition Hall"
                      />
                    </div>
                  </div>
                  <div className={ui.field}>
                    <label className={ui.label}>Organizer *</label>
                    <input
                      className={ui.input}
                      value={form.organizer || ""}
                      onChange={(e) => set("organizer", e.target.value)}
                      placeholder="e.g. KEKAL Studio"
                    />
                  </div>
                  <label className={ui.checkboxField}>
                    <input
                      type="checkbox"
                      checked={!!form.featured}
                      onChange={(e) => set("featured", e.target.checked)}
                    />
                    <span className={ui.checkboxLabel}>Featured</span>
                  </label>
                </div>
              )}
              {activeTab === "seo" && (
                <div className={ui.form}>
                  <div className={ui.field}>
                    <label className={ui.label}>Meta Title</label>
                    <input
                      className={ui.input}
                      value={seoForm.metaTitle}
                      onChange={(e) =>
                        setSeoForm({ ...seoForm, metaTitle: e.target.value })
                      }
                    />
                  </div>
                  <div className={ui.field}>
                    <label className={ui.label}>Meta Description</label>
                    <RichTextarea
                      value={seoForm.metaDescription}
                      onChange={(v) =>
                        setSeoForm({ ...seoForm, metaDescription: v })
                      }
                      minHeight={80}
                    />
                  </div>
                  <div className={ui.field}>
                    <label className={ui.label}>Keywords</label>
                    <input
                      className={ui.input}
                      value={seoForm.keywords?.join(", ") || ""}
                      onChange={(e) =>
                        setSeoForm({
                          ...seoForm,
                          keywords: e.target.value
                            .split(",")
                            .map((k) => k.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="keyword1, keyword2"
                    />
                  </div>
                  <ImageUpload
                    label="Social Image (defaults to featured image, then site logo, if left blank)"
                    value={seoForm.socialImage}
                    onChange={(url) =>
                      setSeoForm({ ...seoForm, socialImage: url })
                    }
                  />
                </div>
              )}
            </div>
            <div className={ui.modalFooter}>
              <button
                className={`${ui.btn} ${ui.btnSecondary}`}
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className={`${ui.btn} ${ui.btnPrimary}`}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "delete" && selected && (
        <div className={ui.overlay}>
          <div className={ui.modal}>
            <div className={ui.modalHeader}>
              <div className={ui.modalTitle}>Delete Event</div>
              <button className={ui.modalClose} onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className={ui.modalBody}>
              <div className={ui.confirmText}>
                Delete <strong>{selected.title}</strong>?
              </div>
              <div className={ui.confirmSub}>This cannot be undone.</div>
            </div>
            <div className={ui.modalFooter}>
              <button
                className={`${ui.btn} ${ui.btnSecondary}`}
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className={`${ui.btn} ${ui.btnDanger}`}
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
