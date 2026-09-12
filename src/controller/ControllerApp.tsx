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
  { key: 'meta',           label: 'SEO / Meta',       icon: '🔍' },
  { key: 'theme',          label: 'Theme Colors',      icon: '🎨' },
  { key: 'navbar',         label: 'Navbar',            icon: '☰' },
  { key: 'hero',           label: 'Hero',              icon: '⚡' },
  { key: 'about',          label: 'About',             icon: '🏭' },
  { key: 'services',       label: 'Sectors',           icon: '✈' },
  { key: 'portfolio',      label: 'Portfolio / Infra', icon: '⚙' },
  { key: 'clients',        label: 'Clients',           icon: '🤝' },
  { key: 'certifications', label: 'Certifications',    icon: '🏆' },
  { key: 'contact',        label: 'Contact',           icon: '📬' },
  { key: 'footer',         label: 'Footer',            icon: '📄' },
  { key: 'legal',          label: 'Legal',             icon: '⚖' },
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
  isDirty, onSave, onExport, onImport, onReset, onUndo, canUndo, previewVisible, setPreviewVisible,
}: {
  isDirty: boolean;
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  previewVisible: boolean;
  setPreviewVisible: (v: boolean) => void;
}) {
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

      {/* Undo */}
      <TopBtn onClick={onUndo} disabled={!canUndo} title="Undo last save">↩ Undo</TopBtn>
      {/* Preview toggle */}
      <TopBtn onClick={() => setPreviewVisible(!previewVisible)} title={previewVisible ? 'Hide Preview' : 'Show Preview'}>
        {previewVisible ? '⧉ Hide Preview' : '⧉ Preview'}
      </TopBtn>
      {/* Import */}
      <TopBtn onClick={onImport} title="Import JSON">⬆ Import</TopBtn>
      {/* Export */}
      <TopBtn onClick={onExport} title="Export JSON">⬇ Export</TopBtn>
      {/* Reset */}
      <TopBtn onClick={onReset} title="Reset all content to defaults" danger>⟲ Reset</TopBtn>
      {/* Save */}
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

// ── Main controller ───────────────────────────────────────────
export default function ControllerApp() {
  const { content, setContent, patchContent, resetToDefault, canUndo, undo, isSaving, isLoading, lastError, clearError } = useContentContext();
  const [activeSection, setActiveSection] = useState('meta');
  const [isDirty, setIsDirty] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedContentRef = useRef<SiteContent>(content);

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

  const SectionEditor = SECTION_MAP[activeSection];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw',
      background: C.bg, color: C.text, fontFamily: C.fontSans, overflow: 'hidden',
    }}>
      {/* Hidden file input for import */}
      <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileChange} />

      {/* ── TOP BAR ── */}
      <TopBar
        isDirty={isDirty}
        onSave={handleSave}
        onExport={handleExport}
        onImport={handleImport}
        onReset={confirmReset ? handleReset : () => setConfirmReset(true)}
        onUndo={handleUndo}
        canUndo={canUndo}
        previewVisible={previewVisible}
        setPreviewVisible={setPreviewVisible}
      />

      {/* ── CONFIRM RESET BANNER ── */}
      {confirmReset && (
        <div style={{
          background: `${C.danger}20`, borderBottom: `1px solid ${C.danger}40`,
          padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px',
          fontSize: '0.82rem',
        }}>
          <span style={{ color: C.danger, fontWeight: '700' }}>⚠ This will erase all edits and restore default content.</span>
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
        <div style={{ background: `${C.danger}20`, borderBottom: `1px solid ${C.danger}40`, padding: '10px 20px', fontSize: '0.82rem', color: C.danger, display: 'flex', justifyContent: 'space-between' }}>
          {importError}
          <button onClick={() => setImportError('')} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer' }}>✕</button>
        </div>
      )}
      {importSuccess && (
        <div style={{ background: `${C.success}20`, borderBottom: `1px solid ${C.success}40`, padding: '10px 20px', fontSize: '0.82rem', color: C.success }}>
          ✓ {importSuccess}
        </div>
      )}

      {/* ── API ERROR BANNER ── */}
      {lastError && (
        <div style={{ background: `${C.danger}20`, borderBottom: `1px solid ${C.danger}40`, padding: '10px 20px', fontSize: '0.82rem', color: C.danger, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠ {lastError}</span>
          <button onClick={clearError} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* ── SAVING INDICATOR ── */}
      {isSaving && (
        <div style={{ background: `${C.accent}18`, borderBottom: `1px solid ${C.accent}30`, padding: '8px 20px', fontSize: '0.78rem', color: C.accent }}>
          ⟳ Saving to API…
        </div>
      )}

      {/* ── INITIAL LOAD OVERLAY ── */}
      {isLoading && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 999, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontFamily: C.fontDisplay, fontSize: '1.5rem', color: C.accent, letterSpacing: '0.1em' }}>BUNNY CMS</div>
          <div style={{ color: C.textMuted, fontSize: '0.8rem' }}>Loading content from API…</div>
        </div>
      )}

      {/* ── THREE-PANE BODY ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT SIDEBAR */}
        <nav style={{
          width: '220px', flexShrink: 0,
          background: C.surface, borderRight: `1px solid ${C.border}`,
          overflowY: 'auto', padding: '12px 8px',
          display: 'flex', flexDirection: 'column', gap: '2px',
        }}>
          {SECTIONS.map(sec => (
            <button
              key={sec.key}
              onClick={() => setActiveSection(sec.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '6px', border: 'none',
                background: activeSection === sec.key ? C.accentDim : 'transparent',
                color: activeSection === sec.key ? C.accent : C.textMuted,
                cursor: 'pointer', fontFamily: C.fontSans, fontSize: '0.82rem',
                fontWeight: activeSection === sec.key ? '700' : '500',
                textAlign: 'left', width: '100%', transition: 'all 0.15s',
                borderLeft: `2px solid ${activeSection === sec.key ? C.accent : 'transparent'}`,
              }}
            >
              <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{sec.icon}</span>
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
        <div style={{
          flex: previewVisible ? '0 0 560px' : 1,
          minWidth: previewVisible ? '380px' : 0,
          overflowY: 'auto', padding: '28px 32px',
          borderRight: previewVisible ? `1px solid ${C.border}` : 'none',
        }}>
          {/* Section title */}
          <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${C.border}` }}>
            <h2 style={{
              fontFamily: C.fontDisplay, fontSize: '1.4rem', color: C.text,
              textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0,
            }}>
              {SECTIONS.find(s => s.key === activeSection)?.icon}{' '}
              {SECTIONS.find(s => s.key === activeSection)?.label}
            </h2>
            <div style={{ fontSize: '0.72rem', color: C.textMuted, marginTop: '4px' }}>
              Changes sync to the preview in real time. Click <strong style={{ color: C.text }}>SAVE</strong> to publish to the live site.
            </div>
          </div>

          {/* Active section editor */}
          {SectionEditor && <SectionEditor />}
        </div>

        {/* RIGHT PREVIEW PANE */}
        {previewVisible && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', background: C.surface, borderBottom: `1px solid ${C.border}`,
              fontSize: '0.72rem', color: C.textMuted, flexShrink: 0,
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.success }} />
              Live Preview
              <span style={{ marginLeft: 'auto', opacity: 0.5 }}>Updates instantly as you type</span>
            </div>
            <PreviewPane />
          </div>
)}
      </div>
    </div>
  );
}
