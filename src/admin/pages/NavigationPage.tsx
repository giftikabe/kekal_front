/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { pagesApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import DragList from "../components/DragList";
import ui from "../components/ui.module.css";

interface NavItem {
  id: string;
  label: string;
  href: string;
  order: number;
}

export default function NavigationPage() {
  const { hasPermission } = useAuthContext();
  const [nav, setNav] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modal, setModal] = useState<"create" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<NavItem | null>(null);
  const [form, setForm] = useState<Partial<NavItem>>({
    label: "",
    href: "",
    order: 0,
  });
  const [saving, setSaving] = useState(false);

  const canEdit = hasPermission("navigation", "update");
  const canCreate = hasPermission("navigation", "create");
  const canDelete = hasPermission("navigation", "delete");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const n = (await pagesApi.getNavigation()) as NavItem[];
        setNav(n.sort((a, b) => a.order - b.order));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleReorder = async (reordered: NavItem[]) => {
    const updated = reordered.map((item, index) => ({
      ...item,
      order: index + 1,
    }));
    setNav(updated);
    try {
      await Promise.all(
        updated.map((item) =>
          pagesApi.updateNavigation(item.id, { order: item.order }),
        ),
      );
    } catch (e: any) {
      setError(e.message);
    }
  };

  const openCreate = () => {
    setForm({ label: "", href: "", order: nav.length + 1 });
    setModal("create");
  };
  const openEdit = (item: NavItem) => {
    setSelected(item);
    setForm(item);
    setModal("edit");
  };
  const openDelete = (item: NavItem) => {
    setSelected(item);
    setModal("delete");
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setForm({ label: "", href: "", order: 0 });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal === "create") {
        const result = (await pagesApi.createNavigation(form)) as NavItem;
        setNav([...nav, result]);
      } else if (modal === "edit" && selected) {
        await pagesApi.updateNavigation(selected.id, form);
        setNav(
          nav.map((n) =>
            n.id === selected.id ? ({ ...n, ...form } as NavItem) : n,
          ),
        );
      }
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
      await pagesApi.deleteNavigation(selected.id);
      setNav(nav.filter((n) => n.id !== selected.id));
      closeModal();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className={ui.pageHeader}>
        <div>
          <div className={ui.pageTitle}>Navigation</div>
          <div className={ui.pageCount}>{nav.length} items</div>
        </div>
        {canCreate && (
          <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={openCreate}>
            + Add Nav Item
          </button>
        )}
      </div>

      {error && <div className={ui.errorMsg}>{error}</div>}

      {loading ? (
        <div className={ui.loading}>Loading...</div>
      ) : nav.length === 0 ? (
        <div className={ui.empty}>
          <div className={ui.emptyIcon}>◱</div>No navigation items yet.
        </div>
      ) : (
        <DragList
          items={nav}
          onReorder={handleReorder}
          disabled={!canEdit}
          renderItem={(item) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                width: "100%",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 11, color: "#ccc", width: 20 }}>
                  {item.order}
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 11,
                      color: "#999",
                    }}
                  >
                    {item.href}
                  </div>
                </div>
              </div>
              <div className={ui.actions}>
                {canEdit && (
                  <button
                    className={ui.iconBtn}
                    onClick={() => openEdit(item)}
                    aria-label="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                )}
                {canDelete && (
                  <button
                    className={`${ui.iconBtn} ${ui.iconBtnDanger}`}
                    onClick={() => openDelete(item)}
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          )}
        />
      )}

      {(modal === "create" || modal === "edit") && (
        <div className={ui.overlay}>
          <div className={ui.modal}>
            <div className={ui.modalHeader}>
              <div className={ui.modalTitle}>
                {modal === "create" ? "Add Nav Item" : "Edit Nav Item"}
              </div>
              <button className={ui.modalClose} onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className={ui.modalBody}>
              <div className={ui.form}>
                <div className={ui.field}>
                  <label className={ui.label}>Label *</label>
                  <input
                    className={ui.input}
                    value={form.label || ""}
                    onChange={(e) =>
                      setForm({ ...form, label: e.target.value })
                    }
                    placeholder="e.g. Collections"
                  />
                </div>
                <div className={ui.field}>
                  <label className={ui.label}>Link (href) *</label>
                  <input
                    className={ui.input}
                    value={form.href || ""}
                    onChange={(e) => setForm({ ...form, href: e.target.value })}
                    placeholder="/collections"
                  />
                </div>
                <div className={ui.field}>
                  <label className={ui.label}>Order</label>
                  <input
                    className={ui.input}
                    type="number"
                    value={form.order || 0}
                    onChange={(e) =>
                      setForm({ ...form, order: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>
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
              <div className={ui.modalTitle}>Delete Nav Item</div>
              <button className={ui.modalClose} onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className={ui.modalBody}>
              <div className={ui.confirmText}>
                Delete <strong>{selected.label}</strong>?
              </div>
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
