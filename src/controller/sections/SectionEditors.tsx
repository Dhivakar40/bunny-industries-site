import React, { useState } from 'react';
import {
  TextField, NumberField, ImageField, ArrayField, ArrayNestedField,
  ColorField, RichTextField, LongTextField,
} from '../components/FieldControls';
import { useContentContext } from '../../context/ContentContext';

export function MetaSection() {
  const { content, patchContent } = useContentContext();
  const m = content.meta;
  const patch = (k: keyof typeof m, v: any) => patchContent('meta', { [k]: v });
  return (
    <div>
      <TextField label="Page Title" value={m.title} onChange={v => patch('title', v)} maxLength={60} hint="Appears in browser tab and search results. Keep under 60 characters." />
      <TextField label="Meta Description" value={m.description} onChange={v => patch('description', v)} maxLength={160} hint="Search engine snippet. Keep under 160 characters." />
      <TextField label="Meta Keywords" value={m.keywords} onChange={v => patch('keywords', v)} hint="Comma-separated keywords." />
    </div>
  );
}

export function ThemeSection() {
  const { content, patchContent } = useContentContext();
  const t = content.theme;
  const patch = (k: keyof typeof t, v: any) => patchContent('theme', { [k]: v });
  return (
    <div>
      <ColorField label="Accent Primary" value={t.accentPrimary} onChange={v => patch('accentPrimary', v)} hint="Blue-steel used in About section borders, eyebrows, and nav hover." />
      <ColorField label="Accent Glow" value={t.accentGlow} onChange={v => patch('accentGlow', v)} hint="Teal glow used on Portfolio/Clients 'since' badges and infrastructure card accents." />
      <ColorField label="Accent Gold" value={t.accentGold} onChange={v => patch('accentGold', v)} hint="Used as MSME cert badge color and alternating quality focus card borders." />
    </div>
  );
}

export function NavbarSection() {
  const { content, patchContent } = useContentContext();
  const n = content.navbar;
  const patch = (k: keyof typeof n, v: any) => patchContent('navbar', { [k]: v });
  return (
    <div>
      <TextField label="Logo Alt Text" value={n.logoAlt} onChange={v => patch('logoAlt', v)} />
      <TextField label="Brochure Button Label" value={n.ctaBrochureLabel} onChange={v => patch('ctaBrochureLabel', v)} />
      <TextField label="Brochure PDF Path / Blob URL" value={n.ctaBrochureFilename} onChange={v => patch('ctaBrochureFilename', v)} hint="The 'download' attribute filename. After uploading via the PDF field below, paste the Blob URL here." />
      <TextField label="Talk CTA Label" value={n.ctaTalkLabel} onChange={v => patch('ctaTalkLabel', v)} />
      <ArrayField
        label="Navigation Labels"
        items={n.navItems}
        onChange={v => patch('navItems', v)}
        fieldConfig={[{ key: 'label', label: 'Label', type: 'text', required: true }]}
        itemLabel={(item, i) => item.label || `Nav Item ${i + 1}`}
        newItem={() => ({ label: '' })}
      />
    </div>
  );
}

export function HeroSection() {
  const { content, patchContent } = useContentContext();
  const h = content.hero;
  const patch = (k: keyof typeof h, v: any) => patchContent('hero', { [k]: v });
  return (
    <div>
      <TextField label="Title Line 1" value={h.titleLine1} onChange={v => patch('titleLine1', v)} hint="Top line of the hero heading (e.g. BUNNY)" />
      <TextField label="Title Line 2" value={h.titleLine2} onChange={v => patch('titleLine2', v)} hint="Bottom line of the hero heading (e.g. INDUSTRIES)" />
      <TextField label="Tagline" value={h.tagline} onChange={v => patch('tagline', v)} maxLength={80} hint="Appears below the title after the horizontal rule." />
      <NumberField label="Slideshow Interval (ms)" value={h.slideshowIntervalMs} min={1000} step={500} onChange={v => patch('slideshowIntervalMs', v)} hint="Time in milliseconds between background image transitions. Minimum 1000ms." />
      <ArrayField
        label="Background Slideshow Images"
        items={h.slideshowImages.map(src => ({ src }))}
        onChange={v => patch('slideshowImages', v.map((i: any) => i.src))}
        fieldConfig={[{ key: 'src', label: 'Image Path', type: 'image', required: true }]}
        itemLabel={(item, i) => item.src || `Image ${i + 1}`}
        newItem={() => ({ src: '' })}
      />
    </div>
  );
}

