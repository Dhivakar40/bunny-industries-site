import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { SiteContent } from '../content/types';
import defaultContent from '../content/defaultContent';

// ── Config ────────────────────────────────────────────────────
const STORAGE_KEY = 'bunny-cms-content';
const MAX_UNDO = 10;
const POLL_INTERVAL_MS = 30_000; // 30 seconds

// API base URL injected at build time.
// - bunnycontroller sets VITE_API_BASE_URL=https://bunnyweb.vercel.app (cross-origin PATCH)
// - bunnyweb sets nothing → API_BASE is '' → fetch uses relative /api/content (same-origin ✓)
// - local dev with no env var → USE_API=false → localStorage fallback
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
// import.meta.env.PROD is Vite's built-in flag: true for ALL production builds, false in dev.
// In production, the API is always reachable (either cross-origin or same-origin).
// Only skip it in local dev when no explicit base URL is configured.
const USE_API = import.meta.env.PROD || API_BASE.length > 0;

// Controller secret — only needed by the controller build; undefined on the site build.
const API_SECRET = (import.meta.env.VITE_CONTROLLER_API_SECRET as string | undefined) ?? '';

// ── Merge helper ─────────────────────────────────────────────
function mergeContent(saved: Partial<SiteContent>): SiteContent {
  const merged: SiteContent = { ...defaultContent };
  (Object.keys(saved) as Array<keyof SiteContent>).forEach((key) => {
    if (saved[key] !== undefined) {
      // @ts-ignore — dynamic key merge
      merged[key] = { ...defaultContent[key], ...saved[key] };
    }
  });

  // Ensure "SERVICES" is completely removed from navbar and legacy "CLIENTS" is displayed as "VALUED CUSTOMERS"
  if (merged.navbar && Array.isArray(merged.navbar.navItems)) {
    merged.navbar.navItems = merged.navbar.navItems
      .filter((item) => !item.label.toUpperCase().includes('SERVICE'))
      .map((item) => {
        if (item.label.trim().toUpperCase() === 'CLIENTS') {
          return { ...item, label: 'VALUED CUSTOMERS' };
        }
        return item;
      });
  }

  // Ensure Industry Certifications has exactly 4 cards (2 in row 1, 2 in row 2)
  if (merged.certifications) {
    if (Array.isArray(merged.certifications.certifications)) {
      merged.certifications.certifications = merged.certifications.certifications.map((c) => {
        if (c.text === 'ISO 9001:2015' || c.text.toUpperCase().includes('ISO')) {
          return {
            ...c,
            text: 'UDAYAM REGISTERED',
            desc: 'Ministry of MSME',
            img: 'udyam_icon.svg',
            color: '#FF9933',
            metallic: 'linear-gradient(135deg, #FF9933 0%, #FFB366 25%, #E67300 50%, #FFE6CC 75%, #FF9933 100%)'
          };
        }
        return c;
      }).slice(0, 2);
    }
    if (Array.isArray(merged.certifications.newCertificates)) {
      merged.certifications.newCertificates = merged.certifications.newCertificates.filter(
        (c) => !c.text.toLowerCase().includes('udyam')
      ).slice(0, 2);
    }
  }

  // Ensure footer unit mapLinks are preserved if missing in older saves
  if (merged.footer) {
    if (merged.footer.unit1 && !merged.footer.unit1.mapLink) {
      merged.footer.unit1.mapLink = defaultContent.footer.unit1.mapLink;
    }
    if (merged.footer.unit2 && !merged.footer.unit2.mapLink) {
      merged.footer.unit2.mapLink = defaultContent.footer.unit2.mapLink;
    }
    // Ensure footer quickLinks includes "Valued Customers"
    if (Array.isArray(merged.footer.quickLinks)) {
      const hasValuedCustomers = merged.footer.quickLinks.some(
        (item) => item.label.toUpperCase().includes('CUSTOMER') || item.label.toUpperCase().includes('CLIENT')
      );
      if (!hasValuedCustomers) {
        const infraIndex = merged.footer.quickLinks.findIndex(
          (item) => item.label.toUpperCase().includes('INFRA')
        );
        if (infraIndex !== -1) {
          merged.footer.quickLinks.splice(infraIndex + 1, 0, { label: 'Valued Customers' });
        } else {
          merged.footer.quickLinks.push({ label: 'Valued Customers' });
        }
      }
    }
  }

  return merged;
}

