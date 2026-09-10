import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadField } from './UploadField';

// ── Shared design tokens ──────────────────────────────────────
export const C = {
  bg: '#0D0F13',
  surface: '#161820',
  surfaceHover: '#1E2028',
  border: 'rgba(255,255,255,0.08)',
  borderFocus: '#6B9BD0',
  text: '#E8E8E8',
  textMuted: '#6A6E7A',
  accent: '#6B9BD0',
  danger: '#E74C3C',
  success: '#2ECC71',
  fontMono: '"Courier New", monospace',
  fontSans: '"Manrope", sans-serif',
  fontDisplay: '"Oswald", sans-serif',
  radius: '6px',
};

const inputBase: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: C.surface,
  border: `1px solid ${C.border}`, borderRadius: C.radius,
  color: C.text, fontSize: '0.9rem', fontFamily: C.fontSans,
  outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.7rem', fontWeight: '700',
  textTransform: 'uppercase', letterSpacing: '0.12em',
  color: C.textMuted, marginBottom: '6px',
};

// ── Field wrapper ─────────────────────────────────────────────
export function FieldGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={labelStyle}>{label}</label>
      {hint && <div style={{ fontSize: '0.72rem', color: C.textMuted, marginBottom: '6px', opacity: 0.7 }}>{hint}</div>}
      {children}
    </div>
  );
}

// ── TEXT field ────────────────────────────────────────────────
export function TextField({ label, value, onChange, hint, maxLength }: {
  label: string; value: string; onChange: (v: string) => void;
  hint?: string; maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <FieldGroup label={label} hint={hint}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...inputBase, borderColor: focused ? C.borderFocus : C.border }}
        />
        {maxLength && (
          <div style={{ position: 'absolute', right: '10px', bottom: '10px', fontSize: '0.65rem', color: C.textMuted }}>
            {value.length}/{maxLength}
          </div>
        )}
      </div>
    </FieldGroup>
  );
}

// ── NUMBER field ──────────────────────────────────────────────
export function NumberField({ label, value, onChange, min = 0, max, step = 1, hint }: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <FieldGroup label={label} hint={hint}>
      <input
        type="number"
        value={value}
        min={min} max={max} step={step}
        onChange={e => {
          const n = parseFloat(e.target.value);
          if (!isNaN(n) && n >= (min ?? -Infinity)) onChange(n);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...inputBase, borderColor: focused ? C.borderFocus : C.border, width: '200px' }}
      />
    </FieldGroup>
  );
}

// ── LONGTEXT field (textarea, preserves line breaks) ──────────
export function LongTextField({ label, value, onChange, hint, rows = 8 }: {
  label: string; value: string; onChange: (v: string) => void;
  hint?: string; rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <FieldGroup label={label} hint={hint}>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputBase,
          resize: 'vertical', lineHeight: '1.6',
          fontFamily: C.fontMono, fontSize: '0.82rem',
          borderColor: focused ? C.borderFocus : C.border,
        }}
      />
      <div style={{ fontSize: '0.65rem', color: C.textMuted, marginTop: '4px' }}>
        Line breaks are preserved exactly as typed.
      </div>
    </FieldGroup>
  );
}

// ── RICHTEXT field (bold/italic only, contentEditable toolbar) ─
const TOOLBAR_ACTIONS = [
  { cmd: 'bold', label: 'B', style: { fontWeight: '800' } },
  { cmd: 'italic', label: 'I', style: { fontStyle: 'italic' } },
];

function htmlToStorage(html: string): string {
  // Simplify: keep only <strong> and <em>, strip everything else
  return html
    .replace(/<b>/gi, '<strong>').replace(/<\/b>/gi, '</strong>')
    .replace(/<i>/gi, '<em>').replace(/<\/i>/gi, '</em>')
    .replace(/<(?!\/?(strong|em)\b)[^>]+>/gi, '')
    .replace(/&nbsp;/g, ' ');
}