export function AboutSection() {
  const { content, patchContent } = useContentContext();
  const a = content.about;
  const patch = (k: keyof typeof a, v: any) => patchContent('about', { [k]: v });

  return (
    <div>
      <TextField label="Section Eyebrow" value={a.eyebrow} onChange={v => patch('eyebrow', v)} hint="Small label above the heading" />
      <TextField label="Main Heading" value={a.heading} onChange={v => patch('heading', v)} />
      <RichTextField label="Paragraph 1" value={a.paragraph1} onChange={(v: string) => patch('paragraph1', v)} hint="Bold text supported. Contains founder and history copy." />
      <RichTextField label="Paragraph 2" value={a.paragraph2} onChange={(v: string) => patch('paragraph2', v)} hint="Employee count, turnover. Bold text supported." />
      <TextField label="Quality Banner Heading" value={a.qualityBannerHeading} onChange={v => patch('qualityBannerHeading', v)} />
      <RichTextField label="Quality Banner Body" value={a.qualityBannerBody} onChange={(v: string) => patch('qualityBannerBody', v)} hint="The italicised quote in the quality section. Bold supported." />
      <ArrayField
        label="Mission / Vision / Values Cards"
        items={a.cards as any[]}
        onChange={v => patch('cards', v as any)}
        fieldConfig={[
          { key: 'title', label: 'Card Title', type: 'text', required: true },
          { key: 'body', label: 'Card Body', type: 'text', required: true },
        ]}
        itemLabel={(item) => item.title || 'Card'}
        newItem={() => ({ title: '', body: '' })}
      />
    </div>
  );
}

export function ServicesSection() {
  const { content, patchContent } = useContentContext();
  const s = content.services;
  const patch = (k: keyof typeof s, v: any) => patchContent('services', { [k]: v });
  return (
    <div>
      <TextField label="Section Heading" value={s.heading} onChange={v => patch('heading', v)} />
      <TextField label="Section Subtext" value={s.subtext} onChange={v => patch('subtext', v)} />
      <TextField label="Materials Marquee Text" value={s.materialsMarqueeText} onChange={v => patch('materialsMarqueeText', v)} hint="The scrolling ticker. Separate items with ' • ' (space-bullet-space). The text loops." />
      <ArrayField
        label="Sector Cards"
        items={s.capabilities as any[]}
        onChange={v => patch('capabilities', v as any)}
        fieldConfig={[
          { key: 'id', label: 'ID / Number', type: 'text', required: true, hint: '"01", "02" etc.' },
          { key: 'title', label: 'Sector Title', type: 'text', required: true },
          { key: 'desc', label: 'Description', type: 'text', required: true },
          { key: 'image', label: 'Card Image', type: 'image' },
        ]}
        itemLabel={(item) => item.title || 'Sector'}
        newItem={() => ({ id: '', title: '', desc: '', image: '' })}
      />
    </div>
  );
}

export function PortfolioSection() {
  const { content, patchContent } = useContentContext();
  const p = content.portfolio;
  const patch = (k: keyof typeof p, v: any) => patchContent('portfolio', { [k]: v });

  return (
    <div>
      <TextField label="Section Heading" value={p.heading} onChange={v => patch('heading', v)} />
      <TextField label="Section Subtext" value={p.subtext} onChange={v => patch('subtext', v)} />
      <TextField label="Infrastructure Sub-Heading" value={p.infraHeading} onChange={v => patch('infraHeading', v)} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <TextField label="Expand Projects Label" value={p.viewMoreLabel} onChange={v => patch('viewMoreLabel', v)} />
        <TextField label="Collapse Projects Label" value={p.viewLessLabel} onChange={v => patch('viewLessLabel', v)} />
      </div>
      <ArrayField
        label="Capability Cards (Services section)"
        items={p.projects as any[]}
        onChange={v => patch('projects', v as any)}
        fieldConfig={[
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'desc', label: 'Description', type: 'text', required: true },
          { key: 'img', label: 'Image', type: 'image' },
        ]}
        itemLabel={(item) => item.title || 'Project'}
        newItem={() => ({ id: Date.now(), title: '', desc: '', img: '' })}
      />
      <ArrayNestedField
        label="Machine Infrastructure Categories"
        items={p.machines}
        onChange={(v: any) => patch('machines', v)}
      />
    </div>
  );
}

