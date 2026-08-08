/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { componentLibraryApi } from '../api/client';
import { useAuthContext } from '../hooks/AuthContext';
import ui from '../components/ui.module.css';

const CATEGORY_OPTIONS = ['all', 'hero', 'card', 'section', 'navigation', 'form', 'media', 'stats', 'other'];

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

const AI_PROMPT = `Generate a React TypeScript component for KEKAL Studio.

Tech stack: React 18, TypeScript, CSS Modules (import styles from './Name.module.css')

Available CSS variables:
--color-ink (#141414), --color-paper (#fff), --color-bone (#f7f5f1), --color-mute (#6b6b6b)
--font-display (Playfair Display serif), --font-body (Inter sans-serif)
--space-sm (1rem), --space-md (clamp 1.5-2rem), --space-lg (clamp 2.5-3.5rem)
--text-display-xl/lg/md/sm (fluid display sizes), --text-body-lg/body/body-sm/label

Component name: [REPLACE]
Description: [DESCRIBE WHAT THE COMPONENT DOES AND LOOKS LIKE]

Requirements:
- Functional component, TypeScript props interface, default export
- All content as props with placeholder defaults (no hardcoded real content)
- Mobile-first responsive CSS using only the CSS variables above
- No external dependencies except lucide-react for icons
- No inline styles — CSS Modules only`;

const codeBlockStyle: React.CSSProperties = {
  background: '#1a1a1a',
  color: '#e2e8f0',
  padding: '16px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '12px',
  overflowX: 'auto',
  margin: 0,
  whiteSpace: 'pre-wrap',
};

