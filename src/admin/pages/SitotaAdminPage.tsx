/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { sitotaApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import ImageUpload from "../components/ImageUpload";
import MultiImageUpload from "../components/MultiImageUpload";
import ColorPicker from "../components/ColorPicker";
import SizeSelector from "../components/SizeSelector";
import RichTextarea from "../components/RichTextarea";
import ui from "../components/ui.module.css";

type Item = {
    id: string;
    name: string;
    slug: string;
    description: string;
    mainImage: string;
    gallery: string[];
    colors: string[];
    sizes: string[];
    occasion: string;
    giftNote: string;
    inStock: boolean;
    featured: boolean;
};

const EMPTY: Partial<Item> = {
    name: "",
    slug: "",
    description: "",
    mainImage: "",
    gallery: [],
    colors: [],
    sizes: [],
    occasion: "Thoughtful gifting",
    giftNote: "",
    inStock: true,
    featured: false,
};

export default function SitotaAdminPage() {
    const { hasPermission } = useAuthContext();
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState<Partial<Item>>(EMPTY);
    const [selected, setSelected] = useState<Item | null>(null);
    const [modal, setModal] = useState<"create" | "edit" | "delete" | null>(null);
    const [saving, setSaving] = useState(false);
    const [tab, setTab] = useState<"details" | "media">("details");
    const canEdit = hasPermission("products", "update");

    const load = async () => {
        try {
            setLoading(true);
            setItems((await sitotaApi.getAll()) as Item[]);
        } catch (e: any) {
            setError(e.message || "Could not load Sitota items");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const openCreate = () => {
        setSelected(null);
        setForm({ ...EMPTY });
        setTab("details");
        setError("");
        setModal("create");
    };

    const openEdit = (x: Item) => {
        if (!canEdit) return;
        setSelected(x);
        setForm({ ...x });
        setTab("details");
        setModal("edit");
    };

    const close = () => setModal(null);

    const set = (key: keyof Item, value: any) =>
        setForm((f) => ({ ...f, [key]: value }));

    const save = async () => {
        if (
            !form.name?.trim() ||
            !form.slug?.trim() ||
            !form.description?.trim() ||
            !form.mainImage?.trim()
        ) {
            setError("Name, slug, description, and main image are required.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const data = {
                ...form,
                slug: form.slug
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9-]+/g, "-")
                    .replace(/^-|-$/g, ""),
            };

            if (modal === "create") await sitotaApi.create(data);
            else if (selected) await sitotaApi.update(selected.id, data);

            await load();
            close();
        } catch (e: any) {
            setError(e.message || "Could not save Sitota item");
        } finally {
            setSaving(false);
        }
    };

    const remove = async () => {
        if (!selected) return;
        setSaving(true);
        try {
            await sitotaApi.delete(selected.id);
            await load();
            close();
        } catch (e: any) {
            setError(e.message || "Could not delete item");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className={ui.pageHeader}>
                <div>
                    <div className={ui.pageTitle}>Sitota Gifts</div>
                    <div className={ui.pageCount}>
                        {items.length} giftable pieces · managed separately from
                        collections
                    </div>
                </div>
                {hasPermission("products", "create") && (
                    <button
                        className={`${ui.btn} ${ui.btnPrimary}`}
                        onClick={openCreate}
                    >
                        + New Gift
                    </button>
                )}
            </div>

            {error && <div className={ui.errorMsg}>{error}</div>}

            {loading ? (
                <div className={ui.loading}>Loading…</div>
            ) : items.length === 0 ? (
                <div className={ui.empty}>
                    <div className={ui.emptyIcon}>◇</div>
                    No Sitota gifts yet. Add the first giftable piece.
                </div>
            ) : (
                <div className={ui.tableWrap}>
                    <table className={ui.table}>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Gift</th>
                                <th>Occasion</th>
                                <th>Colors</th>
                                <th>Stock</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((x) => (
                                <tr
                                    key={x.id}
                                    className={canEdit ? ui.tableRowClickable : ""}
                                    onClick={() => openEdit(x)}
                                >
                                    <td>
                                        {x.mainImage ? (
                                            <img
                                                src={x.mainImage}
                                                alt={x.name}
                                                className={ui.imagePreview}
                                            />
                                        ) : (
                                            <div className={ui.noImage}>No img</div>
                                        )}
                                    </td>
                                    <td>
                                        <strong>{x.name}</strong>
                                        <div style={{ fontSize: 11, color: "#999" }}>
                                            /sitota/{x.slug}
                                        </div>
                                    </td>
                                    <td>{x.occasion}</td>
                                    <td>{x.colors?.join(", ") || "—"}</td>
                                    <td>
                                        <span
                                            className={`${ui.badge} ${
                                                x.inStock ? ui.badgeGreen : ui.badgeRed
                                            }`}
                                        >
                                            {x.inStock ? "In stock" : "Out"}
                                        </span>
                                    </td>
                                    <td>{x.featured ? "Yes" : "—"}</td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <div className={ui.actions}>
                                            {canEdit && (
                                                <button
                                                    className={ui.iconBtn}
                                                    onClick={() => openEdit(x)}
                                                    aria-label="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                            )}
                                            {hasPermission("products", "delete") && (
                                                <button
                                                    className={`${ui.iconBtn} ${ui.iconBtnDanger}`}
                                                    onClick={() => {
                                                        setSelected(x);
                                                        setModal("delete");
                                                    }}
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
                                {modal === "create"
                                    ? "New Sitota Gift"
                                    : "Edit Sitota Gift"}
                            </div>
                            <button className={ui.modalClose} onClick={close}>
                                ✕
                            </button>
                        </div>
                        <div
                            className={ui.tabs}
                            style={{ padding: "0 24px", borderBottom: "1px solid #eee" }}
                        >
                            <button
                                className={`${ui.tab} ${
                                    tab === "details" ? ui.tabActive : ""
                                }`}
                                onClick={() => setTab("details")}
                            >
                                Details
                            </button>
                            <button
                                className={`${ui.tab} ${
                                    tab === "media" ? ui.tabActive : ""
                                }`}
                                onClick={() => setTab("media")}
                            >
                                Media & Variants
                            </button>
                        </div>
                        <div className={ui.modalBody}>
                            {tab === "details" ? (
                                <div className={ui.form}>
                                    <div className={ui.fieldRow}>
                                        <div className={ui.field}>
                                            <label className={ui.label}>Gift name *</label>
                                            <input
                                                className={ui.input}
                                                value={form.name || ""}
                                                onChange={(e) => set("name", e.target.value)}
                                                placeholder="e.g. Shema Gift Wrap"
                                            />
                                        </div>
                                        <div className={ui.field}>
                                            <label className={ui.label}>Slug *</label>
                                            <input
                                                className={ui.input}
                                                value={form.slug || ""}
                                                onChange={(e) => set("slug", e.target.value)}
                                                placeholder="shema-gift-wrap"
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
                                    <div className={ui.field}>
                                        <label className={ui.label}>Gift occasion / category</label>
                                        <input
                                            className={ui.input}
                                            value={form.occasion || ""}
                                            onChange={(e) => set("occasion", e.target.value)}
                                            placeholder="For new beginnings, celebrations, for her…"
                                        />
                                    </div>
                                    <div className={ui.field}>
                                        <label className={ui.label}>Gift note (optional)</label>
                                        <RichTextarea
                                            value={form.giftNote || ""}
                                            onChange={(v) => set("giftNote", v)}
                                            minHeight={80}
                                        />
                                    </div>
                                    <div className={ui.fieldRow}>
                                        <label className={ui.checkboxField}>
                                            <input
                                                type="checkbox"
                                                checked={!!form.featured}
                                                onChange={(e) => set("featured", e.target.checked)}
                                            />
                                            <span className={ui.checkboxLabel}>Featured on Sitota page</span>
                                        </label>
                                        <label className={ui.checkboxField}>
                                            <input
                                                type="checkbox"
                                                checked={!!form.inStock}
                                                onChange={(e) => set("inStock", e.target.checked)}
                                            />
                                            <span className={ui.checkboxLabel}>Available</span>
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className={ui.form}>
                                    <ImageUpload
                                        label="Main Image *"
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
                                            onChange={(v) => set("colors", v)}
                                        />
                                    </div>
                                    <div className={ui.field}>
                                        <label className={ui.label}>Sizes</label>
                                        <SizeSelector
                                            value={form.sizes || []}
                                            onChange={(v) => set("sizes", v)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={ui.modalFooter}>
                            <button
                                className={`${ui.btn} ${ui.btnSecondary}`}
                                onClick={close}
                            >
                                Cancel
                            </button>
                            <button
                                className={`${ui.btn} ${ui.btnPrimary}`}
                                onClick={save}
                                disabled={saving}
                            >
                                {saving ? "Saving…" : "Save Gift"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modal === "delete" && selected && (
                <div className={ui.overlay}>
                    <div className={ui.modal}>
                        <div className={ui.modalHeader}>
                            <div className={ui.modalTitle}>Delete Sitota Gift</div>
                            <button className={ui.modalClose} onClick={close}>
                                ✕
                            </button>
                        </div>
                        <div className={ui.modalBody}>
                            Delete <strong>{selected.name}</strong>? This cannot be undone.
                        </div>
                        <div className={ui.modalFooter}>
                            <button
                                className={`${ui.btn} ${ui.btnSecondary}`}
                                onClick={close}
                            >
                                Cancel
                            </button>
                            <button
                                className={`${ui.btn} ${ui.btnDanger}`}
                                onClick={remove}
                                disabled={saving}
                            >
                                {saving ? "Deleting…" : "Delete Gift"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}