export function ClientsSection() {
  const { content, patchContent } = useContentContext();
  const cl = content.clients;
  const patch = (k: keyof typeof cl, v: any) => patchContent('clients', { [k]: v });
  return (
    <div>
      <TextField label="Section Eyebrow" value={cl.eyebrow} onChange={v => patch('eyebrow', v)} />
      <TextField label="Section Heading" value={cl.heading} onChange={v => patch('heading', v)} />
      <TextField label="Section Subtext" value={cl.subtext} onChange={v => patch('subtext', v)} />
      <TextField label="Products Label" value={cl.cardLabel} onChange={v => patch('cardLabel', v)} hint='The bold label above the products list inside each card (e.g. "Products Supplied:")' />
      <ArrayField
        label="Client List"
        items={cl.clientList as any[]}
        onChange={v => patch('clientList', v as any)}
        fieldConfig={[
          { key: 'name', label: 'Company Name', type: 'text', required: true },
          { key: 'logo', label: 'Logo Image', type: 'image', hint: 'Path in /public (e.g. /armor_plast_logo.png)' },
          { key: 'location', label: 'Location', type: 'text', required: true },
          { key: 'products', label: 'Products Supplied', type: 'text', required: true },
          { key: 'since', label: 'Client Since (year)', type: 'text', required: true, hint: 'e.g. 2021' },
        ]}
        itemLabel={(item) => item.name || 'New Client'}
        newItem={() => ({ name: '', logo: '', location: '', products: '', since: String(new Date().getFullYear()) })}
      />
    </div>
  );
}

export function CertificationsSection() {
  const { content, patchContent } = useContentContext();
  const c = content.certifications;
  const patch = (k: keyof typeof c, v: any) => patchContent('certifications', { [k]: v });
  return (
    <div>
      <TextField label="Section Eyebrow" value={c.eyebrow} onChange={v => patch('eyebrow', v)} />
      <TextField label="Section Heading" value={c.heading} onChange={v => patch('heading', v)} />
      <TextField label="Quality Section Heading" value={c.qualityHeading} onChange={v => patch('qualityHeading', v)} />
      <TextField label="Quality Section Body" value={c.qualityBody} onChange={v => patch('qualityBody', v)} />
      <ArrayField
        label="Display Certifications (2)"
        items={c.certifications as any[]}
        onChange={v => patch('certifications', v as any)}
        fieldConfig={[
          { key: 'text', label: 'Cert Name', type: 'text', required: true },
          { key: 'desc', label: 'Subtitle', type: 'text', required: true },
          { key: 'img', label: 'Logo Image', type: 'image' },
          { key: 'color', label: 'Accent Color', type: 'color', hint: 'Badge glow color specific to this cert.' },
        ]}
        itemLabel={(item) => item.text || 'Cert'}
        newItem={() => ({ text: '', desc: '', img: '', color: '#FFFFFF', metallic: '' })}
      />
      <ArrayField
        label="PDF Certifications (click-to-view)"
        items={c.newCertificates as any[]}
        onChange={v => patch('newCertificates', v as any)}
        fieldConfig={[
          { key: 'text', label: 'Cert Name', type: 'text', required: true },
          { key: 'desc', label: 'Subtitle', type: 'text', required: true },
          { key: 'img', label: 'Icon Image', type: 'image' },
          { key: 'color', label: 'Accent Color', type: 'color' },
          { key: 'pdf', label: 'PDF File', type: 'pdf', hint: 'Drag-drop a PDF or paste a Blob URL. This is the click-to-view cert PDF.' },
        ]}
        itemLabel={(item) => item.text || 'Cert'}
        newItem={() => ({ text: '', desc: '', img: '', color: '#FFFFFF', pdf: '' })}
      />
      <ArrayField
        label="Quality Focus Points (5)"
        items={c.qualityFocusPoints as any[]}
        onChange={v => patch('qualityFocusPoints', v as any)}
        fieldConfig={[
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'desc', label: 'Description', type: 'text', required: true },
        ]}
        itemLabel={(item) => item.title || 'Focus Point'}
        newItem={() => ({ title: '', desc: '' })}
      />
    </div>
  );
}

