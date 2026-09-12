// ============================================================
//  SiteContent — Single source of truth for all editable content
//  on the Bunny Industries site.
//
//  CMS Control-type annotations (used in Phase 3 controller):
//    text       → single-line input
//    richtext   → has inline <strong> / HTML — lightweight WYSIWYG
//    longtext   → multi-paragraph plain text, whitespace-sensitive (textarea)
//    color      → hex color picker
//    image      → URL input + preview
//    array      → repeatable card list
//    number     → numeric input
// ============================================================

// ── Meta / SEO ───────────────────────────────────────────────
export interface MetaContent {
  title: string;           // text   — <title> tag
  description: string;     // text   — <meta name="description">
  keywords: string;        // text   — <meta name="keywords">
}

// ── Theme / Color Palette ────────────────────────────────────
export interface ThemeContent {
  accentPrimary: string;   // color  — #6B9BD0  (About borders, eyebrows)
  accentGlow: string;      // color  — #00ffcc  (Portfolio/Clients teal badges)
  accentGold: string;      // color  — #3399FF  (MSME cert badge color)
}

// ── Navbar ───────────────────────────────────────────────────
export interface NavItem {
  label: string;           // text   — display label only (targetId stays in code)
}

export interface NavbarContent {
  logoAlt: string;         // text   — img alt attribute
  ctaBrochureLabel: string;// text   — "DOWNLOAD BROCHURE"
  ctaBrochureFilename: string; // text — download attribute value
  ctaTalkLabel: string;    // text   — "LET'S TALK"
  navItems: NavItem[];     // array  — 6 nav labels
}

// ── Hero ─────────────────────────────────────────────────────
export interface HeroContent {
  titleLine1: string;      // text   — "BUNNY"
  titleLine2: string;      // text   — "INDUSTRIES"
  tagline: string;         // text   — "PRECISION MANUFACTURING EXCELLENCE"
  slideshowImages: string[];// array  — public-folder image URLs
  slideshowIntervalMs: number; // number — ms between slides
}

// ── About ────────────────────────────────────────────────────
export interface AboutCard {
  title: string;           // text   — "OUR MISSION" / "OUR VISION" / "OUR VALUES"
  body: string;            // text   — card description
}

export interface AboutContent {
  eyebrow: string;         // text
  heading: string;         // text
  paragraph1: string;      // richtext — contains <strong> highlights
  paragraph2: string;      // richtext — contains <strong> highlights
  qualityBannerHeading: string; // text
  qualityBannerBody: string;    // richtext — contains <strong> highlights
  cards: [AboutCard, AboutCard, AboutCard]; // array — exactly 3
}

// ── Services (Sectors section) ───────────────────────────────
export interface Capability {
  id: string;              // text   — "01", "02" etc.
  title: string;           // text
  desc: string;            // text
  image: string;           // image  — public-folder URL
}

export interface ServicesContent {
  heading: string;         // text
  subtext: string;         // text
  materialsMarqueeText: string; // text — the long ticker string
  capabilities: [Capability, Capability, Capability, Capability]; // array — exactly 4
}

// ── Portfolio (Machineries + Infrastructure) ─────────────────
export interface CapabilityProject {
  id: number;              // number — card index
  title: string;           // text
  desc: string;            // text
  img: string;             // image  — public-folder URL
}

export interface MachineItem {
  make: string;            // text
  capacity: string;        // text
  count: number;           // number
}

export interface MachineCategory {
  category: string;        // text   — display name
  img: string;             // image  — public-folder URL (shared with projects where applicable)
  count: number;           // number — total unit count
  items: MachineItem[];    // array  — 1–4 entries
}

export interface PortfolioContent {
  heading: string;         // text
  subtext: string;         // text
  infraHeading: string;    // text
  viewMoreLabel: string;   // text
  viewLessLabel: string;   // text
  projects: CapabilityProject[]; // array — 5 items
  machines: MachineCategory[];   // array — 17 items
}

