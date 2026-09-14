import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useContentContext } from '../context/ContentContext';
import defaultContent from '../content/defaultContent';
import type { SiteContent } from '../content/types';
import PreviewPane from './PreviewPane';
import {
  MetaSection, ThemeSection, NavbarSection, HeroSection, AboutSection,
  ServicesSection, PortfolioSection, ClientsSection, CertificationsSection,
  ContactSection, FooterSection, LegalSection,
} from './sections/SectionEditors';

// ── Design tokens ─────────────────────────────────────────────
const C = {
  bg: '#0D0F13',
  surface: '#161820',
  surfaceHover: '#1E2028',
  border: 'rgba(255,255,255,0.08)',
  text: '#E8E8E8',
  textMuted: '#6A6E7A',
  accent: '#6B9BD0',
  accentDim: 'rgba(107,155,208,0.15)',
  danger: '#E74C3C',
  success: '#2ECC71',
  warning: '#F39C12',
  fontSans: '"Manrope", sans-serif',
  fontDisplay: '"Oswald", sans-serif',
};

// ── Sidebar sections ──────────────────────────────────────────
const SECTIONS = [
  { key: 'meta',           label: 'SEO / Meta'        },
  { key: 'theme',          label: 'Theme Colors'       },
  { key: 'navbar',         label: 'Navbar'             },
  { key: 'hero',           label: 'Hero'               },
  { key: 'about',          label: 'About'              },
  { key: 'services',       label: 'Sectors'            },
  { key: 'portfolio',      label: 'Infrastructure'     },
  { key: 'clients',        label: 'Clients'            },
  { key: 'certifications', label: 'Certifications'     },
  { key: 'contact',        label: 'Contact'            },
  { key: 'footer',         label: 'Footer'             },
  { key: 'legal',          label: 'Legal'              },
];

const SECTION_MAP: Record<string, React.FC> = {
  meta: MetaSection,
  theme: ThemeSection,
  navbar: NavbarSection,
  hero: HeroSection,
  about: AboutSection,
  services: ServicesSection,
  portfolio: PortfolioSection,
  clients: ClientsSection,
  certifications: CertificationsSection,
  contact: ContactSection,
  footer: FooterSection,
  legal: LegalSection,
};

// ── Shape validator (minimal — checks top-level keys) ─────────
function validateImport(obj: unknown): obj is Partial<SiteContent> {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  const validKeys = new Set(Object.keys(defaultContent));
  const incoming = Object.keys(obj as object);
  // Must have at least one valid key; must not have completely alien keys
  const hasValid = incoming.some(k => validKeys.has(k));
  const allKnown = incoming.every(k => validKeys.has(k));
  return hasValid && allKnown;
}