export function ContactSection() {
  const { content, patchContent } = useContentContext();
  const c = content.contact;
  const patch = (k: keyof typeof c, v: any) => patchContent('contact', { [k]: v });
  const patchLabels = (k: string, v: string) => patch('formLabels', { ...c.formLabels, [k]: v });
  const patchPlaceholders = (k: string, v: string) => patch('formPlaceholders', { ...c.formPlaceholders, [k]: v });
  return (
    <div>
      <TextField label="Section Eyebrow" value={c.eyebrow} onChange={v => patch('eyebrow', v)} hint='Small label above the heading (e.g. "Inquiry")' />
      <TextField label="Main Heading" value={c.heading} onChange={v => patch('heading', v)} />
      <TextField label="Social Section Label" value={c.connectLabel} onChange={v => patch('connectLabel', v)} />
      <TextField label="Submit Button Label" value={c.submitLabel} onChange={v => patch('submitLabel', v)} />
      <TextField label="Copyright Line" value={c.copyrightLine} onChange={v => patch('copyrightLine', v)} hint="Shown in the bottom-right of the contact section." />
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 0', paddingTop: '16px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6A6E7A', marginBottom: '12px' }}>Form Labels</div>
        <TextField label="Name Field Label" value={c.formLabels.name} onChange={v => patchLabels('name', v)} />
        <TextField label="Email Field Label" value={c.formLabels.email} onChange={v => patchLabels('email', v)} />
        <TextField label="Message Field Label" value={c.formLabels.message} onChange={v => patchLabels('message', v)} />
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 0', paddingTop: '16px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6A6E7A', marginBottom: '12px' }}>Form Placeholders</div>
        <TextField label="Name Placeholder" value={c.formPlaceholders.name} onChange={v => patchPlaceholders('name', v)} />
        <TextField label="Email Placeholder" value={c.formPlaceholders.email} onChange={v => patchPlaceholders('email', v)} />
        <TextField label="Message Placeholder" value={c.formPlaceholders.message} onChange={v => patchPlaceholders('message', v)} />
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 0', paddingTop: '16px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6A6E7A', marginBottom: '12px' }}>Contact Info & Email Config</div>
        <TextField label="Gmail Address (social link)" value={c.emailAddress} onChange={v => patch('emailAddress', v)} hint="Used as the mailto: href on the Gmail icon." />
        <TextField label="WhatsApp Number (digits only)" value={c.whatsappNumber} onChange={v => patch('whatsappNumber', v)} hint='Country code + number, no spaces or + (e.g. 919364360603)' />
        <TextField label="WhatsApp Pre-filled Message" value={c.whatsappMessage} onChange={v => patch('whatsappMessage', v)} hint="The text message pre-filled when they click the WhatsApp icon." />
        <TextField label="Form Submission Email" value={c.formSubmissionEmail} onChange={v => patch('formSubmissionEmail', v)} hint="The mailto: address the contact form sends to." />
        <TextField label="Email Template Subject" value={c.emailTemplateSubject} onChange={v => patch('emailTemplateSubject', v)} hint="{name} is replaced with the form sender's name." />
        <TextField label="Email Template Header" value={c.emailTemplateHeader} onChange={v => patch('emailTemplateHeader', v)} hint="Bold header line in the email body." />
        <TextField label="Email Footer Note" value={c.emailFooterNote} onChange={v => patch('emailFooterNote', v)} hint="Internal note appended to the bottom of every email." />
      </div>
    </div>
  );
}