export function RichTextField({ label, value, onChange, hint }: {
  label: string; value: string; onChange: (v: string) => void; hint?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const suppressRef = useRef(false);

  // Sync external value → DOM (only when not focused to avoid caret jump)
  useEffect(() => {
    if (!focused && editorRef.current && editorRef.current.innerHTML !== value) {
      suppressRef.current = true;
      editorRef.current.innerHTML = value;
      suppressRef.current = false;
    }
  }, [value, focused]);

  const handleInput = () => {
    if (suppressRef.current || !editorRef.current) return;
    onChange(htmlToStorage(editorRef.current.innerHTML));
  };

  const execCmd = (cmd: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false);
    handleInput();
  };

  return (
    <FieldGroup label={label} hint={hint}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        {TOOLBAR_ACTIONS.map(({ cmd, label: lbl, style }) => (
          <button
            key={cmd}
            onMouseDown={e => { e.preventDefault(); execCmd(cmd); }}
            style={{
              ...style,
              background: C.surface, border: `1px solid ${C.border}`,
              color: C.text, width: '32px', height: '28px',
              cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem',
              fontFamily: C.fontSans,
            }}
          >
            {lbl}
          </button>
        ))}
        <div style={{ fontSize: '0.65rem', color: C.textMuted, alignSelf: 'center', marginLeft: '6px' }}>
          Select text then click Bold/Italic
        </div>
      </div>
      {/* editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); handleInput(); }}
        style={{
          ...inputBase,
          minHeight: '90px', lineHeight: '1.7',
          borderColor: focused ? C.borderFocus : C.border,
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </FieldGroup>
  );
}

// ── COLOR field ───────────────────────────────────────────────
function isValidHex(h: string) { return /^#[0-9A-Fa-f]{6}$/.test(h); }

export function ColorField({ label, value, onChange, hint }: {
  label: string; value: string; onChange: (v: string) => void; hint?: string;
}) {
  const [raw, setRaw] = useState(value);
  const [err, setErr] = useState('');

  useEffect(() => { setRaw(value); }, [value]);

  const commit = (hex: string) => {
    if (isValidHex(hex)) { setErr(''); onChange(hex); }
    else setErr('Invalid hex — use #RRGGBB format');
  };

  return (
    <FieldGroup label={label} hint={hint}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Native colour picker */}
        <input
          type="color"
          value={isValidHex(raw) ? raw : '#000000'}
          onChange={e => { setRaw(e.target.value); commit(e.target.value); }}
          style={{ width: '44px', height: '44px', padding: '2px', border: `1px solid ${C.border}`, borderRadius: C.radius, background: 'transparent', cursor: 'pointer' }}
        />
        {/* Live swatch */}
        <div style={{ width: '44px', height: '44px', borderRadius: C.radius, background: isValidHex(raw) ? raw : '#333', border: `1px solid ${C.border}`, flexShrink: 0 }} />
        {/* Hex text input */}
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={raw}
            onChange={e => { setRaw(e.target.value); commit(e.target.value); }}
            style={{ ...inputBase, fontFamily: C.fontMono, textTransform: 'uppercase' }}
            placeholder="#000000"
          />
          {err && <div style={{ color: C.danger, fontSize: '0.72rem', marginTop: '3px' }}>{err}</div>}
        </div>
      </div>
    </FieldGroup>
  );
}


export function ImageField({ label, value, onChange, hint, accept }: {
  label: string; value: string; onChange: (v: string) => void; hint?: string; accept?: 'image' | 'pdf';
}) {
  return <UploadField label={label} value={value} onChange={onChange} hint={hint} accept={accept ?? 'image'} />;
}

// ── ARRAY field (flat repeater) ───────────────────────────────
interface ArrayItem { [key: string]: any }

interface ArrayFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'image' | 'pdf' | 'color' | 'number' | 'longtext';
  hint?: string;
  required?: boolean;
}

