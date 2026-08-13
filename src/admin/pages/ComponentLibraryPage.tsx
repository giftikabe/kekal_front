/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { componentLibraryApi, mediaPlaceholdersApi } from '../api/client';
import { useAuthContext } from '../hooks/AuthContext';
import PreviewFrame from '../components/PreviewFrame';
import ui from '../components/ui.module.css';

interface PropDef {
  name: string;
  label: string;
  type: 'text' | 'richtext' | 'image' | 'video' | 'url' | 'number' | 'boolean';
  bindable: boolean;
  placeholder: any;
}

const CATEGORY_OPTIONS = ['all', 'hero', 'card', 'section', 'navigation', 'form', 'media', 'stats', 'other'];
const PROP_TYPES: PropDef['type'][] = ['text', 'richtext', 'image', 'video', 'url', 'number', 'boolean'];

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

const codeTextareaStyle: React.CSSProperties = {
  background: '#1a1a1a',
  color: '#e2e8f0',
  padding: '16px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '12px',
  border: 'none',
  width: '100%',
  minHeight: '360px',
  resize: 'vertical',
  outline: 'none',
  boxSizing: 'border-box',
};

/** Builds a { [propName]: value } object from propSchema placeholders, for preview. */
function buildPlaceholderProps(propSchema: PropDef[], placeholders: { default_image?: string; default_video?: string }) {
  const out: Record<string, any> = {};
  for (const p of propSchema) {
    if (p.type === 'image') out[p.name] = p.placeholder || placeholders.default_image || '';
    else if (p.type === 'video') out[p.name] = p.placeholder || placeholders.default_video || '';
    else if (p.type === 'boolean') out[p.name] = !!p.placeholder;
    else if (p.type === 'number') out[p.name] = p.placeholder ?? 0;
    else out[p.name] = p.placeholder ?? '';
  }
  return out;
}

