/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { productsApi, collectionsApi, pagesApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import ImageUpload from "../components/ImageUpload";
import MultiImageUpload from "../components/MultiImageUpload";
import ColorPicker from "../components/ColorPicker";
import SizeSelector from "../components/SizeSelector";
import RichTextarea from "../components/RichTextarea";
import ui from "../components/ui.module.css";

interface Product {
  id: string;
  collectionId: string;
  name: string;
  slug: string;
  description: string;
  mainImage: string;
  gallery: string[];
  colors: string[];
  sizes: string[];
  inStock: boolean;
  featured: boolean;
}
interface Collection {
  id: string;
  name: string;
}
interface Seo {
  id?: string;
  route: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  socialImage: string;
}

const EMPTY: Partial<Product> = {
  collectionId: "",
  name: "",
  slug: "",
  description: "",
  mainImage: "",
  gallery: [],
  colors: [],
  sizes: [],
  inStock: true,
  featured: false,
};
const EMPTY_SEO: Seo = {
  route: "",
  metaTitle: "",
  metaDescription: "",
  keywords: [],
  socialImage: "",
};

export default function ProductsPage() {
  const { hasPermission } = useAuthContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>(EMPTY);
  const [seoForm, setSeoForm] = useState<Seo>(EMPTY_SEO);
  const [saving, setSaving] = useState(false);
  const [filterCollection, setFilterCollection] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "media" | "seo">(
    "details",
  );

  const canEdit = hasPermission("products", "update");

  const load = async () => {
    try {
      setLoading(true);
      const [p, c] = await Promise.all([
        productsApi.getAll(),
        collectionsApi.getAll(),
      ]);
      setProducts(p as Product[]);
      setCollections(c as Collection[]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = filterCollection
    ? products.filter((p) => p.collectionId === filterCollection)
    : products;
  const getCollectionName = (id: string) =>
    collections.find((c) => c.id === id)?.name || id;

  const openCreate = () => {
    setForm(EMPTY);
    setSeoForm(EMPTY_SEO);
    setActiveTab("details");
    setModal("create");
  };

  const openEdit = async (p: Product) => {
    if (!canEdit) return;
    setSelected(p);
    setForm(p);
    setActiveTab("details");
    const col = collections.find((c) => c.id === p.collectionId);
    const route = `/collections/${col?.id || p.collectionId}/${p.slug}`;
    try {
      const allSeo = (await pagesApi.getSeo()) as Seo[];
      const existing = allSeo.find((s) => s.route === route);
      setSeoForm(
        existing || {
          route,
          metaTitle: p.name,
          metaDescription: p.description,
          keywords: [],
          socialImage: p.mainImage,
        },
      );
    } catch {
      setSeoForm({
        route,
        metaTitle: p.name,
        metaDescription: p.description,
        keywords: [],
        socialImage: p.mainImage,
      });
    }
    setModal("edit");
  };

  const openDelete = (p: Product) => {
    setSelected(p);
    setModal("delete");
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setForm(EMPTY);
    setSeoForm(EMPTY_SEO);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const slug =
        form.slug || form.name?.toLowerCase().replace(/\s+/g, "-") || "";
      if (modal === "create") {
        await productsApi.create({ ...form, slug });
        if (seoForm.metaTitle) await pagesApi.createSeo(seoForm);
      } else if (modal === "edit" && selected) {
        await productsApi.update(selected.id, form);
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
      await productsApi.delete(selected.id);
      await load();
      closeModal();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof Product, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <div className={ui.pageHeader}>
        <div>
          <div className={ui.pageTitle}>Products</div>
          <div className={ui.pageCount}>{filtered.length} total</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select
            className={ui.select}
            style={{ width: 180 }}
            value={filterCollection}
            onChange={(e) => setFilterCollection(e.target.value)}
            aria-label="Filter by collection"
          >
            <option value="">All Collections</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {hasPermission("products", "create") && (
            <button
              className={`${ui.btn} ${ui.btnPrimary}`}
              onClick={openCreate}
            >
              + New Product
            </button>
          )}
        </div>
      </div>

      {error && <div className={ui.errorMsg}>{error}</div>}

      {loading ? (
        <div className={ui.loading}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className={ui.empty}>
          <div className={ui.emptyIcon}>◻</div>No products yet.
        </div>
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Collection</th>
                <th>Colors</th>
                <th>Sizes</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className={canEdit ? ui.tableRowClickable : ""}
                  onClick={() => openEdit(p)}
                >
                  <td>
                    {p.mainImage ? (
                      <img
                        src={p.mainImage}
                        alt={p.name}
                        className={ui.imagePreview}
                      />
                    ) : (
                      <div className={ui.noImage}>No img</div>
                    )}
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    <div style={{ fontSize: 11, color: "#999" }}>{p.slug}</div>
                  </td>
                  <td style={{ fontSize: 12, color: "#666" }}>
                    {getCollectionName(p.collectionId)}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {p.colors?.map((color) => (
                        <span
                          key={color}
                          style={{
                            width: 16,
                            height: 16,
                            background: color,
                            border: "1px solid #eee",
                            display: "inline-block",
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: "#666" }}>
                    {p.sizes?.join(", ")}
                  </td>
                  <td>
                    <span
                      className={`${ui.badge} ${p.inStock ? ui.badgeGreen : ui.badgeRed}`}
                    >
                      {p.inStock ? "Yes" : "No"}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className={ui.actions}>
                      {canEdit && (
                        <button
                          className={ui.iconBtn}
                          onClick={() => openEdit(p)}
                          aria-label="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      {hasPermission("products", "delete") && (
                        <button
                          className={`${ui.iconBtn} ${ui.iconBtnDanger}`}
                          onClick={() => openDelete(p)}
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
          <div className={ui.modal} style={{ maxWidth: 680 }}>
            <div className={ui.modalHeader}>
              <div className={ui.modalTitle}>
                {modal === "create" ? "New Product" : "Edit Product"}
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
                className={`${ui.tab} ${activeTab === "media" ? ui.tabActive : ""}`}
                onClick={() => setActiveTab("media")}
              >
                Media & Variants
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
                  <div className={ui.field}>
                    <label className={ui.label}>Collection *</label>
                    <select
                      className={ui.select}
                      value={form.collectionId || ""}
                      onChange={(e) => set("collectionId", e.target.value)}
                    >
                      <option value="">Select collection</option>
                      {collections.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={ui.fieldRow}>
                    <div className={ui.field}>
                      <label className={ui.label}>Name *</label>
                      <input
                        className={ui.input}
                        value={form.name || ""}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="e.g. Linen Wrap Dress"
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
                    <label className={ui.label}>Description *</label>
                    <RichTextarea
                      value={form.description || ""}
                      onChange={(v) => set("description", v)}
                    />
                  </div>
                  <div className={ui.fieldRow}>
                    <label className={ui.checkboxField}>
                      <input
                        type="checkbox"
                        checked={!!form.featured}
                        onChange={(e) => set("featured", e.target.checked)}
                      />
                      <span className={ui.checkboxLabel}>Featured</span>
                    </label>
                    <label className={ui.checkboxField}>
                      <input
                        type="checkbox"
                        checked={!!form.inStock}
                        onChange={(e) => set("inStock", e.target.checked)}
                      />
                      <span className={ui.checkboxLabel}>In Stock</span>
                    </label>
                  </div>
                </div>
              )}
              {activeTab === "media" && (
                <div className={ui.form}>
                  <ImageUpload
                    label="Main Image"
                    value={form.mainImage || ""}
                    onChange={(url) => set("mainImage", url)}
                  />
                  <MultiImageUpload
                    label="Gallery Images"
                    value={form.gallery || []}
                    onChange={(urls) => set("gallery", urls)}
                  />
                  <div className={ui.field}>
                    <label className={ui.label}>Colors</label>
                    <ColorPicker
                      value={form.colors || []}
                      onChange={(colors) => set("colors", colors)}
                    />
                  </div>
                  <div className={ui.field}>
                    <label className={ui.label}>Sizes</label>
                    <SizeSelector
                      value={form.sizes || []}
                      onChange={(sizes) => set("sizes", sizes)}
                    />
                  </div>
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
                      placeholder={form.name || "Product name"}
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
                    label="Social Image (defaults to main image, then site logo, if left blank)"
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
              <div className={ui.modalTitle}>Delete Product</div>
              <button className={ui.modalClose} onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className={ui.modalBody}>
              <div className={ui.confirmText}>
                Delete <strong>{selected.name}</strong>?
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