// ── API helpers ───────────────────────────────────────────────
async function apiFetchContent(): Promise<SiteContent> {
  const res = await fetch(`${API_BASE}/api/content`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`GET /api/content → ${res.status}`);
  const json = await res.json();
  // If Redis is empty (fresh deployment before seed), return defaultContent
  if (!json || Object.keys(json).length === 0) return defaultContent;
  return mergeContent(json as Partial<SiteContent>);
}

async function apiPatchContent(patch: Partial<SiteContent>): Promise<SiteContent> {
  const res = await fetch(`${API_BASE}/api/content`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_SECRET}`,
    },
    body: JSON.stringify(patch),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`PATCH /api/content → ${res.status}`);
  const json = await res.json();
  return mergeContent(json as Partial<SiteContent>);
}

// ── localStorage helpers (dev fallback when USE_API=false) ────
function lsPersist(next: SiteContent) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* quota */ }
}

function lsRead(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return mergeContent(JSON.parse(raw) as Partial<SiteContent>);
  } catch { /* corrupt */ }
  return defaultContent;
}

// ── Context type ─────────────────────────────────────────────
export interface ContentContextValue {
  content: SiteContent;
  /** Set full content + push undo. In API mode: also PATCHes the API. */
  setContent: (next: SiteContent) => Promise<void>;
  /**
   * Patch one top-level section locally (instant for UI feedback).
   * In dev/localStorage mode: also writes to localStorage for iframe sync.
   * In API mode: does NOT call the API — use setContent (Save) for that.
   */
  patchContent: <K extends keyof SiteContent>(key: K, sectionData: Partial<SiteContent[K]>) => void;
  resetToDefault: () => Promise<void>;
  undoStack: SiteContent[];
  canUndo: boolean;
  undo: () => void;
  /** true while the initial fetch is in progress */
  isLoading: boolean;
  /** true while a PATCH/save is in progress */
  isSaving: boolean;
  /** last error from an API call, null if none */
  lastError: string | null;
  clearError: () => void;
  /** Reload content from the API/localStorage (does NOT wipe Redis data) */
  reloadContent: () => Promise<void>;
  /** true while reloadContent is running */
  isReloading: boolean;
}

const ContentContext = createContext<ContentContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────
export function ContentProvider({
  children,
  mode = 'site',
}: {
  children: React.ReactNode;
  /**
   * 'site'       → read-only: fetches on mount + polls + re-fetches on tab focus.
   *                The postMessage listener is kept for future-proofing but is not
   *                triggered by the current architecture (no iframe preview).
   * 'controller' → read/write: fetches on mount, PATCHes API on setContent.
   *                In localStorage mode (dev): also persists for cross-tab sync.
   * 'dev'        → Both behaviors; used in dev when both routes share one provider.
   *                Defaults to 'controller' behavior so the controller route has write access.
   */
  mode?: 'site' | 'controller' | 'dev';
}) {
  const [content, setContentState] = useState<SiteContent>(defaultContent);
  const [undoStack, setUndoStack] = useState<SiteContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const contentRef = useRef(content);

  useEffect(() => { contentRef.current = content; }, [content]);

  // ── Initial load ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        let loaded: SiteContent;
        if (USE_API) {
          loaded = await apiFetchContent();
        } else {
          loaded = lsRead();
        }
        if (!cancelled) setContentState(loaded);
      } catch (err: any) {
        if (!cancelled) {
          console.error('[ContentProvider] initial load failed:', err);
          setLastError(`Failed to load content: ${err.message}. Using defaults.`);
          // Fall back to localStorage → defaultContent
          setContentState(USE_API ? defaultContent : lsRead());
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line

  // ── Site: polling + visibility-change re-fetch ───────────────
  useEffect(() => {
    if (mode !== 'site') return;

    const refetch = async () => {
      try {
        const fresh = USE_API ? await apiFetchContent() : lsRead();
        setContentState(fresh);
      } catch { /* silently ignore poll failures */ }
    };

    // 30-second interval
    const interval = setInterval(refetch, POLL_INTERVAL_MS);

    // Re-fetch immediately when tab becomes visible again
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refetch();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Re-fetch when controller posts a message
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === 'cms-content-updated') refetch();
    };
    window.addEventListener('message', onMessage);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('message', onMessage);
    };
  }, [mode]);

  // ── Dev/localStorage mode: cross-tab sync via storage event ──
  useEffect(() => {
    if (USE_API) return; // API mode doesn't need storage events
    const handler = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || e.newValue === null) return;
      try { setContentState(mergeContent(JSON.parse(e.newValue) as Partial<SiteContent>)); } catch { /* ignore */ }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // ── patchContent: local state update (+ localStorage in dev) ─
  const patchContent = useCallback(<K extends keyof SiteContent>(
    key: K,
    sectionData: Partial<SiteContent[K]>
  ) => {
    setContentState(prev => {
      const next = { ...prev, [key]: { ...prev[key], ...sectionData } } as SiteContent;
      if (!USE_API) lsPersist(next); // dev: keep cross-tab storage in sync on every keystroke
      return next;
    });
  }, []);

  // ── setContent: save + push undo ─────────────────────────────
  const setContent = useCallback(async (next: SiteContent) => {
    setUndoStack(prev => [contentRef.current, ...prev].slice(0, MAX_UNDO));
    setContentState(next);

    if (USE_API) {
      setIsSaving(true);
      setLastError(null);
      try {
        await apiPatchContent(next as Partial<SiteContent>);
        // No iframe to notify — the controller's preview is same-tree React,
        // so it already reflects the new state via shared in-memory state.
      } catch (err: any) {
        setLastError(`Save failed: ${err.message}`);
        console.error('[setContent API]', err);
      } finally {
        setIsSaving(false);
      }
    } else {
      // localStorage mode (dev)
      lsPersist(next);
    }
  }, []);

  // ── resetToDefault ───────────────────────────────────────────
  const resetToDefault = useCallback(async () => {
    setUndoStack(prev => [contentRef.current, ...prev].slice(0, MAX_UNDO));
    setContentState(defaultContent);
    if (USE_API) {
      setIsSaving(true);
      try {
        await apiPatchContent(defaultContent as Partial<SiteContent>);
      } catch (err: any) {
        setLastError(`Reset failed: ${err.message}`);
      } finally {
        setIsSaving(false);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // ── undo ─────────────────────────────────────────────────────
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const [previous, ...rest] = undoStack;
    setUndoStack(rest);
    setContentState(previous);
    if (!USE_API) lsPersist(previous);
  }, [undoStack]);

  const clearError = useCallback(() => setLastError(null), []);

  // ── reloadContent: fetch latest from API WITHOUT wiping data ────
  // Uses a SEPARATE isReloading flag so the full-page overlay is NOT shown.
  const reloadContent = useCallback(async () => {
    setIsReloading(true);
    setLastError(null);
    try {
      const fresh = USE_API ? await apiFetchContent() : lsRead();
      setContentState(fresh);
      setUndoStack([]);
    } catch (err: any) {
      setLastError(`Reload failed: ${err.message}`);
    } finally {
      setIsReloading(false);
    }
  }, []);

  return (
    <ContentContext.Provider value={{
      content, setContent, patchContent, resetToDefault,
      undoStack, canUndo: undoStack.length > 0, undo,
      isLoading, isSaving, lastError, clearError, reloadContent, isReloading,
    }}>
      {children}
    </ContentContext.Provider>
  );
}

// ── Hooks ─────────────────────────────────────────────────────
export function useContent(): SiteContent {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent() must be used inside <ContentProvider>');
  return ctx.content;
}

export function useContentContext(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContentContext() must be used inside <ContentProvider>');
  return ctx;
}