export function ArrayField<T extends ArrayItem>({
  label, items, onChange, fieldConfig, itemLabel, newItem,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  fieldConfig: ArrayFieldConfig[];
  itemLabel: (item: T, i: number) => string;
  newItem: () => T;
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const update = (i: number, key: string, val: any) => {
    const next = items.map((item, idx) => idx === i ? { ...item, [key]: val } : item);
    onChange(next);
  };

  const add = () => {
    onChange([...items, newItem()]);
    setExpandedIdx(items.length);
  };

  const remove = (i: number) => {
    onChange(items.filter((_, idx) => idx !== i));
    setExpandedIdx(null);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
    setExpandedIdx(to);
  };

  // drag-and-drop handlers
  const onDragStart = (i: number) => setDragIdx(i);
  const onDragOver = (e: React.DragEvent, i: number) => { e.preventDefault(); setOverIdx(i); };
  const onDrop = (i: number) => {
    if (dragIdx === null || dragIdx === i) return;
    move(dragIdx, i);
    setDragIdx(null); setOverIdx(null);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <label style={labelStyle}>{label} <span style={{ color: C.textMuted, fontWeight: 400 }}>({items.length})</span></label>
        <button
          onClick={add}
          style={{ background: C.accent, border: 'none', color: '#000', padding: '6px 14px', borderRadius: C.radius, fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', fontFamily: C.fontDisplay, letterSpacing: '0.1em' }}
        >
          + ADD
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((item, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={e => onDragOver(e, i)}
            onDrop={() => onDrop(i)}
            onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
            style={{
              border: `1px solid ${overIdx === i ? C.accent : C.border}`,
              borderRadius: C.radius, background: C.surface,
              opacity: dragIdx === i ? 0.5 : 1,
              transition: 'border-color 0.15s',
            }}
          >
            {/* Card header */}
            <div
              style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', cursor: 'pointer', gap: '10px' }}
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
            >
              <span style={{ color: C.textMuted, cursor: 'grab', fontSize: '1rem' }}>⠿</span>
              <div style={{ flex: 1, fontSize: '0.85rem', color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {itemLabel(item, i)}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={e => { e.stopPropagation(); move(i, i - 1); }} style={miniBtn} title="Move up" disabled={i === 0}>↑</button>
                <button onClick={e => { e.stopPropagation(); move(i, i + 1); }} style={miniBtn} title="Move down" disabled={i === items.length - 1}>↓</button>
                <button onClick={e => { e.stopPropagation(); remove(i); }} style={{ ...miniBtn, color: C.danger }} title="Delete">✕</button>
              </div>
              <span style={{ color: C.textMuted, fontSize: '0.75rem' }}>{expandedIdx === i ? '▲' : '▼'}</span>
            </div>

            {/* Expanded fields */}
            {expandedIdx === i && (
              <div style={{ padding: '16px', borderTop: `1px solid ${C.border}` }}>
                {fieldConfig.map(fc => {
                  const val = item[fc.key] ?? '';
                  if (fc.type === 'text') return <TextField key={fc.key} label={fc.label} value={String(val)} onChange={v => update(i, fc.key, v)} hint={fc.hint} />;
                  if (fc.type === 'image') return <ImageField key={fc.key} label={fc.label} value={String(val)} onChange={v => update(i, fc.key, v)} hint={fc.hint} accept="image" />;
                  if (fc.type === 'pdf') return <ImageField key={fc.key} label={fc.label} value={String(val)} onChange={v => update(i, fc.key, v)} hint={fc.hint} accept="pdf" />;
                  if (fc.type === 'color') return <ColorField key={fc.key} label={fc.label} value={String(val)} onChange={v => update(i, fc.key, v)} hint={fc.hint} />;
                  if (fc.type === 'number') return <NumberField key={fc.key} label={fc.label} value={Number(val)} onChange={v => update(i, fc.key, v)} hint={fc.hint} />;
                  if (fc.type === 'longtext') return <LongTextField key={fc.key} label={fc.label} value={String(val)} onChange={v => update(i, fc.key, v)} hint={fc.hint} />;
                  return null;
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const miniBtn: React.CSSProperties = {
  background: 'transparent', border: 'none', color: C.textMuted,
  cursor: 'pointer', padding: '2px 6px', fontSize: '0.75rem',
  borderRadius: '3px',
};

// ── ARRAY-NESTED field (machines: category → items[]) ─────────
interface MachineItem { make: string; capacity: string; count: number; }
interface MachineCategory { category: string; img: string; count: number; items: MachineItem[]; }

export function ArrayNestedField({ label, items, onChange }: {
  label: string;
  items: MachineCategory[];
  onChange: (items: MachineCategory[]) => void;
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [expandedSubIdx, setExpandedSubIdx] = useState<Record<number, number | null>>({});
  const [filter, setFilter] = useState('');

  const updateCat = (i: number, key: string, val: any) => {
    onChange(items.map((cat, idx) => idx === i ? { ...cat, [key]: val } : cat));
  };

  const updateItem = (catIdx: number, subIdx: number, key: string, val: any) => {
    onChange(items.map((cat, i) =>
      i !== catIdx ? cat : {
        ...cat,
        items: cat.items.map((item, j) => j === subIdx ? { ...item, [key]: val } : item)
      }
    ));
  };

  const addSubItem = (catIdx: number) => {
    const newItem: MachineItem = { make: '', capacity: '', count: 1 };
    onChange(items.map((cat, i) => i !== catIdx ? cat : { ...cat, items: [...cat.items, newItem] }));
  };

  const removeSubItem = (catIdx: number, subIdx: number) => {
    onChange(items.map((cat, i) => i !== catIdx ? cat : { ...cat, items: cat.items.filter((_, j) => j !== subIdx) }));
  };

  const filtered = items.filter(cat => cat.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <label style={labelStyle}>{label} <span style={{ color: C.textMuted, fontWeight: 400 }}>({items.length} categories)</span></label>
      </div>

      {/* Search filter */}
      <input
        type="text"
        placeholder="Filter categories…"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{ ...inputBase, marginBottom: '10px', fontSize: '0.82rem' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {filtered.map((cat, fi) => {
          const i = items.indexOf(cat); // real index in full array
          return (
            <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: C.radius, background: C.surface }}>
              {/* Category header */}
              <div
                style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', cursor: 'pointer', gap: '10px' }}
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              >
                <div style={{ flex: 1, fontSize: '0.85rem', color: C.text, fontFamily: C.fontDisplay, letterSpacing: '0.05em' }}>
                  {cat.category || <span style={{ color: C.textMuted }}>Unnamed</span>}
                  <span style={{ color: C.textMuted, fontSize: '0.75rem', marginLeft: '8px' }}>{cat.count} unit(s), {cat.items.length} make(s)</span>
                </div>
                <span style={{ color: C.textMuted, fontSize: '0.75rem' }}>{expandedIdx === i ? '▲' : '▼'}</span>
              </div>

              {expandedIdx === i && (
                <div style={{ padding: '16px', borderTop: `1px solid ${C.border}` }}>
                  <TextField label="Category Name" value={cat.category} onChange={v => updateCat(i, 'category', v)} />
                  <ImageField label="Category Image" value={cat.img} onChange={v => updateCat(i, 'img', v)} />
                  <NumberField label="Total Unit Count" value={cat.count} min={1} onChange={v => updateCat(i, 'count', v)} />

                  {/* Sub-items */}
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ ...labelStyle, margin: 0 }}>Makes / Models</label>
                      <button onClick={() => addSubItem(i)} style={{ background: C.accent, border: 'none', color: '#000', padding: '4px 10px', borderRadius: C.radius, fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer' }}>
                        + ADD MAKE
                      </button>
                    </div>
                    {cat.items.map((sub, j) => (
                      <div key={j} style={{ border: `1px solid ${C.border}`, borderRadius: C.radius, marginBottom: '6px', background: C.bg }}>
                        <div
                          style={{ display: 'flex', padding: '8px 12px', cursor: 'pointer', gap: '8px', alignItems: 'center' }}
                          onClick={() => setExpandedSubIdx(p => ({ ...p, [i]: p[i] === j ? null : j }))}
                        >
                          <div style={{ flex: 1, fontSize: '0.8rem', color: C.text }}>{sub.make || <span style={{ color: C.textMuted }}>Unnamed</span>} — {sub.capacity}</div>
                          <button onClick={e => { e.stopPropagation(); removeSubItem(i, j); }} style={{ ...miniBtn, color: C.danger }}>✕</button>
                          <span style={{ color: C.textMuted, fontSize: '0.7rem' }}>{expandedSubIdx[i] === j ? '▲' : '▼'}</span>
                        </div>
                        {expandedSubIdx[i] === j && (
                          <div style={{ padding: '12px', borderTop: `1px solid ${C.border}` }}>
                            <TextField label="Make / Brand" value={sub.make} onChange={v => updateItem(i, j, 'make', v)} />
                            <TextField label="Capacity / Spec" value={sub.capacity} onChange={v => updateItem(i, j, 'capacity', v)} />
                            <NumberField label="Unit Count" value={sub.count} min={1} onChange={v => updateItem(i, j, 'count', v)} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