// ── Top bar ───────────────────────────────────────────────────
function TopBar({
  isMobile, isDirty, onSave, onExport, onImport, onReset, onUndo, canUndo, onDiscard,
  previewVisible, setPreviewVisible, mobileView, setMobileView,
  drawerOpen, setDrawerOpen, moreMenuOpen, setMoreMenuOpen,
}: {
  isMobile: boolean;
  isDirty: boolean;
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onDiscard: () => void;
  previewVisible: boolean;
  setPreviewVisible: (v: boolean) => void;
  mobileView: 'editor' | 'preview';
  setMobileView: (v: 'editor' | 'preview') => void;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  moreMenuOpen: boolean;
  setMoreMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (isMobile) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 12px', height: '52px', flexShrink: 0,
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        fontFamily: C.fontSans, position: 'relative', zIndex: 100,
      }}>
        {/* Left: Menu toggle + Brand + Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <button
            onClick={() => setDrawerOpen(o => !o)}
            title="Open Sections"
            aria-label="Open Sections menu"
            style={{
              background: drawerOpen ? C.accentDim : 'transparent',
              border: `1px solid ${drawerOpen ? C.accent : C.border}`,
              color: drawerOpen ? C.accent : C.text, borderRadius: '6px',
              width: '34px', height: '34px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', fontSize: '1.1rem',
              flexShrink: 0, padding: 0,
            }}
          >
            ☰
          </button>

          <div style={{ fontFamily: C.fontDisplay, fontSize: '0.95rem', color: C.text, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
            BUNNY <span style={{ color: C.accent }}>CMS</span>
          </div>

          <div
            title={isDirty ? 'Unsaved changes' : 'Saved'}
            style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: isDirty ? C.warning : C.success, flexShrink: 0,
            }}
          />
        </div>

        {/* Right: View toggle + More actions + Save */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {/* Segmented view switcher */}
          <div style={{
            display: 'flex', background: 'rgba(0,0,0,0.35)',
            borderRadius: '6px', padding: '2px', border: `1px solid ${C.border}`,
          }}>
            <button
              onClick={() => setMobileView('editor')}
              style={{
                background: mobileView === 'editor' ? C.accentDim : 'transparent',
                color: mobileView === 'editor' ? C.accent : C.textMuted,
                border: 'none', borderRadius: '4px', padding: '5px 9px',
                fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer',
                fontFamily: C.fontSans, transition: 'all 0.15s',
              }}
            >
              Form
            </button>
            <button
              onClick={() => setMobileView('preview')}
              style={{
                background: mobileView === 'preview' ? C.accentDim : 'transparent',
                color: mobileView === 'preview' ? C.accent : C.textMuted,
                border: 'none', borderRadius: '4px', padding: '5px 9px',
                fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer',
                fontFamily: C.fontSans, transition: 'all 0.15s',
              }}
            >
              Live
            </button>
          </div>

          {/* More actions button (⋮) */}
          <button
            onClick={() => setMoreMenuOpen(o => !o)}
            title="More actions"
            aria-label="More actions"
            style={{
              background: moreMenuOpen ? C.accentDim : 'transparent',
              border: `1px solid ${moreMenuOpen ? C.accent : C.border}`,
              color: moreMenuOpen ? C.accent : C.text, borderRadius: '6px',
              width: '32px', height: '32px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', fontSize: '1.1rem',
              padding: 0, flexShrink: 0,
            }}
          >
            ⋮
          </button>

          {/* SAVE */}
          <button
            onClick={onSave}
            style={{
              background: isDirty ? C.accent : 'rgba(107,155,208,0.3)',
              border: 'none', color: isDirty ? '#000' : C.textMuted,
              padding: '7px 12px', borderRadius: '6px',
              fontFamily: C.fontDisplay, fontWeight: '700', letterSpacing: '0.08em',
              fontSize: '0.75rem', cursor: isDirty ? 'pointer' : 'default',
              transition: 'all 0.2s', flexShrink: 0,
            }}
          >
            SAVE
          </button>
        </div>

        {/* More actions dropdown menu */}
        {moreMenuOpen && (
          <>
            <div
              onClick={() => setMoreMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 998 }}
            />
            <div style={{
              position: 'absolute', top: '50px', right: '10px', width: '210px',
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: '8px', boxShadow: '0 12px 32px rgba(0,0,0,0.85)',
              padding: '6px', zIndex: 999, display: 'flex', flexDirection: 'column', gap: '2px',
            }}>
              <MenuBtn onClick={() => { onUndo(); setMoreMenuOpen(false); }} disabled={!canUndo}>
                ↺ Undo Last Save
              </MenuBtn>
              <MenuBtn onClick={() => { onImport(); setMoreMenuOpen(false); }}>
                ⬇ Import JSON
              </MenuBtn>
              <MenuBtn onClick={() => { onExport(); setMoreMenuOpen(false); }}>
                ⬆ Export JSON
              </MenuBtn>
              <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
              <MenuBtn onClick={() => { onDiscard(); setMoreMenuOpen(false); }} disabled={!isDirty} danger>
                ✕ Discard Unsaved Changes
              </MenuBtn>
              <MenuBtn onClick={() => { onReset(); setMoreMenuOpen(false); }} danger>
                ⚠ Factory Reset
              </MenuBtn>
            </div>
          </>
        )}
      </div>
    );
  }

  // Desktop TopBar
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '0 20px', height: '52px', flexShrink: 0,
      background: C.surface, borderBottom: `1px solid ${C.border}`,
      fontFamily: C.fontSans,
    }}>
      {/* Brand */}
      <div style={{ fontFamily: C.fontDisplay, fontSize: '1rem', color: C.text, letterSpacing: '0.08em', marginRight: '8px', whiteSpace: 'nowrap' }}>
        BUNNY <span style={{ color: C.accent }}>CMS</span>
      </div>

      {/* Dirty indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '4px' }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isDirty ? C.warning : C.success, flexShrink: 0 }} />
        <span style={{ fontSize: '0.7rem', color: C.textMuted, whiteSpace: 'nowrap' }}>
          {isDirty ? 'Unsaved changes' : 'Saved'}
        </span>
      </div>

      <div style={{ flex: 1 }} />

      <TopBtn onClick={onUndo} disabled={!canUndo} title="Undo last save">Undo</TopBtn>
      <TopBtn onClick={() => setPreviewVisible(!previewVisible)} title={previewVisible ? 'Hide Preview' : 'Show Preview'}>
        {previewVisible ? 'Hide Preview' : 'Preview'}
      </TopBtn>
      <TopBtn onClick={onImport} title="Import JSON">Import</TopBtn>
      <TopBtn onClick={onExport} title="Export JSON">Export</TopBtn>
      <TopBtn onClick={onDiscard} disabled={!isDirty} title="Discard unsaved changes and reload from cloud" danger>Discard</TopBtn>
      <TopBtn onClick={onReset} title="Reset all content to factory defaults" danger>Factory Reset</TopBtn>
      <button
        onClick={onSave}
        style={{
          background: isDirty ? C.accent : 'rgba(107,155,208,0.3)',
          border: 'none', color: isDirty ? '#000' : C.textMuted,
          padding: '8px 20px', borderRadius: '6px',
          fontFamily: C.fontDisplay, fontWeight: '700', letterSpacing: '0.1em',
          fontSize: '0.78rem', cursor: isDirty ? 'pointer' : 'default',
          transition: 'all 0.2s',
        }}
      >
        SAVE
      </button>
    </div>
  );
}

function TopBtn({ children, onClick, disabled, danger, title }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; danger?: boolean; title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        background: 'transparent', border: `1px solid ${C.border}`,
        color: danger ? C.danger : disabled ? C.textMuted : C.text,
        borderColor: danger ? `${C.danger}40` : C.border,
        padding: '6px 12px', borderRadius: '6px',
        fontFamily: C.fontSans, fontSize: '0.75rem', fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
        opacity: disabled ? 0.4 : 1, transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  );
}

function MenuBtn({ children, onClick, disabled, danger }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', textAlign: 'left', background: 'transparent',
        border: 'none', borderRadius: '4px', padding: '8px 10px',
        color: danger ? C.danger : disabled ? C.textMuted : C.text,
        fontSize: '0.78rem', fontFamily: C.fontSans, fontWeight: '500',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = C.surfaceHover; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </button>
  );
}

// ── Main controller ───────────────────────────────────────────
export default function ControllerApp() {
  const { content, setContent, patchContent, resetToDefault, canUndo, undo, isSaving, isLoading, lastError, clearError, reloadContent, isReloading } = useContentContext();
  const [activeSection, setActiveSection] = useState('meta');
  const [isDirty, setIsDirty] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(true);

  // Mobile responsiveness state
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 860);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 860;
      setIsMobile(mobile);
      if (!mobile) {
        setDrawerOpen(false);
        setMoreMenuOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Resizable form panel width (px). Drag the handle to change.
  const [formWidth, setFormWidth] = useState(480);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedContentRef = useRef<SiteContent>(content);
  const previewPaneRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  // Measure preview pane and compute CSS scale so site renders at 1280px then shrinks to fit
  useEffect(() => {
    if (!previewVisible && !isMobile) return;
    if (isMobile && mobileView !== 'preview') return;
    const el = previewPaneRef.current;
    if (!el) return;
    const SITE_WIDTH = 1280;
    const measure = () => {
      const w = el.clientWidth;
      setPreviewScale(w > 0 ? Math.min(1, w / SITE_WIDTH) : 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [previewVisible, formWidth, isMobile, mobileView]);

  // Drag-to-resize the form panel
  const onDragMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = formWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [formWidth]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - dragStartX.current;
      const next = Math.max(300, Math.min(900, dragStartWidth.current + delta));
      setFormWidth(next);
    };
    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Track dirty state: compare current content to last saved
  useEffect(() => {
    const a = JSON.stringify(content);
    const b = JSON.stringify(savedContentRef.current);
    setIsDirty(a !== b);
  }, [content]);

  const handleSave = useCallback(async () => {
    await setContent(content); // async PATCH in API mode
    savedContentRef.current = content;
    setIsDirty(false);
  }, [content, setContent]);

  const handleExport = useCallback(() => {
    const json = JSON.stringify(content, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'content-export.json';
    a.click(); URL.revokeObjectURL(url);
  }, [content]);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (!validateImport(parsed)) {
          setImportError('Import failed: JSON shape does not match SiteContent schema. Only recognised top-level keys are accepted.');
          setImportSuccess('');
          return;
        }
        // Merge imported partial over current content
        const merged = { ...content };
        (Object.keys(parsed) as Array<keyof SiteContent>).forEach(k => {
          (merged as any)[k] = { ...(content as any)[k], ...(parsed as any)[k] };
        });
        setContent(merged);
        savedContentRef.current = merged;
        setIsDirty(false);
        setImportError('');
        setImportSuccess(`Imported successfully from "${file.name}".`);
        setTimeout(() => setImportSuccess(''), 4000);
      } catch {
        setImportError('Import failed: could not parse JSON. Check the file is valid JSON.');
        setImportSuccess('');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [content, setContent]);

  const handleReset = useCallback(() => {
    if (!confirmReset) { setConfirmReset(true); return; }
    resetToDefault();
    savedContentRef.current = defaultContent;
    setIsDirty(false);
    setConfirmReset(false);
  }, [confirmReset, resetToDefault]);

  const handleUndo = useCallback(() => {
    undo();
    setIsDirty(false);
  }, [undo]);

  const handleDiscard = useCallback(async () => {
    if (confirm('Discard all unsaved changes and reload the last saved version from the cloud?')) {
      await reloadContent();
      // After reload, contentRef.current will have been updated by React state.
      // Force isDirty to false — the new content IS the saved state.
      setIsDirty(false);
    }
  }, [reloadContent]);

  const SectionEditor = SECTION_MAP[activeSection];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100dvh', maxHeight: '100dvh', width: '100%', maxWidth: '100vw',
      background: C.bg, color: C.text, fontFamily: C.fontSans, overflow: 'hidden',
    }}>
      {/* Hidden file input for import */}
      <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileChange} />

      {/* ── TOP BAR ── */}
      <TopBar
        isMobile={isMobile}
        isDirty={isDirty}
        onSave={handleSave}
        onExport={handleExport}
        onImport={handleImport}
        onReset={confirmReset ? handleReset : () => setConfirmReset(true)}
        onUndo={handleUndo}
        canUndo={canUndo}
        onDiscard={handleDiscard}
        previewVisible={previewVisible}
        setPreviewVisible={setPreviewVisible}
        mobileView={mobileView}
        setMobileView={setMobileView}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        moreMenuOpen={moreMenuOpen}
        setMoreMenuOpen={setMoreMenuOpen}
      />

      {/* ── CONFIRM RESET BANNER ── */}
      {confirmReset && (
        <div style={{
          background: `${C.danger}20`, borderBottom: `1px solid ${C.danger}40`,
          padding: isMobile ? '10px 14px' : '10px 20px', display: 'flex', alignItems: 'center', gap: '10px',
          flexWrap: 'wrap', fontSize: '0.82rem',
        }}>
          <span style={{ color: C.danger, fontWeight: '700', flex: isMobile ? '1 1 100%' : 'none' }}>⚠ This will erase all edits and restore default content.</span>
          <button onClick={handleReset} style={{ background: C.danger, border: 'none', color: '#FFF', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '0.78rem' }}>
            Yes, Reset Everything
          </button>
          <button onClick={() => setConfirmReset(false)} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.textMuted, padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem' }}>
            Cancel
          </button>
        </div>
      )}

      {/* ── IMPORT MESSAGES ── */}
      {importError && (
        <div style={{ background: `${C.danger}20`, borderBottom: `1px solid ${C.danger}40`, padding: isMobile ? '10px 14px' : '10px 20px', fontSize: '0.82rem', color: C.danger, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', wordBreak: 'break-word' }}>
          <span style={{ flex: 1 }}>{importError}</span>
          <button onClick={() => setImportError('')} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: '1rem' }}>✕</button>
        </div>
      )}
      {importSuccess && (
        <div style={{ background: `${C.success}20`, borderBottom: `1px solid ${C.success}40`, padding: isMobile ? '10px 14px' : '10px 20px', fontSize: '0.82rem', color: C.success, wordBreak: 'break-word' }}>
          ✓ {importSuccess}
        </div>
      )}

      {/* ── API ERROR BANNER ── */}
      {lastError && (
        <div style={{ background: `${C.danger}20`, borderBottom: `1px solid ${C.danger}40`, padding: isMobile ? '10px 14px' : '10px 20px', fontSize: '0.82rem', color: C.danger, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', wordBreak: 'break-word' }}>
          <span style={{ flex: 1 }}>⚠ {lastError}</span>
          <button onClick={clearError} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: '1rem' }}>✕</button>
        </div>
      )}

      {/* ── SAVING INDICATOR ── */}
      {isSaving && (
        <div style={{ background: `${C.accent}18`, borderBottom: `1px solid ${C.accent}30`, padding: '8px 20px', fontSize: '0.78rem', color: C.accent }}>
          ⟳ Saving to API…
        </div>
      )}

      {/* ── RELOADING INDICATOR ── */}
      {isReloading && (
        <div style={{ background: `${C.warning}18`, borderBottom: `1px solid ${C.warning}30`, padding: '8px 20px', fontSize: '0.78rem', color: C.warning }}>
          ↻ Reloading saved content from cloud…
        </div>
      )}

      {/* ── INITIAL LOAD OVERLAY ── */}
      {isLoading && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 999, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontFamily: C.fontDisplay, fontSize: '1.5rem', color: C.accent, letterSpacing: '0.1em' }}>BUNNY CMS</div>
          <div style={{ color: C.textMuted, fontSize: '0.8rem' }}>Loading content from API…</div>
        </div>
      )}

      {/* ── RESPONSIVE BODY ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* MOBILE BACKDROP FOR DRAWER */}
        {isMobile && drawerOpen && (
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(2px)', zIndex: 900,
            }}
          />
        )}

        {/* SIDEBAR (Slide-over drawer on mobile, left column on desktop) */}
        <nav style={{
          ...(isMobile ? {
            position: 'fixed', top: 0, left: 0, bottom: 0,
            width: 'min(280px, 82vw)', zIndex: 901,
            transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: drawerOpen ? '8px 0 32px rgba(0,0,0,0.85)' : 'none',
            borderRight: `1px solid ${C.border}`,
          } : {
            width: '220px', flexShrink: 0,
            borderRight: `1px solid ${C.border}`,
          }),
          background: C.surface,
          overflowY: 'auto', padding: isMobile ? '16px 12px' : '12px 8px',
          display: 'flex', flexDirection: 'column', gap: '2px',
        }}>
          {isMobile && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', padding: '0 4px' }}>
              <span style={{ fontFamily: C.fontDisplay, fontSize: '1rem', color: C.text, letterSpacing: '0.08em' }}>SECTIONS</span>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close sections"
                style={{ background: 'transparent', border: 'none', color: C.textMuted, fontSize: '1.2rem', cursor: 'pointer', padding: '4px' }}
              >
                ✕
              </button>
            </div>
          )}

          {SECTIONS.map(sec => (
            <button
              key={sec.key}
              onClick={() => {
                setActiveSection(sec.key);
                if (isMobile) {
                  setDrawerOpen(false);
                  setMobileView('editor');
                }
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: isMobile ? '12px 14px' : '10px 12px',
                borderRadius: '6px', border: 'none',
                background: activeSection === sec.key ? C.accentDim : 'transparent',
                color: activeSection === sec.key ? C.accent : C.textMuted,
                cursor: 'pointer', fontFamily: C.fontSans,
                fontSize: isMobile ? '0.88rem' : '0.82rem',
                fontWeight: activeSection === sec.key ? '700' : '500',
                textAlign: 'left', width: '100%', transition: 'all 0.15s',
                borderLeft: `2px solid ${activeSection === sec.key ? C.accent : 'transparent'}`,
              }}
            >
              {sec.label}
            </button>
          ))}

          {/* Footer links */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: `1px solid ${C.border}` }}>
            <a href="/" target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', padding: '8px 12px', color: C.textMuted, fontSize: '0.75rem', textDecoration: 'none', letterSpacing: '0.05em' }}>
              ↗ View Live Site
            </a>
          </div>
        </nav>

        {/* MAIN FORM PANEL */}
        {(!isMobile || mobileView === 'editor') && (
          <div style={{
            width: !isMobile && previewVisible ? `${formWidth}px` : undefined,
            flex: !isMobile && previewVisible ? '0 0 auto' : 1,
            minWidth: !isMobile && previewVisible ? '300px' : 0,
            overflowY: 'auto',
            padding: isMobile ? '16px 14px' : '28px 32px',
          }}>
            {/* Quick Section Switcher chip on mobile */}
            {isMobile && (
              <button
                onClick={() => setDrawerOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '9px 12px', marginBottom: '16px',
                  background: 'rgba(107,155,208,0.08)', border: `1px solid ${C.accent}40`,
                  borderRadius: '6px', color: C.accent, fontSize: '0.78rem',
                  cursor: 'pointer', fontFamily: C.fontSans, fontWeight: '600',
                }}
              >
                <span>Section: <strong style={{ color: C.text }}>{SECTIONS.find(s => s.key === activeSection)?.label}</strong></span>
                <span style={{ fontSize: '0.72rem', color: C.accent }}>Change ▾</span>
              </button>
            )}

            {/* Section title */}
            <div style={{ marginBottom: isMobile ? '16px' : '24px', paddingBottom: isMobile ? '12px' : '16px', borderBottom: `1px solid ${C.border}` }}>
              <h2 style={{
                fontFamily: C.fontDisplay, fontSize: isMobile ? '1.2rem' : '1.4rem', color: C.text,
                textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0,
              }}>
                {SECTIONS.find(s => s.key === activeSection)?.label}
              </h2>
              <div style={{ fontSize: '0.72rem', color: C.textMuted, marginTop: '4px' }}>
                {isMobile
                  ? 'Changes update live in preview. Tap SAVE to publish.'
                  : <>Changes sync to the preview in real time. Click <strong style={{ color: C.text }}>SAVE</strong> to publish to the live site.</>}
              </div>
            </div>

            {/* Active section editor */}
            {SectionEditor && <SectionEditor />}
          </div>
        )}

        {/* DRAG HANDLE (Desktop only) */}
        {!isMobile && previewVisible && (
          <div
            onMouseDown={onDragMouseDown}
            style={{
              width: '6px', flexShrink: 0, cursor: 'col-resize',
              background: C.border, transition: 'background 0.15s',
              position: 'relative',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = C.accent)}
            onMouseLeave={e => (e.currentTarget.style.background = C.border)}
          />
        )}

        {/* RIGHT PREVIEW PANE */}
        {((!isMobile && previewVisible) || (isMobile && mobileView === 'preview')) && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, width: isMobile ? '100%' : undefined }}>
            {/* Preview header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 14px', background: C.surface, borderBottom: `1px solid ${C.border}`,
              fontSize: '0.72rem', color: C.textMuted, flexShrink: 0,
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.success, flexShrink: 0 }} />
              <span style={{ fontWeight: '600', color: C.text }}>Live Preview</span>
              <span style={{ marginLeft: '4px', opacity: 0.6 }}>
                {Math.round(previewScale * 100)}%
              </span>
              {isMobile ? (
                <button
                  onClick={() => setMobileView('editor')}
                  style={{
                    marginLeft: 'auto', background: C.accentDim, border: `1px solid ${C.accent}40`,
                    color: C.accent, borderRadius: '4px', padding: '3px 8px',
                    fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer', fontFamily: C.fontSans,
                  }}
                >
                  ‹ Edit Form
                </button>
              ) : (
                <span style={{ marginLeft: 'auto', opacity: 0.5 }}>Updates instantly as you type</span>
              )}
            </div>

            {/* Scaled preview container — site renders at 1280px then scales to fit */}
            <div
              ref={previewPaneRef}
              style={{
                flex: 1, overflow: 'hidden', position: 'relative',
              }}
            >
              <div style={{
                width: '1280px',
                transform: `scale(${previewScale})`,
                transformOrigin: 'top left',
                // Height expands naturally; parent clips overflow
                height: `${previewScale > 0 ? (100 / previewScale) : 100}%`,
                overflow: 'auto',
              }}>
                <PreviewPane />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
