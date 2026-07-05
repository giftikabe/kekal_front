/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { brandApi } from "../api/client";
import { useAuthContext } from "../hooks/AuthContext";
import ImageUpload from "../components/ImageUpload";
import MultiImageUpload from "../components/MultiImageUpload";
import RichTextarea from "../components/RichTextarea";
import ui from "../components/ui.module.css";
import DragList from "../components/DragList";

type Tab =
  | "identity"
  | "announcements"
  | "messages"
  | "values"
  | "designer"
  | "contact"
  | "about";

interface KVItem {
  id: string;
  key: string;
  label: string;
  value: string;
}
interface BrandValue {
  id: string;
  icon: string;
  title: string;
  description: string;
}
interface BrandMessage {
  id: string;
  key: string;
  title: string;
  description: string;
}
interface AboutBlock {
  id: string;
  key: string;
  title: string;
  content: string;
  images: string[];
}

const IDENTITY_PLACEHOLDERS: Record<string, string> = {
  name: "e.g. KEKAL",
  tagline: "e.g. Crafted Slow, Worn Forever",
  description: "A short brand description shown on the homepage hero",
  title: "e.g. Studio",
  copyright_text: "e.g. © 2026 KEKAL Studio. All rights reserved.",
  logo: "Logo image URL",
  home_hero_image: "Homepage hero image URL",
  contact_hero_eyebrow: "e.g. Get In Touch",
  contact_hero_description: "Short intro shown on the contact page hero",
  contact_hero_image: "Contact page hero image URL",
};
const placeholderFor = (key: string) =>
  IDENTITY_PLACEHOLDERS[key] || `Value for "${key}"`;

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

  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [announcementsRecordId, setAnnouncementsRecordId] = useState<
    string | null
  >(null);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [announcementsSaving, setAnnouncementsSaving] = useState(false);
  const [announcementsSaved, setAnnouncementsSaved] = useState(false);

  const [valueModal, setValueModal] = useState<
    "create" | "edit" | "delete" | null
  >(null);
  const [selectedValue, setSelectedValue] = useState<BrandValue | null>(null);
  const [valueForm, setValueForm] = useState<Partial<BrandValue>>({
    icon: "",
    title: "",
    description: "",
  });
  const [valueSaving, setValueSaving] = useState(false);

  const [identityModal, setIdentityModal] = useState<
    "create" | "delete" | null
  >(null);
  const [selectedIdentity, setSelectedIdentity] = useState<KVItem | null>(null);
  const [identityForm, setIdentityForm] = useState({
    key: "",
    label: "",
    value: "",
  });
  const [identitySaving, setIdentitySaving] = useState(false);

  const [messageModal, setMessageModal] = useState<"create" | null>(null);
  const [messageForm, setMessageForm] = useState({
    key: "",
    title: "",
    description: "",
  });
  const [messageSaving, setMessageSaving] = useState(false);

  const [designerModal, setDesignerModal] = useState<"create" | null>(null);
  const [designerForm, setDesignerForm] = useState({
    key: "",
    label: "",
    value: "",
  });
  const [designerSaving, setDesignerSaving] = useState(false);

  const [contactModal, setContactModal] = useState<"create" | "delete" | null>(
    null,
  );
  const [selectedContact, setSelectedContact] = useState<KVItem | null>(null);
  const [contactForm, setContactForm] = useState({
    key: "",
    label: "",
    value: "",
  });
  const [contactSaving, setContactSaving] = useState(false);

  const [aboutModal, setAboutModal] = useState<"create" | "delete" | null>(
    null,
  );
  const [selectedAbout, setSelectedAbout] = useState<AboutBlock | null>(null);
  const [aboutForm, setAboutForm] = useState<Partial<AboutBlock>>({
    key: "",
    title: "",
    content: "",
    images: [],
  });
  const [aboutSaving, setAboutSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [id, msg, val, des, con, ab] = await Promise.all([
          brandApi.getIdentity(),
          brandApi.getMessages(),
          brandApi.getValues(),
          brandApi.getDesignerProfile(),
          brandApi.getContactInfo(),
          brandApi.getAboutBlocks(),
        ]);
        const idList = id as KVItem[];
        setMessages(msg as BrandMessage[]);
        setValues(val as BrandValue[]);
        setDesigner(des as KVItem[]);
        setContact(con as KVItem[]);
        setAbout(ab as AboutBlock[]);

        const announcementsRow = idList.find((i) => i.key === "announcements");
        setIdentity(idList.filter((i) => i.key !== "announcements"));
        if (announcementsRow) {
          setAnnouncementsRecordId(announcementsRow.id);
          try {
            const parsed = JSON.parse(announcementsRow.value);
            setAnnouncements(
              Array.isArray(parsed) ? parsed : [announcementsRow.value],
            );
          } catch {
            setAnnouncements(
              announcementsRow.value ? [announcementsRow.value] : [],
            );
          }
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const showSaved = (id: string) => {
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  const updateKV = async (
    items: KVItem[],
    setItems: (v: KVItem[]) => void,
    updater: (id: string, body: unknown) => Promise<any>,
    id: string,
    value: string,
  ) => {
    setSaving(id);
    try {
      await updater(id, { value });
      setItems(items.map((i) => (i.id === id ? { ...i, value } : i)));
      showSaved(id);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  };

  const updateMessage = async (id: string, field: string, value: string) => {
    setSaving(id + field);
    try {
      await brandApi.updateMessage(id, { [field]: value });
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
      );
      showSaved(id + field);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  };

  const persistAnnouncements = async (next: string[]) => {
    setAnnouncementsSaving(true);
    try {
      const payload = JSON.stringify(next);
      if (announcementsRecordId) {
        await brandApi.updateIdentity(announcementsRecordId, {
          value: payload,
        });
      } else {
        const created = (await brandApi.createIdentity({
          key: "announcements",
          label: "Announcements",
          value: payload,
        })) as KVItem;
        setAnnouncementsRecordId(created.id);
      }
      setAnnouncements(next);
      setAnnouncementsSaved(true);
      setTimeout(() => setAnnouncementsSaved(false), 2000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAnnouncementsSaving(false);
    }
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    const next = [...announcements, newAnnouncement.trim()];
    setNewAnnouncement("");
    persistAnnouncements(next);
  };

  const handleRemoveAnnouncement = (index: number) => {
    persistAnnouncements(announcements.filter((_, i) => i !== index));
  };

  const handleValueSave = async () => {
    setValueSaving(true);
    try {
      if (valueModal === "create") {
        const result = (await brandApi.createValue(valueForm)) as BrandValue;
        setValues([...values, result]);
      } else if (valueModal === "edit" && selectedValue) {
        await brandApi.updateValue(selectedValue.id, valueForm);
        setValues(
          values.map((v) =>
            v.id === selectedValue.id
              ? ({ ...v, ...valueForm } as BrandValue)
              : v,
          ),
        );
      }
      setValueModal(null);
      setSelectedValue(null);
      setValueForm({ icon: "", title: "", description: "" });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setValueSaving(false);
    }
  };

  const handleValueDelete = async () => {
    if (!selectedValue) return;
    setValueSaving(true);
    try {
      await brandApi.deleteValue(selectedValue.id);
      setValues(values.filter((v) => v.id !== selectedValue.id));
      setValueModal(null);
      setSelectedValue(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setValueSaving(false);
    }
  };

  const handleIdentityCreate = async () => {
    setIdentitySaving(true);
    try {
      const result = (await brandApi.createIdentity(identityForm)) as KVItem;
      setIdentity([...identity, result]);
      setIdentityModal(null);
      setIdentityForm({ key: "", label: "", value: "" });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIdentitySaving(false);
    }
  };

  const handleIdentityDelete = async () => {
    if (!selectedIdentity) return;
    setIdentitySaving(true);
    try {
      await brandApi.deleteIdentity(selectedIdentity.id);
      setIdentity(identity.filter((i) => i.id !== selectedIdentity.id));
      setIdentityModal(null);
      setSelectedIdentity(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIdentitySaving(false);
    }
  };

  const handleMessageCreate = async () => {
    setMessageSaving(true);
    try {
      const result = (await brandApi.createMessage(
        messageForm,
      )) as BrandMessage;
      setMessages([...messages, result]);
      setMessageModal(null);
      setMessageForm({ key: "", title: "", description: "" });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setMessageSaving(false);
    }
  };

  const handleDesignerCreate = async () => {
    setDesignerSaving(true);
    try {
      const result = (await brandApi.createDesignerProfile(
        designerForm,
      )) as KVItem;
      setDesigner([...designer, result]);
      setDesignerModal(null);
      setDesignerForm({ key: "", label: "", value: "" });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDesignerSaving(false);
    }
  };

  const handleContactCreate = async () => {
    setContactSaving(true);
    try {
      const result = (await brandApi.createContactInfo(contactForm)) as KVItem;
      setContact([...contact, result]);
      setContactModal(null);
      setContactForm({ key: "", label: "", value: "" });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setContactSaving(false);
    }
  };

  const handleContactDelete = async () => {
    if (!selectedContact) return;
    setContactSaving(true);
    try {
      await brandApi.deleteContactInfo(selectedContact.id);
      setContact(contact.filter((c) => c.id !== selectedContact.id));
      setContactModal(null);
      setSelectedContact(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setContactSaving(false);
    }
  };

  const handleAboutCreate = async () => {
    setAboutSaving(true);
    try {
      const result = (await brandApi.createAboutBlock(aboutForm)) as AboutBlock;
      setAbout([...about, result]);
      setAboutModal(null);
      setAboutForm({ key: "", title: "", content: "", images: [] });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAboutSaving(false);
    }
  };

  const handleAboutDelete = async () => {
    if (!selectedAbout) return;
    setAboutSaving(true);
    try {
      await brandApi.deleteAboutBlock(selectedAbout.id);
      setAbout(about.filter((a) => a.id !== selectedAbout.id));
      setAboutModal(null);
      setSelectedAbout(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAboutSaving(false);
    }
  };

  const updateAbout = async (id: string, field: string, value: any) => {
    setSaving(id + field);
    try {
      await brandApi.updateAboutBlock(id, { [field]: value });
      setAbout(about.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
      showSaved(id + field);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  };

  const canEdit = hasPermission("brand", "update");
  const canCreate = hasPermission("brand", "create");
  const canDelete = hasPermission("brand", "delete");

  const TABS: { key: Tab; label: string }[] = [
    { key: "identity", label: "Brand Identity" },
    { key: "announcements", label: "Announcements" },
    { key: "messages", label: "Messages" },
    { key: "values", label: "Brand Values" },
    { key: "designer", label: "Designer Profile" },
    { key: "contact", label: "Contact Info" },
    { key: "about", label: "About Blocks" },
  ];

  return (
    <div>
      <div className={ui.pageHeader}>
        <div className={ui.pageTitle}>Brand Settings</div>
      </div>
      {error && <div className={ui.errorMsg}>{error}</div>}

      <div className={ui.tabs}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`${ui.tab} ${tab === t.key ? ui.tabActive : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={ui.loading}>Loading...</div>
      ) : (
        <>
          {tab === "identity" && (
            <div>
              {canCreate && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 16,
                  }}
                >
                  <button
                    className={`${ui.btn} ${ui.btnPrimary}`}
                    onClick={() => setIdentityModal("create")}
                  >
                    <Plus
                      size={13}
                      style={{ marginRight: 6, verticalAlign: -2 }}
                    />{" "}
                    Add Field
                  </button>
                </div>
              )}
              {identity.map((item) => (
                <KVFieldCard
                  key={item.id}
                  item={item}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  saving={saving}
                  saved={saved}
                  isImage={
                    item.key.includes("image") || item.key.includes("logo")
                  }
                  placeholder={placeholderFor(item.key)}
                  onSave={(val) =>
                    updateKV(
                      identity,
                      setIdentity,
                      brandApi.updateIdentity,
                      item.id,
                      val,
                    )
                  }
                  onDelete={() => {
                    setSelectedIdentity(item);
                    setIdentityModal("delete");
                  }}
                />
              ))}

              {identityModal === "create" && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}>
                      <div className={ui.modalTitle}>Add Brand Field</div>
                      <button
                        className={ui.modalClose}
                        onClick={() => setIdentityModal(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={ui.modalBody}>
                      <div className={ui.form}>
                        <div className={ui.field}>
                          <label className={ui.label}>Key (internal)</label>
                          <input
                            className={ui.input}
                            value={identityForm.key}
                            onChange={(e) =>
                              setIdentityForm({
                                ...identityForm,
                                key: e.target.value,
                              })
                            }
                            placeholder="e.g. instagram_handle"
                          />
                        </div>
                        <div className={ui.field}>
                          <label className={ui.label}>Label</label>
                          <input
                            className={ui.input}
                            value={identityForm.label}
                            onChange={(e) =>
                              setIdentityForm({
                                ...identityForm,
                                label: e.target.value,
                              })
                            }
                            placeholder="e.g. Instagram Handle"
                          />
                        </div>
                        <div className={ui.field}>
                          <label className={ui.label}>Value</label>
                          <input
                            className={ui.input}
                            value={identityForm.value}
                            onChange={(e) =>
                              setIdentityForm({
                                ...identityForm,
                                value: e.target.value,
                              })
                            }
                            placeholder="The value shown on the site"
                          />
                        </div>
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button
                        className={`${ui.btn} ${ui.btnSecondary}`}
                        onClick={() => setIdentityModal(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${ui.btn} ${ui.btnPrimary}`}
                        onClick={handleIdentityCreate}
                        disabled={identitySaving}
                      >
                        {identitySaving ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {identityModal === "delete" && selectedIdentity && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}>
                      <div className={ui.modalTitle}>Delete Field</div>
                      <button
                        className={ui.modalClose}
                        onClick={() => setIdentityModal(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={ui.modalBody}>
                      <div className={ui.confirmText}>
                        Delete <strong>{selectedIdentity.label}</strong>?
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button
                        className={`${ui.btn} ${ui.btnSecondary}`}
                        onClick={() => setIdentityModal(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${ui.btn} ${ui.btnDanger}`}
                        onClick={handleIdentityDelete}
                        disabled={identitySaving}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "announcements" && (
            <div className={ui.card}>
              <div className={ui.cardTitle}>Announcement Bar Messages</div>
              <div className={ui.hint} style={{ marginBottom: 16 }}>
                These rotate in the customer site's announcement bar in the
                order shown here. Drag to reorder.
              </div>

              {announcements.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    marginBottom: 16,
                  }}
                >
                  {announcements.map((text, index) => (
                    <AnnouncementRow
                      key={index}
                      index={index}
                      text={text}
                      total={announcements.length}
                      canEdit={canEdit}
                      saving={announcementsSaving}
                      onRemove={() => handleRemoveAnnouncement(index)}
                      onMoveUp={() => {
                        if (index === 0) return;
                        const next = [...announcements];
                        [next[index - 1], next[index]] = [
                          next[index],
                          next[index - 1],
                        ];
                        persistAnnouncements(next);
                      }}
                      onMoveDown={() => {
                        if (index === announcements.length - 1) return;
                        const next = [...announcements];
                        [next[index], next[index + 1]] = [
                          next[index + 1],
                          next[index],
                        ];
                        persistAnnouncements(next);
                      }}
                    />
                  ))}
                </div>
              )}

              {canEdit && (
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    className={ui.input}
                    value={newAnnouncement}
                    onChange={(e) => setNewAnnouncement(e.target.value)}
                    placeholder="e.g. WORLDWIDE SHIPPING"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddAnnouncement()
                    }
                  />
                  <button
                    className={`${ui.btn} ${ui.btnPrimary}`}
                    onClick={handleAddAnnouncement}
                    disabled={announcementsSaving || !newAnnouncement.trim()}
                  >
                    {announcementsSaving
                      ? "..."
                      : announcementsSaved
                        ? "✓ Saved"
                        : "Add"}
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === "messages" && (
            <div>
              {canCreate && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 16,
                  }}
                >
                  <button
                    className={`${ui.btn} ${ui.btnPrimary}`}
                    onClick={() => {
                      setMessageForm({ key: "", title: "", description: "" });
                      setMessageModal("create");
                    }}
                  >
                    <Plus
                      size={13}
                      style={{ marginRight: 6, verticalAlign: -2 }}
                    />{" "}
                    Add Message
                  </button>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={ui.card}>
                  <div className={ui.cardTitle}>{msg.key}</div>
                  <div className={ui.form}>
                    <InlineField
                      label="Title"
                      value={msg.title}
                      id={msg.id + "title"}
                      canEdit={canEdit}
                      saving={saving}
                      saved={saved}
                      onSave={(val) => updateMessage(msg.id, "title", val)}
                      placeholder="e.g. Let's Create Together"
                    />
                    <InlineField
                      label="Description"
                      value={msg.description}
                      id={msg.id + "description"}
                      canEdit={canEdit}
                      saving={saving}
                      saved={saved}
                      onSave={(val) =>
                        updateMessage(msg.id, "description", val)
                      }
                      multiline
                      placeholder="Supporting copy shown under the title"
                    />
                  </div>
                </div>
              ))}

              {messageModal === "create" && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}>
                      <div className={ui.modalTitle}>Add Brand Message</div>
                      <button
                        className={ui.modalClose}
                        onClick={() => setMessageModal(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={ui.modalBody}>
                      <div className={ui.form}>
                        <div className={ui.field}>
                          <label className={ui.label}>Key (internal)</label>
                          <input
                            className={ui.input}
                            value={messageForm.key}
                            onChange={(e) =>
                              setMessageForm({
                                ...messageForm,
                                key: e.target.value,
                              })
                            }
                            placeholder="e.g. about_cta"
                          />
                        </div>
                        <div className={ui.field}>
                          <label className={ui.label}>Title</label>
                          <input
                            className={ui.input}
                            value={messageForm.title}
                            onChange={(e) =>
                              setMessageForm({
                                ...messageForm,
                                title: e.target.value,
                              })
                            }
                            placeholder="e.g. Let's Create Together"
                          />
                        </div>
                        <div className={ui.field}>
                          <label className={ui.label}>Description</label>
                          <RichTextarea
                            value={messageForm.description}
                            onChange={(v) =>
                              setMessageForm({ ...messageForm, description: v })
                            }
                            minHeight={80}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button
                        className={`${ui.btn} ${ui.btnSecondary}`}
                        onClick={() => setMessageModal(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${ui.btn} ${ui.btnPrimary}`}
                        onClick={handleMessageCreate}
                        disabled={messageSaving}
                      >
                        {messageSaving ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "values" && (
            <div>
              <div className={ui.pageHeader} style={{ marginBottom: 16 }}>
                <div className={ui.hint}>
                  Drag the handle to reorder how values appear on the homepage.
                </div>
                {canCreate && (
                  <button
                    className={`${ui.btn} ${ui.btnPrimary}`}
                    onClick={() => {
                      setValueForm({ icon: "", title: "", description: "" });
                      setValueModal("create");
                    }}
                  >
                    <Plus
                      size={13}
                      style={{ marginRight: 6, verticalAlign: -2 }}
                    />{" "}
                    Add Value
                  </button>
                )}
              </div>

              {values.length === 0 ? (
                <div className={ui.empty}>
                  <div className={ui.emptyIcon}>◆</div>No brand values yet.
                </div>
              ) : (
                <DragListValues
                  values={values}
                  onReorder={setValues}
                  disabled={!canEdit}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  onEdit={(v) => {
                    setSelectedValue(v);
                    setValueForm(v);
                    setValueModal("edit");
                  }}
                  onDelete={(v) => {
                    setSelectedValue(v);
                    setValueModal("delete");
                  }}
                />
              )}

              {(valueModal === "create" || valueModal === "edit") && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}>
                      <div className={ui.modalTitle}>
                        {valueModal === "create"
                          ? "Add Brand Value"
                          : "Edit Brand Value"}
                      </div>
                      <button
                        className={ui.modalClose}
                        onClick={() => setValueModal(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={ui.modalBody}>
                      <div className={ui.form}>
                        <div className={ui.field}>
                          <label className={ui.label}>Icon Name (Lucide)</label>
                          <input
                            className={ui.input}
                            value={valueForm.icon || ""}
                            onChange={(e) =>
                              setValueForm({
                                ...valueForm,
                                icon: e.target.value,
                              })
                            }
                            placeholder="e.g. Leaf, Heart, Users"
                          />
                        </div>
                        <div className={ui.field}>
                          <label className={ui.label}>Title *</label>
                          <input
                            className={ui.input}
                            value={valueForm.title || ""}
                            onChange={(e) =>
                              setValueForm({
                                ...valueForm,
                                title: e.target.value,
                              })
                            }
                            placeholder="e.g. Sustainably Made"
                          />
                        </div>
                        <div className={ui.field}>
                          <label className={ui.label}>Description *</label>
                          <RichTextarea
                            value={valueForm.description || ""}
                            onChange={(v) =>
                              setValueForm({ ...valueForm, description: v })
                            }
                            minHeight={70}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button
                        className={`${ui.btn} ${ui.btnSecondary}`}
                        onClick={() => setValueModal(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${ui.btn} ${ui.btnPrimary}`}
                        onClick={handleValueSave}
                        disabled={valueSaving}
                      >
                        {valueSaving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {valueModal === "delete" && selectedValue && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}>
                      <div className={ui.modalTitle}>Delete Brand Value</div>
                      <button
                        className={ui.modalClose}
                        onClick={() => setValueModal(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={ui.modalBody}>
                      <div className={ui.confirmText}>
                        Delete <strong>{selectedValue.title}</strong>?
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button
                        className={`${ui.btn} ${ui.btnSecondary}`}
                        onClick={() => setValueModal(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${ui.btn} ${ui.btnDanger}`}
                        onClick={handleValueDelete}
                        disabled={valueSaving}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "designer" && (
            <div>
              {canCreate && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 16,
                  }}
                >
                  <button
                    className={`${ui.btn} ${ui.btnPrimary}`}
                    onClick={() => {
                      setDesignerForm({ key: "", label: "", value: "" });
                      setDesignerModal("create");
                    }}
                  >
                    <Plus
                      size={13}
                      style={{ marginRight: 6, verticalAlign: -2 }}
                    />{" "}
                    Add Field
                  </button>
                </div>
              )}
              {designer.map((item) => (
                <KVFieldCard
                  key={item.id}
                  item={item}
                  canEdit={canEdit}
                  canDelete={false}
                  saving={saving}
                  saved={saved}
                  isImage={item.key === "portrait"}
                  multiline={item.key.includes("bio")}
                  placeholder={
                    item.key.includes("bio")
                      ? "Designer biography"
                      : `Value for "${item.key}"`
                  }
                  onSave={(val) =>
                    updateKV(
                      designer,
                      setDesigner,
                      brandApi.updateDesignerProfile,
                      item.id,
                      val,
                    )
                  }
                  onDelete={() => {}}
                />
              ))}

              {designerModal === "create" && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}>
                      <div className={ui.modalTitle}>
                        Add Designer Profile Field
                      </div>
                      <button
                        className={ui.modalClose}
                        onClick={() => setDesignerModal(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={ui.modalBody}>
                      <div className={ui.form}>
                        <div className={ui.field}>
                          <label className={ui.label}>Key (internal)</label>
                          <input
                            className={ui.input}
                            value={designerForm.key}
                            onChange={(e) =>
                              setDesignerForm({
                                ...designerForm,
                                key: e.target.value,
                              })
                            }
                            placeholder="e.g. instagram"
                          />
                        </div>
                        <div className={ui.field}>
                          <label className={ui.label}>Label</label>
                          <input
                            className={ui.input}
                            value={designerForm.label}
                            onChange={(e) =>
                              setDesignerForm({
                                ...designerForm,
                                label: e.target.value,
                              })
                            }
                            placeholder="e.g. Instagram"
                          />
                        </div>
                        <div className={ui.field}>
                          <label className={ui.label}>Value</label>
                          <input
                            className={ui.input}
                            value={designerForm.value}
                            onChange={(e) =>
                              setDesignerForm({
                                ...designerForm,
                                value: e.target.value,
                              })
                            }
                            placeholder="The value shown on the about page"
                          />
                        </div>
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button
                        className={`${ui.btn} ${ui.btnSecondary}`}
                        onClick={() => setDesignerModal(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${ui.btn} ${ui.btnPrimary}`}
                        onClick={handleDesignerCreate}
                        disabled={designerSaving}
                      >
                        {designerSaving ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "contact" && (
            <div>
              {canCreate && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 16,
                  }}
                >
                  <button
                    className={`${ui.btn} ${ui.btnPrimary}`}
                    onClick={() => {
                      setContactForm({ key: "", label: "", value: "" });
                      setContactModal("create");
                    }}
                  >
                    <Plus
                      size={13}
                      style={{ marginRight: 6, verticalAlign: -2 }}
                    />{" "}
                    Add Contact Value
                  </button>
                </div>
              )}
              {contact.map((item) => (
                <KVFieldCard
                  key={item.id}
                  item={item}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  saving={saving}
                  saved={saved}
                  placeholder={`Value for "${item.key}"`}
                  onSave={(val) =>
                    updateKV(
                      contact,
                      setContact,
                      brandApi.updateContactInfo,
                      item.id,
                      val,
                    )
                  }
                  onDelete={() => {
                    setSelectedContact(item);
                    setContactModal("delete");
                  }}
                />
              ))}

              {contactModal === "create" && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}>
                      <div className={ui.modalTitle}>Add Contact Value</div>
                      <button
                        className={ui.modalClose}
                        onClick={() => setContactModal(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={ui.modalBody}>
                      <div className={ui.form}>
                        <div className={ui.field}>
                          <label className={ui.label}>Key (internal)</label>
                          <input
                            className={ui.input}
                            value={contactForm.key}
                            onChange={(e) =>
                              setContactForm({
                                ...contactForm,
                                key: e.target.value,
                              })
                            }
                            placeholder="e.g. whatsapp"
                          />
                        </div>
                        <div className={ui.field}>
                          <label className={ui.label}>Label</label>
                          <input
                            className={ui.input}
                            value={contactForm.label}
                            onChange={(e) =>
                              setContactForm({
                                ...contactForm,
                                label: e.target.value,
                              })
                            }
                            placeholder="e.g. WhatsApp"
                          />
                        </div>
                        <div className={ui.field}>
                          <label className={ui.label}>Value</label>
                          <input
                            className={ui.input}
                            value={contactForm.value}
                            onChange={(e) =>
                              setContactForm({
                                ...contactForm,
                                value: e.target.value,
                              })
                            }
                            placeholder="e.g. +251 900 000 000"
                          />
                        </div>
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button
                        className={`${ui.btn} ${ui.btnSecondary}`}
                        onClick={() => setContactModal(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${ui.btn} ${ui.btnPrimary}`}
                        onClick={handleContactCreate}
                        disabled={contactSaving}
                      >
                        {contactSaving ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {contactModal === "delete" && selectedContact && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}>
                      <div className={ui.modalTitle}>Delete Contact Value</div>
                      <button
                        className={ui.modalClose}
                        onClick={() => setContactModal(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={ui.modalBody}>
                      <div className={ui.confirmText}>
                        Delete <strong>{selectedContact.label}</strong>?
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button
                        className={`${ui.btn} ${ui.btnSecondary}`}
                        onClick={() => setContactModal(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${ui.btn} ${ui.btnDanger}`}
                        onClick={handleContactDelete}
                        disabled={contactSaving}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "about" && (
            <div>
              {canCreate && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 16,
                  }}
                >
                  <button
                    className={`${ui.btn} ${ui.btnPrimary}`}
                    onClick={() => {
                      setAboutForm({
                        key: "",
                        title: "",
                        content: "",
                        images: [],
                      });
                      setAboutModal("create");
                    }}
                  >
                    <Plus
                      size={13}
                      style={{ marginRight: 6, verticalAlign: -2 }}
                    />{" "}
                    Add About Block
                  </button>
                </div>
              )}
              {about.length === 0 ? (
                <div className={ui.empty}>
                  <div className={ui.emptyIcon}>◱</div>No about blocks yet.
                </div>
              ) : (
                about.map((block) => (
                  <div key={block.id} className={ui.card}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div className={ui.cardTitle}>
                        {block.title || block.key}
                      </div>
                      {canDelete && (
                        <button
                          className={`${ui.iconBtn} ${ui.iconBtnDanger}`}
                          onClick={() => {
                            setSelectedAbout(block);
                            setAboutModal("delete");
                          }}
                          aria-label="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className={ui.form}>
                      <InlineField
                        label="Title"
                        value={block.title}
                        id={block.id + "title"}
                        canEdit={canEdit}
                        saving={saving}
                        saved={saved}
                        onSave={(val) => updateAbout(block.id, "title", val)}
                        placeholder="e.g. Our Story"
                      />
                      <InlineFieldRich
                        label="Content"
                        value={block.content}
                        id={block.id + "content"}
                        canEdit={canEdit}
                        saving={saving}
                        saved={saved}
                        onSave={(val) => updateAbout(block.id, "content", val)}
                      />
                      <div className={ui.field}>
                        <label className={ui.label}>Images</label>
                        <MultiImageUpload
                          value={block.images || []}
                          onChange={(urls) =>
                            updateAbout(block.id, "images", urls)
                          }
                          disabled={!canEdit}
                          label=""
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}

              {aboutModal === "create" && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}>
                      <div className={ui.modalTitle}>Add About Block</div>
                      <button
                        className={ui.modalClose}
                        onClick={() => setAboutModal(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={ui.modalBody}>
                      <div className={ui.form}>
                        <div className={ui.field}>
                          <label className={ui.label}>Key (internal)</label>
                          <input
                            className={ui.input}
                            value={aboutForm.key || ""}
                            onChange={(e) =>
                              setAboutForm({
                                ...aboutForm,
                                key: e.target.value,
                              })
                            }
                            placeholder="e.g. craftsmanship"
                          />
                        </div>
                        <div className={ui.field}>
                          <label className={ui.label}>Title</label>
                          <input
                            className={ui.input}
                            value={aboutForm.title || ""}
                            onChange={(e) =>
                              setAboutForm({
                                ...aboutForm,
                                title: e.target.value,
                              })
                            }
                            placeholder="e.g. Our Craftsmanship"
                          />
                        </div>
                        <div className={ui.field}>
                          <label className={ui.label}>Content</label>
                          <RichTextarea
                            value={aboutForm.content || ""}
                            onChange={(v) =>
                              setAboutForm({ ...aboutForm, content: v })
                            }
                          />
                        </div>
                        <MultiImageUpload
                          label="Images"
                          value={aboutForm.images || []}
                          onChange={(urls) =>
                            setAboutForm({ ...aboutForm, images: urls })
                          }
                        />
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button
                        className={`${ui.btn} ${ui.btnSecondary}`}
                        onClick={() => setAboutModal(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${ui.btn} ${ui.btnPrimary}`}
                        onClick={handleAboutCreate}
                        disabled={aboutSaving}
                      >
                        {aboutSaving ? "Adding..." : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {aboutModal === "delete" && selectedAbout && (
                <div className={ui.overlay}>
                  <div className={ui.modal}>
                    <div className={ui.modalHeader}>
                      <div className={ui.modalTitle}>Delete About Block</div>
                      <button
                        className={ui.modalClose}
                        onClick={() => setAboutModal(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className={ui.modalBody}>
                      <div className={ui.confirmText}>
                        Delete{" "}
                        <strong>
                          {selectedAbout.title || selectedAbout.key}
                        </strong>
                        ?
                      </div>
                    </div>
                    <div className={ui.modalFooter}>
                      <button
                        className={`${ui.btn} ${ui.btnSecondary}`}
                        onClick={() => setAboutModal(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className={`${ui.btn} ${ui.btnDanger}`}
                        onClick={handleAboutDelete}
                        disabled={aboutSaving}
                      >
                        Delete
                      </button>
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

function KVFieldCard({
  item,
  canEdit,
  canDelete,
  saving,
  saved,
  onSave,
  onDelete,
  isImage = false,
  multiline = false,
  placeholder,
}: {
  item: KVItem;
  canEdit: boolean;
  canDelete: boolean;
  saving: string | null;
  saved: string | null;
  onSave: (val: string) => void;
  onDelete: () => void;
  isImage?: boolean;
  multiline?: boolean;
  placeholder?: string;
}) {
  const [local, setLocal] = useState(item.value);
  const changed = local !== item.value;

  return (
    <div className={ui.card}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div className={ui.field} style={{ flex: 1 }}>
          <label className={ui.label}>{item.label}</label>
          {isImage ? (
            <ImageUpload
              value={local}
              onChange={(url) => setLocal(url)}
              disabled={!canEdit}
            />
          ) : multiline ? (
            <RichTextarea
              value={local}
              onChange={setLocal}
              disabled={!canEdit}
              placeholder={placeholder}
            />
          ) : (
            <input
              className={ui.input}
              value={local}
              onChange={(e) => setLocal(e.target.value)}
              disabled={!canEdit}
              placeholder={placeholder}
            />
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            paddingTop: 22,
          }}
        >
          {canEdit && (
            <button
              className={ui.iconBtn}
              style={{ opacity: changed ? 1 : 0.4 }}
              onClick={() => onSave(local)}
              disabled={saving === item.id || !changed}
              aria-label="Save"
              title="Save"
            >
              {saving === item.id ? (
                "…"
              ) : saved === item.id ? (
                "✓"
              ) : (
                <Pencil size={14} />
              )}
            </button>
          )}
          {canDelete && (
            <button
              className={`${ui.iconBtn} ${ui.iconBtnDanger}`}
              onClick={onDelete}
              aria-label="Delete"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InlineField({
  label,
  value,
  id,
  canEdit,
  saving,
  saved,
  onSave,
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string;
  id: string;
  canEdit: boolean;
  saving: string | null;
  saved: string | null;
  onSave: (val: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const [local, setLocal] = useState(value);
  const changed = local !== value;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <div className={ui.field} style={{ flex: 1 }}>
        <label className={ui.label}>{label}</label>
        {multiline ? (
          <textarea
            className={ui.textarea}
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            disabled={!canEdit}
            placeholder={placeholder}
          />
        ) : (
          <input
            className={ui.input}
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            disabled={!canEdit}
            placeholder={placeholder}
          />
        )}
      </div>
      {canEdit && (
        <div style={{ paddingTop: 22 }}>
          <button
            className={ui.iconBtn}
            style={{ opacity: changed ? 1 : 0.3 }}
            disabled={!changed || saving === id}
            onClick={() => onSave(local)}
            aria-label="Save"
          >
            {saving === id ? "…" : saved === id ? "✓" : <Pencil size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

function InlineFieldRich({
  label,
  value,
  id,
  canEdit,
  saving,
  saved,
  onSave,
}: {
  label: string;
  value: string;
  id: string;
  canEdit: boolean;
  saving: string | null;
  saved: string | null;
  onSave: (val: string) => void;
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
          <button
            className={ui.iconBtn}
            style={{ opacity: changed ? 1 : 0.3 }}
            disabled={!changed || saving === id}
            onClick={() => onSave(local)}
            aria-label="Save"
          >
            {saving === id ? "…" : saved === id ? "✓" : <Pencil size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

function DragListValues({
  values,
  onReorder,
  disabled,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: {
  values: BrandValue[];
  onReorder: (v: BrandValue[]) => void;
  disabled: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onEdit: (v: BrandValue) => void;
  onDelete: (v: BrandValue) => void;
}) {
  return (
    <DragList
      items={values}
      onReorder={onReorder}
      disabled={disabled}
      renderItem={(v: BrandValue) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f5f5f5",
                fontSize: 14,
                fontWeight: 700,
                color: "#666",
              }}
            >
              {v.icon ? v.icon.slice(0, 2) : "—"}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{v.title}</div>
              <div
                style={{
                  fontSize: 12,
                  color: "#666",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 420,
                }}
              >
                {v.description}
              </div>
            </div>
          </div>
          <div className={ui.actions}>
            {canEdit && (
              <button
                className={ui.iconBtn}
                onClick={() => onEdit(v)}
                aria-label="Edit"
              >
                <Pencil size={14} />
              </button>
            )}
            {canDelete && (
              <button
                className={`${ui.iconBtn} ${ui.iconBtnDanger}`}
                onClick={() => onDelete(v)}
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    />
  );
}

function AnnouncementRow({
  index,
  text,
  total,
  canEdit,
  saving,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  index: number;
  text: string;
  total: number;
  canEdit: boolean;
  saving: boolean;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        border: "1px solid #eee",
        background: "#fafafa",
      }}
    >
      {canEdit && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            className={ui.iconBtn}
            onClick={onMoveUp}
            disabled={index === 0 || saving}
            aria-label="Move up"
            style={{
              opacity: index === 0 ? 0.25 : 1,
              width: 22,
              height: 22,
              padding: 2,
            }}
          >
            ↑
          </button>
          <button
            type="button"
            className={ui.iconBtn}
            onClick={onMoveDown}
            disabled={index === total - 1 || saving}
            aria-label="Move down"
            style={{
              opacity: index === total - 1 ? 0.25 : 1,
              width: 22,
              height: 22,
              padding: 2,
            }}
          >
            ↓
          </button>
        </div>
      )}

      <span style={{ flex: 1, fontSize: 13 }}>{text}</span>

      <span style={{ fontSize: 11, color: "#ccc", flexShrink: 0 }}>
        {index + 1} / {total}
      </span>

      {canEdit && (
        <button
          type="button"
          className={`${ui.iconBtn} ${ui.iconBtnDanger}`}
          onClick={onRemove}
          disabled={saving}
          aria-label="Remove announcement"
          style={{ flexShrink: 0 }}
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}