const codeTextareaStyle: React.CSSProperties = {
  background: '#1a1a1a',
  color: '#e2e8f0',
  padding: '16px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '12px',
  border: 'none',
  width: '100%',
  minHeight: '400px',
  resize: 'vertical',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function ComponentLibraryPage() {
  const { hasPermission } = useAuthContext();

  // List state
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Selection / detail state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'settings'>('preview');
  const [activeCodeTab, setActiveCodeTab] = useState<'tsx' | 'css'>('tsx');

  // Editing state
  const [editingTsx, setEditingTsx] = useState(false);
  const [editingCss, setEditingCss] = useState(false);
  const [tsxDraft, setTsxDraft] = useState('');
  const [cssDraft, setCssDraft] = useState('');
  const [settingsDraft, setSettingsDraft] = useState({ display_name: '', category: '', description: '' });
  const [saving, setSaving] = useState(false);

  // Modal / publish state
  const [modal, setModal] = useState<'add' | 'delete' | 'publish' | null>(null);
  const [publishResult, setPublishResult] = useState<{ success: boolean; commit_url?: string; error?: string } | null>(null);
  const [publishing, setPublishing] = useState(false);

  // Add modal state
  const [addForm, setAddForm] = useState({
    display_name: '',
    category: 'hero',
    description: '',
    tsx_code: '',
    css_code: '',
  });
  const [addError, setAddError] = useState('');
  const [addSaving, setAddSaving] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load list
  async function loadComponents() {
    try {
      setLoading(true);
      setError('');
      const data = await componentLibraryApi.getAll();
      setComponents(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load components');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadComponents(); }, []);

  // Select component
  async function selectComponent(id: string) {
    setSelectedId(id);
    setSelectedComponent(null);
    setActiveTab('preview');
    setEditingTsx(false);
    setEditingCss(false);
    try {
      const data = await componentLibraryApi.getOne(id);
      setSelectedComponent(data);
      setTsxDraft(data.tsxCode || '');
      setCssDraft(data.cssCode || '');
      setSettingsDraft({
        display_name: data.displayName || '',
        category: data.category || 'other',
        description: data.description || '',
      });
    } catch (e: any) {
      setError(e.message || 'Failed to load component');
    }
  }

  // Save TSX
  async function saveTsx() {
    if (!selectedComponent) return;
    setSaving(true);
    try {
      const updated = await componentLibraryApi.update(selectedComponent.id, { tsx_code: tsxDraft });
      setSelectedComponent(updated);
      setEditingTsx(false);
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  // Save CSS
  async function saveCss() {
    if (!selectedComponent) return;
    setSaving(true);
    try {
      const updated = await componentLibraryApi.update(selectedComponent.id, { css_code: cssDraft });
      setSelectedComponent(updated);
      setEditingCss(false);
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  // Save settings
  async function saveSettings() {
    if (!selectedComponent) return;
    setSaving(true);
    try {
      const updated = await componentLibraryApi.update(selectedComponent.id, settingsDraft);
      setSelectedComponent(updated);
      await loadComponents();
    } catch (e: any) {
      setError(e.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  // Delete
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

  // Publish
  async function handlePublish() {
    if (!selectedComponent) return;
    setPublishing(true);
    setPublishResult(null);
    try {
      const result = await componentLibraryApi.publish(selectedComponent.id);
      setPublishResult(result);
      if (result.success) {
        const updated = await componentLibraryApi.getOne(selectedComponent.id);
        setSelectedComponent(updated);
        await loadComponents();
        setTimeout(() => { setModal(null); setPublishResult(null); }, 3000);
      }
    } catch (e: any) {
      setPublishResult({ success: false, error: e.message || 'Publish failed' });
    } finally {
      setPublishing(false);
    }
  }

  // Add component
  async function handleAdd() {
    setAddError('');
    if (!addForm.display_name.trim()) { setAddError('Display name is required'); return; }
    if (!addForm.category) { setAddError('Category is required'); return; }
    const name = toPascalCase(addForm.display_name);
    if (!name || !/^[A-Z][A-Za-z0-9]+$/.test(name)) {
      setAddError(`Could not derive a valid PascalCase name from "${addForm.display_name}". Please use simple words.`);
      return;
    }
    setAddSaving(true);
    try {
      const created = await componentLibraryApi.create({
        name,
        display_name: addForm.display_name,
        category: addForm.category,
        description: addForm.description,
        tsx_code: addForm.tsx_code,
        css_code: addForm.css_code,
      });
      await loadComponents();
      setModal(null);
      setAddForm({ display_name: '', category: 'hero', description: '', tsx_code: '', css_code: '' });
      setPromptOpen(false);
      await selectComponent(created.id);
    } catch (e: any) {
      setAddError(e.message || 'Failed to create component');
    } finally {
      setAddSaving(false);
    }
  }

  function copyPrompt() {
    navigator.clipboard.writeText(AI_PROMPT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const filteredComponents = activeCategory === 'all'
    ? components
    : components.filter((c) => c.category === activeCategory);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>

      {/* ── LEFT PANEL ── */}
      <div style={{ borderRight: '1px solid var(--color-line)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--color-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Component Library</span>
          {hasPermission('brand', 'create') && (
            <button className={`${ui.btn} ${ui.btnPrimary}`} style={{ fontSize: '12px', padding: '4px 10px' }} onClick={() => { setModal('add'); setAddError(''); }}>
              + Add
            </button>
          )}
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: '0', overflowX: 'auto', borderBottom: '1px solid var(--color-line)', flexShrink: 0 }}>
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeCategory === cat ? '2px solid var(--color-ink)' : '2px solid transparent',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: activeCategory === cat ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                color: activeCategory === cat ? 'var(--color-ink)' : 'var(--color-mute)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Component list */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading && <div className={ui.loading} style={{ padding: '16px' }}>Loading...</div>}
          {error && <div className={ui.errorMsg} style={{ margin: '12px' }}>{error}</div>}
          {!loading && filteredComponents.length === 0 && (
            <div className={ui.empty} style={{ padding: '24px 16px', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-mute)', fontSize: '13px' }}>No components in this category</p>
            </div>
          )}
          {filteredComponents.map((comp) => (
            <div
              key={comp.id}
              onClick={() => selectComponent(comp.id)}
              style={{
                padding: '12px',
                borderBottom: '1px solid var(--color-line)',
                cursor: 'pointer',
                background: selectedId === comp.id ? 'var(--color-bone)' : 'transparent',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>{comp.displayName}</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                <span className={`${ui.badge} ${ui.badgeGray}`}>{comp.category}</span>
                <span className={`${ui.badge} ${comp.status === 'published' ? ui.badgeGreen : ui.badgeGray}`}>
                  {comp.status}
                </span>
                {comp.isCore && <span className={`${ui.badge} ${ui.badgeBlack}`}>Core</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!selectedComponent ? (
          <div className={ui.empty} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--color-mute)' }}>Select a component to view details</p>
          </div>
        ) : (
          <>
            {/* Detail header */}
            <div style={{ padding: '16px', borderBottom: '1px solid var(--color-line)', flexShrink: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '6px' }}>{selectedComponent.displayName}</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                <span className={`${ui.badge} ${ui.badgeGray}`}>{selectedComponent.category}</span>
                <span className={`${ui.badge} ${selectedComponent.status === 'published' ? ui.badgeGreen : ui.badgeGray}`}>
                  {selectedComponent.status}
                </span>
                {selectedComponent.isCore && <span className={`${ui.badge} ${ui.badgeBlack}`}>Core</span>}
              </div>
            </div>

            {/* Tabs */}
            <div className={ui.tabs} style={{ flexShrink: 0, borderBottom: '1px solid var(--color-line)', paddingLeft: '16px' }}>
              {(['preview', 'code', 'settings'] as const).map((tab) => (
                <button
                  key={tab}
                  className={`${ui.tab} ${activeTab === tab ? ui.tabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

              {/* PREVIEW TAB */}
              {activeTab === 'preview' && (
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--color-mute)', marginBottom: '8px' }}>
                    Code preview — paste into an AI tool to generate changes.
                  </p>
                  {selectedComponent.tsxCode ? (
                    <pre style={codeBlockStyle}>
                      {selectedComponent.tsxCode.split('\n').slice(0, 30).join('\n')}
                      {selectedComponent.tsxCode.split('\n').length > 30 ? '\n// ... (truncated)' : ''}
                    </pre>
                  ) : (
                    <p style={{ fontStyle: 'italic', color: 'var(--color-mute)', fontSize: '13px' }}>
                      No code yet. Go to the Code tab to add component code.
                    </p>
                  )}
                </div>
              )}

              {/* CODE TAB */}
              {activeTab === 'code' && (
                <div>
                  {/* Code sub-tabs */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    {(['tsx', 'css'] as const).map((ct) => (
                      <button
                        key={ct}
                        onClick={() => { setActiveCodeTab(ct); setEditingTsx(false); setEditingCss(false); }}
                        style={{
                          background: 'none',
                          border: 'none',
                          borderBottom: activeCodeTab === ct ? '2px solid var(--color-ink)' : '2px solid transparent',
                          padding: '4px 8px',
                          fontSize: '13px',
                          fontWeight: activeCodeTab === ct ? 600 : 400,
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          color: activeCodeTab === ct ? 'var(--color-ink)' : 'var(--color-mute)',
                        }}
                      >
                        {ct === 'tsx' ? 'Component (.tsx)' : 'Styles (.module.css)'}
                      </button>
                    ))}
                  </div>

                  {/* TSX sub-tab */}
                  {activeCodeTab === 'tsx' && (
                    <div>
                      {!editingTsx ? (
                        <div style={{ position: 'relative' }}>
                          {hasPermission('brand', 'update') && (
                            <button
                              className={ui.iconBtn}
                              title="Edit"
                              onClick={() => { setTsxDraft(selectedComponent.tsxCode || ''); setEditingTsx(true); }}
                              style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 1 }}
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          <pre style={codeBlockStyle}>{selectedComponent.tsxCode || '// No TSX code yet'}</pre>
                        </div>
                      ) : (
                        <div>
                          <textarea
                            style={codeTextareaStyle}
                            value={tsxDraft}
                            onChange={(e) => setTsxDraft(e.target.value)}
                          />
                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={saveTsx} disabled={saving}>
                              {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button className={ui.btn} onClick={() => setEditingTsx(false)}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* CSS sub-tab */}
                  {activeCodeTab === 'css' && (
                    <div>
                      {!editingCss ? (
                        <div style={{ position: 'relative' }}>
                          {hasPermission('brand', 'update') && (
                            <button
                              className={ui.iconBtn}
                              title="Edit"
                              onClick={() => { setCssDraft(selectedComponent.cssCode || ''); setEditingCss(true); }}
                              style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 1 }}
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          <pre style={codeBlockStyle}>{selectedComponent.cssCode || '/* No CSS code yet */'}</pre>
                        </div>
                      ) : (
                        <div>
                          <textarea
                            style={codeTextareaStyle}
                            value={cssDraft}
                            onChange={(e) => setCssDraft(e.target.value)}
                          />
                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={saveCss} disabled={saving}>
                              {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button className={ui.btn} onClick={() => setEditingCss(false)}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className={ui.form}>
                  <div className={ui.field}>
                    <label className={ui.label}>Display Name</label>
                    <input
                      className={ui.input}
                      value={settingsDraft.display_name}
                      onChange={(e) => setSettingsDraft((s) => ({ ...s, display_name: e.target.value }))}
                    />
                  </div>
                  <div className={ui.field}>
                    <label className={ui.label}>Category</label>
                    <select
                      className={ui.select}
                      value={settingsDraft.category}
                      onChange={(e) => setSettingsDraft((s) => ({ ...s, category: e.target.value }))}
                    >
                      {CATEGORY_OPTIONS.filter((c) => c !== 'all').map((cat) => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className={ui.field}>
                    <label className={ui.label}>Description</label>
                    <textarea
                      className={ui.textarea}
                      rows={3}
                      value={settingsDraft.description}
                      onChange={(e) => setSettingsDraft((s) => ({ ...s, description: e.target.value }))}
                    />
                  </div>
                  {hasPermission('brand', 'update') && (
                    <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={saveSettings} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ── BOTTOM ACTION BAR ── */}
            <div style={{ borderTop: '1px solid var(--color-line)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              {/* Delete */}
              {hasPermission('brand', 'delete') && (
                <button
                  className={`${ui.btn} ${ui.btnDanger}`}
                  disabled={selectedComponent.isCore}
                  title={selectedComponent.isCore ? 'Core components cannot be deleted' : undefined}
                  onClick={() => setModal('delete')}
                >
                  Delete
                </button>
              )}
              {!hasPermission('brand', 'delete') && <span />}

              {/* Publish */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {selectedComponent.status === 'published' && (
                  <span style={{ color: '#2d8a4e', fontSize: '13px', fontWeight: 500 }}>✓ Published</span>
                )}
                {hasPermission('brand', 'update') && (
                  <button
                    className={`${ui.btn} ${selectedComponent.status === 'published' ? ui.btnSecondary : ui.btnPrimary}`}
                    onClick={() => { setModal('publish'); setPublishResult(null); }}
                  >
                    {selectedComponent.status === 'published' ? 'Re-publish' : 'Publish to Repository'}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── ADD MODAL ── */}
      {modal === 'add' && (
        <div className={ui.overlay}>
          <div className={ui.modal} style={{ maxWidth: '720px', width: '100%' }}>
            <div className={ui.modalHeader}>
              <h2 className={ui.modalTitle}>Add Component</h2>
              <button className={ui.modalClose} onClick={() => setModal(null)}><X size={18} /></button>
            </div>
            <div className={ui.modalBody}>
              {addError && <div className={ui.errorMsg} style={{ marginBottom: '12px' }}>{addError}</div>}

              {/* Section 1: Basic Info */}
              <div className={ui.form}>
                <div className={ui.field}>
                  <label className={ui.label}>Display Name <span style={{ color: 'red' }}>*</span></label>
                  <input
                    className={ui.input}
                    placeholder="e.g. Hero Banner"
                    value={addForm.display_name}
                    onChange={(e) => setAddForm((f) => ({ ...f, display_name: e.target.value }))}
                  />
                  {addForm.display_name && (
                    <span className={ui.hint}>Component name: <strong>{toPascalCase(addForm.display_name) || '(invalid)'}</strong></span>
                  )}
                </div>
                <div className={ui.field}>
                  <label className={ui.label}>Category <span style={{ color: 'red' }}>*</span></label>
                  <select
                    className={ui.select}
                    value={addForm.category}
                    onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value }))}
                  >
                    {CATEGORY_OPTIONS.filter((c) => c !== 'all').map((cat) => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className={ui.field}>
                  <label className={ui.label}>Description</label>
                  <textarea
                    className={ui.textarea}
                    rows={2}
                    placeholder="What does this component do?"
                    value={addForm.description}
                    onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>
              </div>

              {/* Section 2: TSX */}
              <div className={ui.field} style={{ marginTop: '16px' }}>
                <label className={ui.label}>Component Code (.tsx)</label>
                <textarea
                  style={{ ...codeTextareaStyle, minHeight: '280px', borderRadius: '4px' }}
                  placeholder={'// Paste your TSX component code here\n// export default function ComponentName() { ... }'}
                  value={addForm.tsx_code}
                  onChange={(e) => setAddForm((f) => ({ ...f, tsx_code: e.target.value }))}
                />
              </div>

              {/* Section 3: CSS */}
              <div className={ui.field} style={{ marginTop: '12px' }}>
                <label className={ui.label}>Styles (.module.css) <span className={ui.hint} style={{ marginLeft: '6px' }}>Optional</span></label>
                <textarea
                  style={{ ...codeTextareaStyle, minHeight: '140px', borderRadius: '4px' }}
                  placeholder={'/* Paste your CSS module styles here */'}
                  value={addForm.css_code}
                  onChange={(e) => setAddForm((f) => ({ ...f, css_code: e.target.value }))}
                />
              </div>

              {/* Section 4: AI Prompt accordion */}
              <div style={{ marginTop: '16px', border: '1px solid var(--color-line)', borderRadius: '4px' }}>
                <button
                  onClick={() => setPromptOpen((o) => !o)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: '10px 14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 500,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  Need help writing the code?
                  <span>{promptOpen ? '▲' : '▼'}</span>
                </button>
                {promptOpen && (
                  <div style={{ padding: '0 14px 14px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--color-ink)' }}>
                      Use this prompt with any AI tool
                    </p>
                    <textarea
                      className={ui.textarea}
                      readOnly
                      value={AI_PROMPT}
                      style={{ fontFamily: 'monospace', fontSize: '11px', minHeight: '220px' }}
                    />
                    <button
                      className={`${ui.btn} ${ui.btnSecondary}`}
                      style={{ marginTop: '8px', fontSize: '12px' }}
                      onClick={copyPrompt}
                    >
                      {copied ? '✓ Copied!' : 'Copy to Clipboard'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={ui.modalFooter}>
              <button className={ui.btn} onClick={() => setModal(null)}>Cancel</button>
              <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={handleAdd} disabled={addSaving}>
                {addSaving ? 'Creating...' : 'Create Component'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {modal === 'delete' && selectedComponent && (
        <div className={ui.overlay}>
          <div className={ui.modal}>
            <div className={ui.modalHeader}>
              <h2 className={ui.modalTitle}>Delete Component</h2>
              <button className={ui.modalClose} onClick={() => setModal(null)}><X size={18} /></button>
            </div>
            <div className={ui.modalBody}>
              <p className={ui.confirmText}>Delete {selectedComponent.displayName}?</p>
              <p className={ui.confirmSub}>This action cannot be undone.</p>
            </div>
            <div className={ui.modalFooter}>
              <button className={ui.btn} onClick={() => setModal(null)}>Cancel</button>
              <button className={`${ui.btn} ${ui.btnDanger}`} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── PUBLISH MODAL ── */}
      {modal === 'publish' && selectedComponent && (
        <div className={ui.overlay}>
          <div className={ui.modal}>
            <div className={ui.modalHeader}>
              <h2 className={ui.modalTitle}>Publish Component</h2>
              <button className={ui.modalClose} onClick={() => { setModal(null); setPublishResult(null); }}><X size={18} /></button>
            </div>
            <div className={ui.modalBody}>
              {!publishResult && (
                <>
                  <p className={ui.confirmText}>
                    This will commit <strong>{selectedComponent.name}.tsx</strong> to{' '}
                    <strong>giftikabe/kekal_frontend</strong> and trigger an automatic deployment.
                  </p>
                  <p className={ui.confirmSub}>
                    The component will be live after deployment completes (usually 30–90 seconds).
                  </p>
                </>
              )}
              {publishResult && publishResult.success && (
                <div>
                  <p style={{ color: '#2d8a4e', fontWeight: 600, marginBottom: '8px' }}>✓ Published successfully!</p>
                  {publishResult.commit_url && (
                    <a
                      href={publishResult.commit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--color-focus)', fontSize: '13px' }}
                    >
                      ✓ Published — View commit →
                    </a>
                  )}
                </div>
              )}
              {publishResult && !publishResult.success && (
                <p style={{ color: 'red', fontSize: '13px' }}>{publishResult.error || 'Publish failed'}</p>
              )}
            </div>
            <div className={ui.modalFooter}>
              <button className={ui.btn} onClick={() => { setModal(null); setPublishResult(null); }}>
                {publishResult?.success ? 'Close' : 'Cancel'}
              </button>
              {!publishResult && (
                <button className={`${ui.btn} ${ui.btnPrimary}`} onClick={handlePublish} disabled={publishing}>
                  {publishing ? 'Publishing...' : 'Publish Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}