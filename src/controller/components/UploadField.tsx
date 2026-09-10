import React, { useRef, useState, useCallback } from 'react';
import { upload } from '@vercel/blob/client';

// ── Config ────────────────────────────────────────────────────
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
const API_SECRET = (import.meta.env.VITE_CONTROLLER_API_SECRET as string | undefined) ?? '';
const USE_API = API_BASE.length > 0;

// Accepted MIME types by field kind
const ACCEPT_IMAGE = '.png,.jpg,.jpeg,.svg,.webp';
const ACCEPT_PDF = '.pdf';
const ACCEPT_IMAGE_MIME = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
const ACCEPT_PDF_MIME = ['application/pdf'];

const C = {
  bg: '#0D0F13', border: 'rgba(255,255,255,0.08)', accent: '#6B9BD0',
  accentDim: 'rgba(107,155,208,0.15)', text: '#E8E8E8', textMuted: '#6A6E7A',
  success: '#2ECC71', danger: '#E74C3C', warning: '#F39C12',
  fontSans: '"Manrope", sans-serif',
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── UploadField ───────────────────────────────────────────────
export interface UploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: 'image' | 'pdf';
  hint?: string;
  disabled?: boolean;
}

export function UploadField({
  label, value, onChange, accept = 'image', hint, disabled,
}: UploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [imgBroken, setImgBroken] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const acceptAttr = accept === 'pdf' ? ACCEPT_PDF : ACCEPT_IMAGE;
  const allowedMimes = accept === 'pdf' ? ACCEPT_PDF_MIME : ACCEPT_IMAGE_MIME;

  const handleUpload = useCallback(async (file: File) => {
    // Validate type
    if (!allowedMimes.includes(file.type)) {
      setUploadError(`Invalid file type: ${file.type}. Allowed: ${acceptAttr}`);
      return;
    }
    setUploadError('');
    setImgBroken(false);
    setProgress(0);

    if (!USE_API) {
      // Fallback: create a local object URL for dev without API
      const localUrl = URL.createObjectURL(file);
      onChange(localUrl);
      setProgress(null);
      return;
    }

    try {
      // Use Vercel Blob's client-upload pattern:
      // Browser talks to /api/upload for a token, then uploads directly to Blob CDN.
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: `${API_BASE}/api/upload`,
        clientPayload: '', // no extra payload needed
        onUploadProgress: ({ percentage }) => setProgress(percentage),
        // Pass the API secret so the server can authorize the token request
        headers: { Authorization: `Bearer ${API_SECRET}` },
      } as Parameters<typeof upload>[2]);

      onChange(blob.url);
      setProgress(null);
    } catch (err: any) {
      setUploadError(`Upload failed: ${err.message}`);
      setProgress(null);
    }
  }, [accept, onChange, allowedMimes]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const isUploading = progress !== null;
  const isBlob = value.startsWith('https://') || value.startsWith('blob:');
  const isPdf = accept === 'pdf';

  return (
    <div style={{ marginBottom: '20px', fontFamily: C.fontSans }}>
      {/* Label */}
      <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: C.textMuted, marginBottom: '8px' }}>
        {label}
      </div>

      {/* Drop zone */}
      <div
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${isDragging ? C.accent : isUploading ? C.warning : C.border}`,
          borderRadius: '8px',
          background: isDragging ? C.accentDim : 'rgba(255,255,255,0.02)',
          padding: '16px',
          cursor: disabled || isUploading ? 'default' : 'pointer',
          transition: 'all 0.2s',
          position: 'relative',
        }}
      >
        {/* Current value preview */}
        {value && !isUploading && (
          <div style={{ marginBottom: '12px' }}>
            {isPdf ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: C.text }}>
                <span style={{ fontSize: '1.2rem' }}>📄</span>
                <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: 'none', wordBreak: 'break-all' }}>
                  {value.split('/').pop() ?? value}
                </a>
              </div>
            ) : (
              <div>
                <img
                  src={value}
                  alt={label}
                  onError={() => setImgBroken(true)}
                  onLoad={() => setImgBroken(false)}
                  style={{
                    maxHeight: '80px', maxWidth: '100%', borderRadius: '4px',
                    border: `1px solid ${C.border}`, objectFit: 'contain',
                    background: 'rgba(255,255,255,0.05)',
                    display: imgBroken ? 'none' : 'block',
                  }}
                />
                {imgBroken && (
                  <div style={{ padding: '8px 12px', background: `${C.danger}20`, border: `1px solid ${C.danger}40`, borderRadius: '4px', fontSize: '0.75rem', color: C.danger }}>
                    ⚠ Image failed to load — this URL is broken or the asset was deleted from Blob.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Upload progress bar */}
        {isUploading && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '0.78rem', color: C.warning, marginBottom: '6px' }}>
              Uploading… {progress}%
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: C.accent, borderRadius: '2px', width: `${progress}%`, transition: 'width 0.2s' }} />
            </div>
          </div>
        )}

        {/* Drop prompt */}
        {!isUploading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: C.textMuted, fontSize: '0.78rem' }}>
            <span style={{ fontSize: '1.2rem' }}>{isPdf ? '📄' : '🖼'}</span>
            <div>
              <span style={{ color: C.accent, fontWeight: '600' }}>Click to browse</span>{' '}
              or drag and drop
              <div style={{ marginTop: '2px', fontSize: '0.7rem' }}>
                {isPdf ? 'PDF up to 20 MB' : 'PNG, JPG, SVG, WebP up to 20 MB'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* URL text input (manual override) */}
      <div style={{ marginTop: '6px', display: 'flex', gap: '6px', alignItems: 'center' }}>
        <input
          type="text"
          value={value}
          onChange={e => { setImgBroken(false); onChange(e.target.value); }}
          placeholder={isPdf ? '/path/to/file.pdf or Blob URL' : '/path/to/image.png or Blob URL'}
          disabled={isUploading}
          style={{
            flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
            borderRadius: '4px', padding: '6px 10px', color: C.text, fontSize: '0.78rem',
            fontFamily: C.fontSans, outline: 'none',
          }}
        />
        {value && (
          <button
            title="Clear"
            onClick={() => { onChange(''); setImgBroken(false); }}
            style={{ background: 'transparent', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: '0.9rem', padding: '4px 6px' }}
          >✕</button>
        )}
      </div>

      {/* Blob badge */}
      {isBlob && !imgBroken && (
        <div style={{ marginTop: '4px', fontSize: '0.68rem', color: C.success }}>✓ Stored in Vercel Blob</div>
      )}

      {/* Error */}
      {uploadError && (
        <div style={{ marginTop: '6px', fontSize: '0.75rem', color: C.danger }}>{uploadError}</div>
      )}

      {/* Hint */}
      {hint && <div style={{ marginTop: '4px', fontSize: '0.72rem', color: C.textMuted }}>{hint}</div>}

      <input ref={fileInputRef} type="file" accept={acceptAttr} style={{ display: 'none' }} onChange={onFileChange} />
    </div>
  );
}