// ── Clients ──────────────────────────────────────────────────
export interface Client {
  name: string;            // text
  logo: string;            // image  — public-folder URL
  location: string;        // text
  products: string;        // text
  since: string;           // text   — year as string e.g. "2021"
}

export interface ClientsContent {
  eyebrow: string;         // text
  heading: string;         // text
  subtext: string;         // text
  cardLabel: string;       // text   — "Products Supplied:"
  clientList: Client[];    // array  — 15 items
}

// ── Certifications ───────────────────────────────────────────
export interface CertEntry {
  text: string;            // text   — cert name
  desc: string;            // text   — subtitle
  img: string;             // image
  color: string;           // color  — per-cert accent (badge + glow)
  metallic?: string;       // text   — gradient string (display-only certs)
}

export interface NewCertEntry {
  text: string;            // text
  desc: string;            // text
  img: string;             // image
  color: string;           // color
  pdf: string;             // text   — /public path to PDF
}

export interface QualityFocusPoint {
  title: string;           // text
  desc: string;            // text
}

export interface CertificationsContent {
  eyebrow: string;         // text
  heading: string;         // text
  qualityHeading: string;  // text
  qualityBody: string;     // text
  certifications: [CertEntry, CertEntry];              // array — exactly 2
  newCertificates: [NewCertEntry, NewCertEntry, NewCertEntry]; // array — exactly 3
  qualityFocusPoints: QualityFocusPoint[];             // array — 5 items
}

// ── Contact ──────────────────────────────────────────────────
export interface ContactFormLabels {
  name: string;            // text
  email: string;           // text
  message: string;         // text
}

export interface ContactFormPlaceholders {
  name: string;            // text
  email: string;           // text
  message: string;         // text
}

export interface ContactContent {
  eyebrow: string;         // text
  heading: string;         // text
  connectLabel: string;    // text
  formLabels: ContactFormLabels;
  formPlaceholders: ContactFormPlaceholders;
  submitLabel: string;     // text
  copyrightLine: string;   // text
  emailAddress: string;    // text   — gmail social link
  whatsappNumber: string;  // text   — WhatsApp href number (digits only)
  formSubmissionEmail: string; // text — mailto: target
  emailTemplateSubject: string; // text
  emailTemplateHeader: string;  // text
  emailFooterNote: string;      // text
}

// ── Footer ───────────────────────────────────────────────────
export interface FooterUnit {
  label: string;           // text   — "BUNNY UNIT-1"
  address: string;         // text
  mapLink: string;         // text   — Google Maps short link (NOT embed URL)
}

export interface FooterColumnHeadings {
  links: string;           // text   — "Quick Links"
  services: string;        // text   — "Our Services"
  company: string;         // text   — "Our Company"
}

export interface FooterQuickLink {
  label: string;           // text   — display label only (id stays in code)
}

export interface FooterContent {
  brandLine1: string;      // text
  brandLine2: string;      // text
  unit1: FooterUnit;
  unit2: FooterUnit;
  columnHeadings: FooterColumnHeadings;
  legalLinkLabels: [string, string, string]; // text×3
  contactCtaLabel: string; // text
  quickLinks: FooterQuickLink[]; // array — 5 items
  servicesList: string[];  // array — 5 strings
}

// ── Legal ─────────────────────────────────────────────────────
export interface LegalSection {
  title: string;           // text
  content: string;         // longtext — whitespace-sensitive, use textarea
}

export interface LegalContent {
  privacy: LegalSection;
  disclaimer: LegalSection;
  terms: LegalSection;
}

// ── Root ──────────────────────────────────────────────────────
export interface SiteContent {
  meta: MetaContent;
  theme: ThemeContent;
  navbar: NavbarContent;
  hero: HeroContent;
  about: AboutContent;
  services: ServicesContent;
  portfolio: PortfolioContent;
  clients: ClientsContent;
  certifications: CertificationsContent;
  contact: ContactContent;
  footer: FooterContent;
  legal: LegalContent;
}