export function FooterSection() {
  const { content, patchContent } = useContentContext();
  const f = content.footer;
  const patch = (k: keyof typeof f, v: any) => patchContent('footer', { [k]: v });
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <TextField label="Brand Name Line 1" value={f.brandLine1} onChange={v => patch('brandLine1', v)} />
        <TextField label="Brand Name Line 2" value={f.brandLine2} onChange={v => patch('brandLine2', v)} />
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 0', paddingTop: '16px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6A6E7A', marginBottom: '12px' }}>Unit 1</div>
        <TextField label="Unit 1 Address" value={f.unit1.address} onChange={v => patch('unit1', { ...f.unit1, address: v })} />
        <TextField label="Unit 1 Map Short Link" value={f.unit1.mapLink} onChange={v => patch('unit1', { ...f.unit1, mapLink: v })} hint="The Google Maps short link shown in the address text." />
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 0', paddingTop: '16px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6A6E7A', marginBottom: '12px' }}>Unit 2</div>
        <TextField label="Unit 2 Address" value={f.unit2.address} onChange={v => patch('unit2', { ...f.unit2, address: v })} />
        <TextField label="Unit 2 Map Short Link" value={f.unit2.mapLink} onChange={v => patch('unit2', { ...f.unit2, mapLink: v })} hint="The Google Maps short link shown in the address text." />
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 0', paddingTop: '16px' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6A6E7A', marginBottom: '12px' }}>Column Headings</div>
        <TextField label="Quick Links Column Heading" value={f.columnHeadings.links} onChange={v => patch('columnHeadings', { ...f.columnHeadings, links: v })} />
        <TextField label="Services Column Heading" value={f.columnHeadings.services} onChange={v => patch('columnHeadings', { ...f.columnHeadings, services: v })} />
        <TextField label="Company Column Heading" value={f.columnHeadings.company} onChange={v => patch('columnHeadings', { ...f.columnHeadings, company: v })} />
      </div>
      <TextField label="Contact CTA Button Label" value={f.contactCtaLabel} onChange={v => patch('contactCtaLabel', v)} />
      <ArrayField
        label="Legal Link Labels"
        items={f.legalLinkLabels.map(l => ({ label: l }))}
        onChange={v => patch('legalLinkLabels', v.map((i: any) => i.label) as [string, string, string])}
        fieldConfig={[{ key: 'label', label: 'Link Label', type: 'text', required: true }]}
        itemLabel={(item) => item.label || 'Legal Link'}
        newItem={() => ({ label: '' })}
      />
      <ArrayField
        label="Quick Links Labels (footer column)"
        items={f.quickLinks as any[]}
        onChange={v => patch('quickLinks', v as any)}
        fieldConfig={[{ key: 'label', label: 'Label', type: 'text', required: true }]}
        itemLabel={(item) => item.label || 'Link'}
        newItem={() => ({ label: '' })}
      />
      <ArrayField
        label="Services List"
        items={f.servicesList.map(s => ({ service: s }))}
        onChange={v => patch('servicesList', v.map((i: any) => i.service))}
        fieldConfig={[{ key: 'service', label: 'Service Name', type: 'text', required: true }]}
        itemLabel={(item) => item.service || 'Service'}
        newItem={() => ({ service: '' })}
      />
    </div>
  );
}

export function LegalSection() {
  const { content, patchContent } = useContentContext();
  const l = content.legal;
  const patch = (section: 'privacy' | 'disclaimer' | 'terms', k: string, v: string) =>
    patchContent('legal', { [section]: { ...l[section], [k]: v } });
  const [activeTab, setActiveTab] = React.useState<'privacy' | 'disclaimer' | 'terms'>('privacy');

  const tabs: Array<{ key: 'privacy' | 'disclaimer' | 'terms'; label: string }> = [
    { key: 'privacy', label: 'Privacy Policy' },
    { key: 'disclaimer', label: 'Disclaimer' },
    { key: 'terms', label: 'Terms & Conditions' },
  ];



  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 16px', border: '1px solid',
              borderColor: activeTab === tab.key ? '#6B9BD0' : 'rgba(255,255,255,0.08)',
              background: activeTab === tab.key ? 'rgba(107,155,208,0.15)' : 'transparent',
              color: activeTab === tab.key ? '#6B9BD0' : '#6A6E7A',
              borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600',
              fontFamily: '"Manrope", sans-serif', letterSpacing: '0.05em',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <TextField label="Title" value={l[activeTab].title} onChange={v => patch(activeTab, 'title', v)} />
      <LongTextField label="Content" value={l[activeTab].content} onChange={v => patch(activeTab, 'content', v)} rows={20} hint="Plain text. Line breaks are preserved exactly as typed (whiteSpace: pre-line). Do NOT use HTML tags here." />
    </div>
  );
}
