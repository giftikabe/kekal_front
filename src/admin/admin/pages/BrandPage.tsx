/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { brandApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import ImageUpload from "../components/ImageUpload";
import RichTextarea from "../components/RichTextarea";
import DragList from "../components/DragList";
import ui from "../components/ui.module.css";

type Tab = "identity" | "messages" | "values" | "designer" | "contact" | "about";

interface KVItem { id: string; key: string; label: string; value: string; }
interface BrandValue { id: string; icon: string; title: string; description: string; }
interface BrandMessage { id: string; key: string; title: string; description: string; }
interface AboutBlock { id: string; key: string; title: string; content: string; images: string[]; }

export default function BrandPage() {
  const { hasPermission } = useAuthContext();
  const [tab, setTab] = useState<Tab>("identity");
  const [identity, setIdentity] = useState<KVItem[]>([]);
  const [messages, setMessages] = useState<BrandMessage[]>([]);
  const [values, setValues] = useState<BrandValue[]>([]);
  const [designer, setDesigner] = useState<KVItem[]>([]);
  const [contact, setContact] = useState<KVItem[]>([]);
  const [about, setAbout] = useState<AboutBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  // Value CRUD modal
  const [valueModal, setValueModal] = useState<"create" | "edit" | "delete" | null>(null);
  const [selectedValue, setSelectedValue] = useState<BrandValue | null>(null);
  const [valueForm, setValueForm] = useState<Partial<BrandValue>>({ icon: "", title: "", description: "" });
  const [valueSaving, setValueSaving] = useState(false);

  // Identity add/delete modal
  const [identityModal, setIdentityModal] = useState<"create" | "delete" | null>(null);
  const [selectedIdentity, setSelectedIdentity] = useState<KVItem | null>(null);
  const [identityForm, setIdentityForm] = useState({ key: "", label: "", value: "" });
  const [identitySaving, setIdentitySaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [id, msg, val, des, con, ab] = await Promise.all([
          brandApi.getIdentity(), brandApi.getMessages(), brandApi.getValues(),
          brandApi.getDesignerProfile(), brandApi.getContactInfo(), brandApi.getAboutBlocks(),
        ]);
        setIdentity(id as KVItem[]); setMessages(msg as BrandMessage[]);
        setValues(val as BrandValue[]); setDesigner(des as KVItem[]);
        setContact(con as KVItem[]); setAbout(ab as AboutBlock[]);
      } catch (e: any) { setError(e.message); } finally { setLoading(false); }
    };
    load();
  }, []);

  const showSaved = (id: string) => { setSaved(id); setTimeout(() => setSaved(null), 2000); };

  const updateKV = async (items: KVItem[], setItems: (v: KVItem[]) => void, updater: (id: string, body: unknown) => Promise<any>, id: string, value: string) => {
    setSaving(id);
    try {
      await updater(id, { value });
      setItems(items.map((i) => (i.id === id ? { ...i, value } : i)));
      showSaved(id);
    } catch (e: any) { setError(e.message); } finally { setSaving(null); }
  };

  const updateMessage = async (id: string, field: string, value: string) => {
    setSaving(id + field);
    try {
      await brandApi.updateMessage(id, { [field]: value });
      setMessages(messages.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
      showSaved(id + field);
    } catch (e: any) { setError(e.message); } finally { setSaving(null); }
  };

  const updateAbout = async (id: string, field: string, value: any) => {
    setSaving(id + field);
    try {
      await brandApi.updateAboutBlock(id, { [field]: value });
      setAbout(about.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
      showSaved(id + field);
    } catch (e: any) { setError(e.message); } finally { setSaving(null); }
  };

  // Brand Values CRUD
  const handleValueSave = async () => {
    setValueSaving(true);
    try {
      if (valueModal === "create") {
        const result = await brandApi.createValue(valueForm) as BrandValue;
        setValues([...values, result]);
      } else if (valueModal === "edit" && selectedValue) {
        await brandApi.updateValue(selectedValue.id, valueForm);
        setValues(values.map((v) => (v.id === selectedValue.id ? { ...v, ...valueForm } as BrandValue : v)));
      }
      setValueModal(null); setSelectedValue(null); setValueForm({ icon: "", title: "", description: "" });
    } catch (e: any) { setError(e.message); } finally { setValueSaving(false); }
  };

  const handleValueDelete = async () => {
    if (!selectedValue) return;
    setValueSaving(true);
    try {
      await brandApi.deleteValue(selectedValue.id);
      setValues(values.filter((v) => v.id !== selectedValue.id));
      setValueModal(null); setSelectedValue(null);
    } catch (e: any) { setError(e.message); } finally { setValueSaving(false); }
  };

  // Identity add/delete
  const handleIdentityCreate = async () => {
    setIdentitySaving(true);
    try {
      const result = await brandApi.createIdentity(identityForm) as KVItem;
      setIdentity([...identity, result]);
      setIdentityModal(null); setIdentityForm({ key: "", label: "", value: "" });
    } catch (e: any) { setError(e.message); } finally { setIdentitySaving(false); }
  };

  const handleIdentityDelete = async () => {
    if (!selectedIdentity) return;
    setIdentitySaving(true);
    try {
      await brandApi.deleteIdentity(selectedIdentity.id);
      setIdentity(identity.filter((i) => i.id !== selectedIdentity.id));
      setIdentityModal(null); setSelectedIdentity(null);
    } catch (e: any) { setError(e.message); } finally { setIdentitySaving(false); }
  };

  const canEdit = hasPermission("brand", "update");
  const canCreate = hasPermission("brand", "create");
  const canDelete = hasPermission("brand", "delete");

  const TABS: { key: Tab; label: string }[] = [
    { key: "identity", label: "Brand Identity" },
    { key: "messages", label: "Messages" },
    { key: "values", label: "Brand Values" },
    { key: "designer", label: "Designer Profile" },
    { key: "contact", label: "Contact Info" },
    { key: "about", label: "About Blocks" },
  ];

  return (
    <div>
      <div className={ui.pageHeader}><div className={ui.pageTitle}>Brand Settings</div></div>
      {error && <div className={ui.errorMsg}>{error}</div>}

      <div className={ui.tabs}>
        {TABS.map((t) => (
          <button key={t.key} className={`${ui.tab} ${tab === t.key ? ui.tabActive : ""}`} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {loading ? <div className={ui.loading}>Loading...</div> : (
        <>
          {/* ─── Identity ─── */}
          {tab === "identity" && (
            <div>
              {canCreate && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                  <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={() => setIdentityModal("create")}>+ Add Field</button>
                </div>
              )}
              {identity.map((item) => (
                <KVFieldCard
                  key={item.id} item={item} canEdit={canEdit} canDelete={canDelete}
                  saving={saving} saved={saved}
                  isImage={item.key.includes("image") || item.key.includes("logo")}
                  onSave={(val) => updateKV(identity, setIdentity, brandApi.updateIdentity, item.id, val)}
                  onDelete={() => { setSelectedIdentity(item); setIdentityModal("delete"); }}
                />
              ))}

              {identityModal === "create" && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}><div className={ui.modalTitle}>Add Brand Field</div><button className={ui.modalClose} onClick={() => setIdentityModal(null)}>✕</button></div>
                    <div className={ui.modalBody}>
                      <div className={ui.form}>
                        <div className={ui.field}><label className={ui.label}>Key (internal)</label><input className={ui.input} value={identityForm.key} onChange={(e) => setIdentityForm({ ...identityForm, key: e.target.value })} placeholder="my_field_key" /></div>
                        <div className={ui.field}><label className={ui.label}>Label</label><input className={ui.input} value={identityForm.label} onChange={(e) => setIdentityForm({ ...identityForm, label: e.target.value })} /></div>
                        <div className={ui.field}><label className={ui.label}>Value</label><input className={ui.input} value={identityForm.value} onChange={(e) => setIdentityForm({ ...identityForm, value: e.target.value })} /></div>
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={() => setIdentityModal(null)}>Cancel</button>
                      <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={handleIdentityCreate} disabled={identitySaving}>{identitySaving ? "Adding..." : "Add"}</button>
                    </div>
                  </div>
                </div>
              )}

              {identityModal === "delete" && selectedIdentity && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}><div className={ui.modalTitle}>Delete Field</div><button className={ui.modalClose} onClick={() => setIdentityModal(null)}>✕</button></div>
                    <div className={ui.modalBody}><div className={ui.confirmText}>Delete <strong>{selectedIdentity.label}</strong>?</div></div>
                    <div className={ui.modalFooter}>
                      <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={() => setIdentityModal(null)}>Cancel</button>
                      <button className={`${ui.btn} ${ui.btnDanger}`} onClick={handleIdentityDelete} disabled={identitySaving}>Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Messages ─── */}
          {tab === "messages" && (
            <div>
              {messages.map((msg) => (
                <div key={msg.id} className={ui.card}>
                  <div className={ui.cardTitle}>{msg.key}</div>
                  <div className={ui.form}>
                    <InlineField label="Title" value={msg.title} id={msg.id + "title"} canEdit={canEdit} saving={saving} saved={saved} onSave={(val) => updateMessage(msg.id, "title", val)} />
                    <InlineField label="Description" value={msg.description} id={msg.id + "description"} canEdit={canEdit} saving={saving} saved={saved} onSave={(val) => updateMessage(msg.id, "description", val)} multiline />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── Brand Values with drag reorder ─── */}
          {tab === "values" && (
            <div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                {canCreate && <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={() => { setValueForm({ icon: "", title: "", description: "" }); setValueModal("create"); }}>+ Add Value</button>}
              </div>
              <DragList
                items={values}
                onReorder={setValues}
                disabled={!canEdit}
                renderItem={(v) => (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <strong style={{ fontSize: 18, width: 28 }}>{v.icon}</strong>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{v.title}</div>
                        <div style={{ fontSize: 12, color: "#666" }}>{v.description}</div>
                      </div>
                    </div>
                    <div className={ui.actions}>
                      {canEdit && <button className={ui.actionBtn} onClick={() => { setSelectedValue(v); setValueForm(v); setValueModal("edit"); }}>Edit</button>}
                      {canDelete && <button className={`${ui.actionBtn} ${ui.actionBtnDanger}`} onClick={() => { setSelectedValue(v); setValueModal("delete"); }}>Delete</button>}
                    </div>
                  </div>
                )}
              />

              {(valueModal === "create" || valueModal === "edit") && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}><div className={ui.modalTitle}>{valueModal === "create" ? "Add Brand Value" : "Edit Brand Value"}</div><button className={ui.modalClose} onClick={() => setValueModal(null)}>✕</button></div>
                    <div className={ui.modalBody}>
                      <div className={ui.form}>
                        <div className={ui.field}><label className={ui.label}>Icon Name (Lucide)</label><input className={ui.input} value={valueForm.icon || ""} onChange={(e) => setValueForm({ ...valueForm, icon: e.target.value })} placeholder="Leaf, Heart, Users..." /></div>
                        <div className={ui.field}><label className={ui.label}>Title *</label><input className={ui.input} value={valueForm.title || ""} onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })} /></div>
                        <div className={ui.field}><label className={ui.label}>Description *</label><RichTextarea value={valueForm.description || ""} onChange={(v) => setValueForm({ ...valueForm, description: v })} minHeight={70} /></div>
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={() => setValueModal(null)}>Cancel</button>
                      <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={handleValueSave} disabled={valueSaving}>{valueSaving ? "Saving..." : "Save"}</button>
                    </div>
                  </div>
                </div>
              )}

              {valueModal === "delete" && selectedValue && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}><div className={ui.modalTitle}>Delete Brand Value</div><button className={ui.modalClose} onClick={() => setValueModal(null)}>✕</button></div>
                    <div className={ui.modalBody}><div className={ui.confirmText}>Delete <strong>{selectedValue.title}</strong>?</div></div>
                    <div className={ui.modalFooter}>
                      <button className={`${ui.btn} ${ui.btnSecondary}`} onClick={() => setValueModal(null)}>Cancel</button>
                      <button className={`${ui.btn} ${ui.btnDanger}`} onClick={handleValueDelete} disabled={valueSaving}>Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Designer ─── */}
          {tab === "designer" && (
            <div>
              {designer.map((item) => (
                <KVFieldCard
                  key={item.id} item={item} canEdit={canEdit} canDelete={false}
                  saving={saving} saved={saved}
                  isImage={item.key === "portrait"}
                  multiline={item.key.includes("bio")}
                  onSave={(val) => updateKV(designer, setDesigner, brandApi.updateDesignerProfile, item.id, val)}
                  onDelete={() => {}}
                />
              ))}
            </div>
          )}

          {/* ─── Contact ─── */}
          {tab === "contact" && (
            <div>
              {contact.map((item) => (
                <KVFieldCard
                  key={item.id} item={item} canEdit={canEdit} canDelete={false}
                  saving={saving} saved={saved}
                  onSave={(val) => updateKV(contact, setContact, brandApi.updateContactInfo, item.id, val)}
                  onDelete={() => {}}
                />
              ))}
            </div>
          )}

          {/* ─── About Blocks ─── */}
          {tab === "about" && (
            <div>
              {about.map((block) => (
                <div key={block.id} className={ui.card}>
                  <div className={ui.cardTitle}>{block.title}</div>
                  <div className={ui.form}>
                    <InlineField label="Title" value={block.title} id={block.id + "title"} canEdit={canEdit} saving={saving} saved={saved} onSave={(val) => updateAbout(block.id, "title", val)} />
                    <InlineFieldRich label="Content" value={block.content} id={block.id + "content"} canEdit={canEdit} saving={saving} saved={saved} onSave={(val) => updateAbout(block.id, "content", val)} />
                    <InlineField label="Images (comma-separated URLs)" value={block.images?.join(", ") || ""} id={block.id + "images"} canEdit={canEdit} saving={saving} saved={saved} onSave={(val) => updateAbout(block.id, "images", val.split(",").map((s) => s.trim()).filter(Boolean))} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── KV Field Card ─────────────────────────────────────────────────────────────
function KVFieldCard({ item, canEdit, canDelete, saving, saved, onSave, onDelete, isImage = false, multiline = false }: {
  item: KVItem; canEdit: boolean; canDelete: boolean;
  saving: string | null; saved: string | null;
  onSave: (val: string) => void; onDelete: () => void;
  isImage?: boolean; multiline?: boolean;
}) {
  const [local, setLocal] = useState(item.value);
  const changed = local !== item.value;

  return (
    <div className={ui.card}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div className={ui.field} style={{ flex: 1 }}>
          <label className={ui.label}>{item.label}</label>
          {isImage ? (
            <ImageUpload value={local} onChange={(url) => setLocal(url)} disabled={!canEdit} />
          ) : multiline ? (
            <RichTextarea value={local} onChange={setLocal} disabled={!canEdit} />
          ) : (
            <input className={ui.input} value={local} onChange={(e) => setLocal(e.target.value)} disabled={!canEdit} />
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 22 }}>
          {canEdit && (
            <button
              className={`${ui.btn} ${ui.btnPrimary}`}
              style={{ padding: "8px 16px", fontSize: 11, opacity: changed ? 1 : 0.4 }}
              onClick={() => onSave(local)}
              disabled={saving === item.id || !changed}
            >
              {saving === item.id ? "..." : saved === item.id ? "✓" : "Save"}
            </button>
          )}
          {canDelete && (
            <button className={`${ui.btn} ${ui.btnDanger}`} style={{ padding: "8px 16px", fontSize: 11 }} onClick={onDelete}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Inline text field ────────────────────────────────────────────────────────
function InlineField({ label, value, id, canEdit, saving, saved, onSave, multiline = false }: {
  label: string; value: string; id: string; canEdit: boolean;
  saving: string | null; saved: string | null;
  onSave: (val: string) => void; multiline?: boolean;
}) {
  const [local, setLocal] = useState(value);
  const changed = local !== value;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <div className={ui.field} style={{ flex: 1 }}>
        <label className={ui.label}>{label}</label>
        {multiline
          ? <textarea className={ui.textarea} value={local} onChange={(e) => setLocal(e.target.value)} disabled={!canEdit} />
          : <input className={ui.input} value={local} onChange={(e) => setLocal(e.target.value)} disabled={!canEdit} />}
      </div>
      {canEdit && (
        <div style={{ paddingTop: 22 }}>
          <button className={`${ui.btn} ${ui.btnPrimary}`} style={{ padding: "8px 14px", fontSize: 11, opacity: changed ? 1 : 0.3 }} disabled={!changed || saving === id} onClick={() => onSave(local)}>
            {saving === id ? "..." : saved === id ? "✓" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Inline rich text field ───────────────────────────────────────────────────
function InlineFieldRich({ label, value, id, canEdit, saving, saved, onSave }: {
  label: string; value: string; id: string; canEdit: boolean;
  saving: string | null; saved: string | null; onSave: (val: string) => void;
}) {
  const [local, setLocal] = useState(value);
  const changed = local !== value;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <div className={ui.field} style={{ flex: 1 }}>
        <label className={ui.label}>{label}</label>
        <RichTextarea value={local} onChange={setLocal} disabled={!canEdit} />
      </div>
      {canEdit && (
        <div style={{ paddingTop: 22 }}>
          <button className={`${ui.btn} ${ui.btnPrimary}`} style={{ padding: "8px 14px", fontSize: 11, opacity: changed ? 1 : 0.3 }} disabled={!changed || saving === id} onClick={() => onSave(local)}>
            {saving === id ? "..." : saved === id ? "✓" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}