export default function ComponentLibraryPage() {
  const { hasPermission } = useAuthContext();

  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [placeholders, setPlaceholders] = useState<{ default_image?: string; default_video?: string }>({});

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'settings'>('preview');

  // Draft code — lives ONLY in browser memory. Never sent anywhere except
  // /publish, and never written to Postgres.
  const [tsxDraft, setTsxDraft] = useState('');
  const [cssDraft, setCssDraft] = useState('');
  const [loadingSource, setLoadingSource] = useState(false);
  const [sourceError, setSourceError] = useState('');

  const [settingsDraft, setSettingsDraft] = useState({ display_name: '', category: '', description: '' });
  const [propSchemaDraft, setPropSchemaDraft] = useState<PropDef[]>([]);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ success: boolean; error?: string; commit_url?: string } | null>(null);

  const [modal, setModal] = useState<'add' | 'delete' | 'publish' | null>(null);
  const [addForm, setAddForm] = useState({ display_name: '', category: 'hero', description: '' });
  const [addPropSchema, setAddPropSchema] = useState<PropDef[]>([]);
  const [addError, setAddError] = useState('');
  const [addSaving, setAddSaving] = useState(false);

  async function loadComponents() {
    try {
      setLoading(true);
      setError('');
      setComponents(await componentLibraryApi.getAll());
    } catch (e: any) {
      setError(e.message || 'Failed to load components');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComponents();
    mediaPlaceholdersApi
      .getAll()
      .then((rows: any[]) => {
        const map: any = {};
        for (const r of rows) map[r.key] = r.url;
        setPlaceholders({ default_image: map.default_image, default_video: map.default_video });
      })
      .catch(() => {});
  }, []);

  async function selectComponent(id: string) {
    setSelectedId(id);
    setActiveTab('preview');
    setPublishResult(null);
    setSourceError('');
    const comp = components.find((c) => c.id === id);
    setSelectedComponent(comp);
    setSettingsDraft({
      display_name: comp?.displayName || '',
      category: comp?.category || 'other',
      description: comp?.description || '',
    });
    setPropSchemaDraft(comp?.propSchema || []);
    setTsxDraft('');
    setCssDraft('');

    if (comp?.status === 'published') {
      setLoadingSource(true);
      try {
        const src = await componentLibraryApi.getSource(id);
        setTsxDraft(src.tsx);
        setCssDraft(src.css || '');
      } catch (e: any) {
        setSourceError(e.message || 'Failed to load source from GitHub');
      } finally {
        setLoadingSource(false);
      }
    }
  }

  async function saveSettings() {
    if (!selectedComponent) return;
    setSaving(true);
    try {
      const updated = await componentLibraryApi.update(selectedComponent.id, {
        ...settingsDraft,
        prop_schema: propSchemaDraft,
      });
      setSelectedComponent(updated);
      await loadComponents();
    } catch (e: any) {
      setError(e.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!selectedComponent) return;
    setPublishing(true);
    setPublishResult(null);
    try {
      const result = await componentLibraryApi.publish(selectedComponent.id, {
        tsx_code: tsxDraft,
        css_code: cssDraft,
      });
      setPublishResult(result as any);
      if ((result as any)?.success) {
        await loadComponents();
        const refreshed = await componentLibraryApi.getOne(selectedComponent.id);
        setSelectedComponent(refreshed);
      }
    } catch (e: any) {
      setPublishResult({ success: false, error: e.message || 'Publish failed' });
    } finally {
      setPublishing(false);
    }
  }

  async function handleDelete() {
    if (!selectedComponent) return;
    try {
      await componentLibraryApi.delete(selectedComponent.id);
      setSelectedComponent(null);
      setSelectedId(null);
      setModal(null);
      await loadComponents();
    } catch (e: any) {
      setError(e.message || 'Failed to delete');
    }
  }

  async function handleAdd() {
    setAddError('');
    if (!addForm.display_name.trim()) return setAddError('Display name is required');
    const name = toPascalCase(addForm.display_name);
    if (!name || !/^[A-Z][A-Za-z0-9]+$/.test(name)) {
      return setAddError(`Could not derive a valid PascalCase name from "${addForm.display_name}".`);
    }
    setAddSaving(true);
    try {
      const created = await componentLibraryApi.create({
        name,
        display_name: addForm.display_name,
        category: addForm.category,
        description: addForm.description,
        prop_schema: addPropSchema,
      });
      await loadComponents();
      setModal(null);
      setAddForm({ display_name: '', category: 'hero', description: '' });
      setAddPropSchema([]);
      await selectComponent((created as any).id);
    } catch (e: any) {
      setAddError(e.message || 'Failed to create component');
    } finally {
      setAddSaving(false);
    }
  }

  function propSchemaEditor(schema: PropDef[], setSchema: (s: PropDef[]) => void) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {schema.map((p, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px 70px 30px', gap: 6, alignItems: 'center' }}>
            <input
              className={ui.input}
              placeholder="propName"
              value={p.name}
              onChange={(e) => {
                const next = [...schema];
                next[i] = { ...p, name: e.target.value };
                setSchema(next);
              }}
            />
            <input
              className={ui.input}
              placeholder="Label shown in builder"
              value={p.label}
              onChange={(e) => {
                const next = [...schema];
                next[i] = { ...p, label: e.target.value };
                setSchema(next);
              }}
            />
            <select
              className={ui.select}
              value={p.type}
              onChange={(e) => {
                const next = [...schema];
                next[i] = { ...p, type: e.target.value as PropDef['type'] };
                setSchema(next);
              }}
            >
              {PROP_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
              <input
                type="checkbox"
                checked={p.bindable}
                onChange={(e) => {
                  const next = [...schema];
                  next[i] = { ...p, bindable: e.target.checked };
                  setSchema(next);
                }}
              />
              bind
            </label>
            <button type="button" className={ui.iconBtnDanger} onClick={() => setSchema(schema.filter((_, idx) => idx !== i))}>
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className={`${ui.btn} ${ui.btnSecondary}`}
          style={{ fontSize: 11, alignSelf: 'flex-start' }}
          onClick={() => setSchema([...schema, { name: '', label: '', type: 'text', bindable: true, placeholder: '' }])}
        >
          <Plus size={12} style={{ verticalAlign: -2, marginRight: 4 }} /> Add prop
        </button>
      </div>
    );
  }

  const filteredComponents = activeCategory === 'all' ? components : components.filter((c) => c.category === activeCategory);
  const previewProps = selectedComponent ? buildPlaceholderProps(propSchemaDraft, placeholders) : {};

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
      {/* LEFT: list */}
      <div style={{ borderRight: '1px solid var(--color-line)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--color-line)', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Component Library</span>
          {hasPermission('brand', 'create') && (
            <button className={`${ui.btn} ${ui.btnPrimary}`} style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => { setModal('add'); setAddError(''); }}>
              + Add
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto', borderBottom: '1px solid var(--color-line)', flexShrink: 0 }}>
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: 'none', border: 'none',
                borderBottom: activeCategory === cat ? '2px solid var(--color-ink)' : '2px solid transparent',
                padding: '8px 12px', fontSize: 12, fontWeight: activeCategory === cat ? 600 : 400,
                cursor: 'pointer', whiteSpace: 'nowrap',
                color: activeCategory === cat ? 'var(--color-ink)' : 'var(--color-mute)',
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading && <div className={ui.loading} style={{ padding: 16 }}>Loading...</div>}
          {error && <div className={ui.errorMsg} style={{ margin: 12 }}>{error}</div>}
          {filteredComponents.map((comp) => (
            <div
              key={comp.id}
              onClick={() => selectComponent(comp.id)}
              style={{ padding: 12, borderBottom: '1px solid var(--color-line)', cursor: 'pointer', background: selectedId === comp.id ? 'var(--color-bone)' : 'transparent' }}
            >
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{comp.displayName}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <span className={`${ui.badge} ${ui.badgeGray}`}>{comp.category}</span>
                <span className={`${ui.badge} ${comp.status === 'published' ? ui.badgeGreen : ui.badgeGray}`}>{comp.status}</span>
                {comp.isCore && <span className={`${ui.badge} ${ui.badgeBlack}`}>Core</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: detail */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!selectedComponent ? (
          <div className={ui.empty} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--color-mute)' }}>Select a component to view details</p>
          </div>
        ) : (
          <>
            <div style={{ padding: 16, borderBottom: '1px solid var(--color-line)', flexShrink: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{selectedComponent.displayName}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <span className={`${ui.badge} ${ui.badgeGray}`}>{selectedComponent.category}</span>
                <span className={`${ui.badge} ${selectedComponent.status === 'published' ? ui.badgeGreen : ui.badgeGray}`}>{selectedComponent.status}</span>
                {selectedComponent.isCore && <span className={`${ui.badge} ${ui.badgeBlack}`}>Core</span>}
              </div>
            </div>

            <div className={ui.tabs} style={{ flexShrink: 0, borderBottom: '1px solid var(--color-line)', paddingLeft: 16 }}>
              {(['preview', 'code', 'settings'] as const).map((tab) => (
                <button key={tab} className={`${ui.tab} ${activeTab === tab ? ui.tabActive : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              {activeTab === 'preview' && (
                <div>
                  {sourceError && <div className={ui.errorMsg} style={{ marginBottom: 12 }}>{sourceError}</div>}
                  {loadingSource ? (
                    <p className={ui.loading}>Loading source from GitHub…</p>
                  ) : !tsxDraft.trim() ? (
                    <p style={{ fontStyle: 'italic', color: 'var(--color-mute)', fontSize: 13 }}>
                      No code yet — write it in the Code tab, or use the AI prompt helper there, then come back here to preview.
                    </p>
                  ) : (
                    <PreviewFrame
                      tsxCode={tsxDraft}
                      cssCode={cssDraft}
                      componentName={selectedComponent.name}
                      props={previewProps}
                      height={420}
                      label="Live preview — placeholder data"
                    />
                  )}
                </div>
              )}

              {activeTab === 'code' && (
                <div>
                  <p style={{ fontSize: 12, color: 'var(--color-mute)', marginBottom: 8 }}>
                    This code is <strong>not saved anywhere</strong> until you hit Publish — it commits directly to
                    <code> src/kekal/components/{selectedComponent.name}.tsx</code> in the frontend repo. Nothing is written to the database.
                  </p>
                  <label className={ui.label}>Component (.tsx)</label>
                  <textarea style={codeTextareaStyle} value={tsxDraft} onChange={(e) => setTsxDraft(e.target.value)} placeholder={`export default function ${selectedComponent.name}(props) { ... }`} />
                  <label className={ui.label} style={{ marginTop: 12, display: 'block' }}>Styles (.module.css) — optional</label>
                  <textarea style={{ ...codeTextareaStyle, minHeight: 160 }} value={cssDraft} onChange={(e) => setCssDraft(e.target.value)} />

                  {publishResult && (
                    <div className={publishResult.success ? ui.badge : ui.errorMsg} style={{ marginTop: 12 }}>
                      {publishResult.success ? (
                        <>
                          ✓ Published.{' '}
                          {publishResult.commit_url && (
                            <a href={publishResult.commit_url} target="_blank" rel="noreferrer">View commit →</a>
                          )}
                        </>
                      ) : (
                        publishResult.error
                      )}
                    </div>
                  )}

                  {hasPermission('brand', 'update') && (
                    <button className={`${ui.btn} ${ui.btnPrimary}`} style={{ marginTop: 12 }} onClick={handlePublish} disabled={publishing || !tsxDraft.trim()}>
                      {publishing ? 'Publishing…' : selectedComponent.status === 'published' ? 'Re-publish to GitHub' : 'Publish to GitHub'}
                    </button>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className={ui.form}>
                  <div className={ui.field}>
                    <label className={ui.label}>Display Name</label>
                    <input className={ui.input} value={settingsDraft.display_name} onChange={(e) => setSettingsDraft((s) => ({ ...s, display_name: e.target.value }))} />
                  </div>
                  <div className={ui.field}>
                    <label className={ui.label}>Category</label>
                    <select className={ui.select} value={settingsDraft.category} onChange={(e) => setSettingsDraft((s) => ({ ...s, category: e.target.value }))}>
                      {CATEGORY_OPTIONS.filter((c) => c !== 'all').map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div className={ui.field}>
                    <label className={ui.label}>Description</label>
                    <textarea className={ui.textarea} rows={3} value={settingsDraft.description} onChange={(e) => setSettingsDraft((s) => ({ ...s, description: e.target.value }))} />
                  </div>
                  <div className={ui.field}>
                    <label className={ui.label}>Props (defines what shows up as editable in Page Builder)</label>
                    {propSchemaEditor(propSchemaDraft, setPropSchemaDraft)}
                  </div>
                  {hasPermission('brand', 'update') && (
                    <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={saveSettings} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--color-line)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
              {hasPermission('brand', 'delete') ? (
                <button className={`${ui.btn} ${ui.btnDanger}`} disabled={selectedComponent.isCore} onClick={() => setModal('delete')}>
                  Delete
                </button>
              ) : <span />}
              {selectedComponent.status === 'published' && <span style={{ color: '#2d8a4e', fontSize: 13, fontWeight: 500 }}>✓ Live on GitHub</span>}
            </div>
          </>
        )}
      </div>

      {/* ADD MODAL */}
      {modal === 'add' && (
        <div className={ui.overlay}>
          <div className={ui.modal} style={{ maxWidth: 640, width: '100%' }}>
            <div className={ui.modalHeader}>
              <h2 className={ui.modalTitle}>Add Component</h2>
              <button className={ui.modalClose} onClick={() => setModal(null)}>✕</button>
            </div>
            <div className={ui.modalBody}>
              {addError && <div className={ui.errorMsg} style={{ marginBottom: 12 }}>{addError}</div>}
              <div className={ui.form}>
                <div className={ui.field}>
                  <label className={ui.label}>Display Name *</label>
                  <input className={ui.input} value={addForm.display_name} onChange={(e) => setAddForm((f) => ({ ...f, display_name: e.target.value }))} />
                  {addForm.display_name && <span className={ui.hint}>Component name: <strong>{toPascalCase(addForm.display_name) || '(invalid)'}</strong></span>}
                </div>
                <div className={ui.field}>
                  <label className={ui.label}>Category *</label>
                  <select className={ui.select} value={addForm.category} onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value }))}>
                    {CATEGORY_OPTIONS.filter((c) => c !== 'all').map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className={ui.field}>
                  <label className={ui.label}>Description</label>
                  <textarea className={ui.textarea} rows={2} value={addForm.description} onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))} />
                </div>
                <div className={ui.field}>
                  <label className={ui.label}>Props</label>
                  {propSchemaEditor(addPropSchema, setAddPropSchema)}
                </div>
              </div>
              <p className={ui.hint} style={{ marginTop: 12 }}>
                This just registers the component. You'll write/paste its code and Publish from the detail panel next.
              </p>
            </div>
            <div className={ui.modalFooter}>
              <button className={ui.btn} onClick={() => setModal(null)}>Cancel</button>
              <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={handleAdd} disabled={addSaving}>
                {addSaving ? 'Creating...' : 'Create Draft'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {modal === 'delete' && selectedComponent && (
        <div className={ui.overlay}>
          <div className={ui.modal}>
            <div className={ui.modalHeader}>
              <h2 className={ui.modalTitle}>Delete Component</h2>
              <button className={ui.modalClose} onClick={() => setModal(null)}>✕</button>
            </div>
            <div className={ui.modalBody}>
              <p className={ui.confirmText}>Delete {selectedComponent.displayName}?</p>
              <p className={ui.confirmSub}>
                {selectedComponent.status === 'published' ? 'This also removes its file(s) from GitHub.' : ''} This cannot be undone.
              </p>
            </div>
            <div className={ui.modalFooter}>
              <button className={ui.btn} onClick={() => setModal(null)}>Cancel</button>
              <button className={`${ui.btn} ${ui.btnDanger}`} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
