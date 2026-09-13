import type { SiteContent } from './types';

// ============================================================
//  defaultContent — The canonical, hardcoded baseline for all
//  site content. This file is the "source of truth" that gets
//  committed to the repo. The CMS controller writes overrides
//  to localStorage under 'bunny-cms-content'; the ContentContext
//  merges those over this object at runtime.
//
//  NOTE on image paths:
//  vmc_machine.png, cnc_machine.png, wire_cutting_machine.png,
//  sparking_machine.png, vertical_milling_machine.png appear
//  in `portfolio.machines`. They reference the public-folder path string.
// ============================================================

const defaultContent: SiteContent = {

  // ── Meta / SEO ─────────────────────────────────────────────
  meta: {
    title: "Bunny Industries",
    description: "Bunny Industries — Precision Engineering & High-Quality Manufacturing based in Hosur, Tamil Nadu. ISO 9001:2015 certified, ZED Silver accredited contract manufacturer serving Aerospace, Medical, Semiconductor, and Industrial sectors.",
    keywords: "precision machining, CNC machining, VMC machining, contract manufacturer, Hosur, Tamil Nadu, aerospace components, medical components, ISO 9001, MSME, Bunny Industries"
  },

  // ── Theme / Color Palette ───────────────────────────────────
  theme: {
    accentPrimary: "#6B9BD0",
    accentGlow: "#00ffcc",
    accentGold: "#3399FF"
  },

  // ── Navbar ──────────────────────────────────────────────────
  navbar: {
    logoAlt: "Bunny Industries Logo",
    ctaBrochureLabel: "DOWNLOAD BROCHURE",
    ctaBrochureFilename: "Bunny_Industries_Brochure.pdf",
    ctaTalkLabel: "LET'S TALK",
    navItems: [
      { label: "ABOUT US" },
      { label: "SECTORS" },
      { label: "INFRASTRUCTURE" },
      { label: "CLIENTS" },
      { label: "CERTIFICATIONS" }
    ]
  },

  // ── Hero ────────────────────────────────────────────────────
  hero: {
    titleLine1: "BUNNY",
    titleLine2: "INDUSTRIES",
    tagline: "PRECISION MANUFACTURING EXCELLENCE",
    slideshowImages: [
      "/bunnybg1.jpeg",
      "/bunnybg2.jpeg",
      "/bunnybg3.jpeg"
    ],
    slideshowIntervalMs: 3500
  },

  // ── About ───────────────────────────────────────────────────
  about: {
    eyebrow: "About Bunny Industries",
    heading: "ENGINEERING EXCELLENCE BUILT ON TRUST",
    paragraph1: "Established in 2015 under the leadership of Founder & Proprietor Mr. Varatharajaperumal S, Bunny Industries has grown into a trusted name in precision engineering and high-quality manufacturing.<strong> Over a decade of steady growth, </strong>we have partnered with industry leaders across diverse sectors, earning a reputation for mechanical excellence, technical innovation, and operational reliability.",
    paragraph2: "Driven by a dedicated team of <strong>over 25 skilled employees</strong>, Bunny Industries achieved a financial turnover of ₹ 4.5 Crores for the financial year 2025–2026, reflecting our strong market presence and continuous scaling capabilities.",
    qualityBannerHeading: "Robust Quality Management",
    qualityBannerBody: "\"Operating under strict quality management systems, our facility is <strong>ISO 9001:2015 certificate </strong>and holds a <strong>ZED Silver Certificate, </strong>reflecting our commitment to zero-defect manufacturing and sustainable practices\"",
    cards: [
      {
        title: "OUR MISSION",
        body: "Premium-grade precision components that empower client supply chains with reliability, structural safety and efficiency."
      },
      {
        title: "OUR VISION",
        body: "To be a global benchmark in smart precision engineering, powering the next generation of industrial growth."
      },
      {
        title: "OUR VALUES",
        body: "Safety, Precision, Integrity and Continuous Improvement across every process, every shift."
      }
    ]
  },

  // ── Services (Sectors section) ──────────────────────────────
  services: {
    heading: "Industries We Power.",
    subtext: "From the tarmac to the tracks, we provide the hardware backbone for the world's most critical sectors.",
    materialsMarqueeText: "ALUMINUM 6061 • STAINLESS STEEL 304 • TITANIUM • INCONEL • BRASS • TOOL STEEL • CARBON FIBER • ABS PLASTIC • ",
    capabilities: [
      {
        id: "01",
        title: "AEROSPACE",
        desc: "Flight-critical engineering. Our components meet the rigorous safety and precision standards required for commercial aviation and defense sectors.",
        image: "flight.jpeg"
      },
      {
        id: "02",
        title: "MEDICAL",
        desc: "Precision that saves lives. We fabricate ultra-precise, sterile-ready components for next-generation surgical robots and medical devices.",
        image: "medi.png"
      },
      {
        id: "03",
        title: "SEMI-CONDUCTOR",
        desc: "Ultra-high precision for electronics. We machine pristine, critical components designed for complex semiconductor manufacturing equipment.",
        image: "semicond.png"
      },
      {
        id: "04",
        title: "INDUSTRIAL MACHINERY",
        desc: "Powering global manufacturing. We deliver heavy-duty, durable parts designed to withstand extreme loads and continuous industrial demands.",
        image: "industrial.png"
      }
    ]
  },

  // ── Infrastructure (formerly Portfolio) ──────────────────────
  portfolio: {
    heading: "INFRASTRUCTURE",
    qaSubtitle: "Zero-Defect Quality Discipline Backed by Advanced Measurement Systems",
    subtext: "Operating under Quality Management System compliance to an ISO 9001:2015 and ZED certification (Silver) by MSME, our dedicated Quality Assurance System & Metrology lab is equipped with cutting-edge 3D and optical measuring instruments to ensure complete conformance to engineering specifications.",
    infraHeading: "MACHINE INFRASTRUCTURE",
    qaInstruments: [
      {
        name: "Carl Zeiss CMM",
        desc: "3D Coordinate Measuring Machine for GD&T verification, profile analysis & 3D coordinate checks."
      },
      {
        name: "ATQ VMM",
        desc: "Optical Video Measuring Machine for non-contact 2D micro-geometry, pitch, and profile inspection."
      },
      {
        name: "Tesa Height Master",
        desc: "Ultra-precise digital height gauge system for reliable height, step, and flatness dimensioning."
      },
      {
        name: "Standard Metrology",
        desc: "Comprehensive range of calibrated bore gauges, slip gauge sets, pin gauges, micrometers & verniers."
      }
    ],
    machines: [
      {
        category: "VMC",
        img: "/vmc_machine.png",
        count: 4,
        items: [
          { make: "HASS",     capacity: "762x508x508MM",   count: 1 },
          { make: "BFW",      capacity: "700x400x400MM",   count: 1 },
          { make: "DHOOSAN",  capacity: "1500x670x625MM",  count: 1 },
          { make: "BATLIBAI", capacity: "950x520x480MM",   count: 1 }
        ]
      },
      {
        category: "CNC",
        img: "/cnc_machine.png",
        count: 2,
        items: [
          { make: "LMW", capacity: "Ø160x250MM", count: 2 }
        ]
      },
      {
        category: "WIRECUTTING",
        img: "/wire_cutting_machine.png",
        count: 2,
        items: [
          { make: "EXCON", capacity: "350x450x450MM", count: 2 }
        ]
      },
      {
        category: "SPARKING",
        img: "/sparking_machine.png",
        count: 1,
        items: [
          { make: "ELECTRONICA", capacity: "400x300x400MM", count: 1 }
        ]
      }
    ]

  },

  // ── Clients ─────────────────────────────────────────────────
  clients: {
    eyebrow: "Industrial Partnerships",
    heading: "Trusted by Industry Giants",
    subtext: "Bunny Industries serves leading OEMs and Tier-1 customers across the Automobile, Automation, Aerospace, and Medical sectors. Our promoters bring decades of proven performance through these long-standing relationships.",
    cardLabel: "Products Supplied:",
    clientList: [
      { name: "M/s Armor Plast Private Limited",            logo: "/armor_plast_logo.png",    location: "Bangalore",    products: "1) Mould Components and 2) Electrode",    since: "2021" },
      { name: "M/s Hubbell Services Private Limited",       logo: "/hubbell_logo.png",        location: "Chennai",      products: "VMC Fixtures",                             since: "2024" },
      { name: "Hya tech Private Limited",                   logo: "/hya_tech_logo.png",       location: "Hosur",        products: "Fixtures and Pins",                        since: "2024" },
      { name: "ICAM Solutions Private Limited",             logo: "/icam_logo.png",           location: "Bangalore",    products: "Aerospace Components",                     since: "2024" },
      { name: "Molbio Diagnostics Private Limited",         logo: "/molbio_logo.png",         location: "Visakapatnam", products: "Medical Equipment Components",             since: "2024" },
      { name: "Narasipur Auto Components Private Limited",  logo: "/narasipur_logo.png",      location: "Bangalore",    products: "Fixtures and Machined Components",          since: "2022" },
      { name: "Manufactec Solutions India Private Limited", logo: "/placeholder_logo.png",    location: "Hosur",        products: "Automotive Components",                    since: "2022" },
      { name: "Rikki Plastics Private Limited",             logo: "/rikki_plastics_logo.png", location: "Hosur",        products: "1) Mould Components and 2) Electrode",    since: "2021" },
      { name: "STS manufacturing Private Limited",          logo: "/sts_mfg_logo.png",        location: "Hosur",        products: "VMC Machined Components",                  since: "2021" },
      { name: "Tata Electronics Private Limited",           logo: "/tata_electronics_logo.png",location: "Hosur",       products: "Fixtures and Machined Components",          since: "2021" },
      { name: "TEAM Auto Tech India Pvt Ltd",               logo: "/team_auto_tech_logo.png", location: "Hosur",        products: "Machined Components",                      since: "2024" },
      { name: "Vithram India",                              logo: "/vithram_logo.png",        location: "Coimbatore",   products: "Machined Components",                      since: "2020" },
      { name: "Schaeffler India Limited",                   logo: "/schaeffler_logo.png",     location: "Hosur",        products: "Fixtures & Machined Components",            since: "2025" },
      { name: "Rangsons Aerospace Private Limited",         logo: "/rangsons_logo.png",       location: "Bangalore",    products: "Fixtures & Aerospace Components",           since: "2025" },
      { name: "Laversab India Aviation Private Limited",    logo: "/laversab_logo.png",       location: "Bangaluru",    products: "Aerospace Components",                     since: "2025" }
    ]
  },

  // ── Certifications ──────────────────────────────────────────
  certifications: {
    eyebrow: "Trust & Compliance",
    heading: "Industry Certifications",
    qualityHeading: "OUR QUALITY COMMITMENT",
    qualityBody: "Bunny Industries is committed to implementing and maintaining robust quality management systems in line with international standards. Our quality system is aligned with ISO 9001 requirements.",
    certifications: [
      {
        text: "UDAYAM REGISTERED",
        metallic: "linear-gradient(135deg, #FF9933 0%, #FFB366 25%, #E67300 50%, #FFE6CC 75%, #FF9933 100%)",
        desc: "Ministry of MSME",
        img: "udyam_icon.svg",
        color: "#FF9933"
      },
      {
        text: "MSME Registered",
        metallic: "linear-gradient(135deg, #0066CC 0%, #3399FF 25%, #007ACC 50%, #E6F3FF 75%, #0066CC 100%)",
        desc: "Micro, Small & Medium Enterprises",
        img: "msme.png",
        color: "#3399FF"
      }
    ],
    newCertificates: [
      {
        text: "ZED Silver",
        desc: "MSME Sustainable Certification",
        img: "zed_silver_icon.svg",
        color: "#C0C0C0",
        pdf: "/bunny_zed_silver_cert.pdf"
      },
      {
        text: "BSA ISO 9001",
        desc: "Certificate of Compliance",
        img: "bsa_icon.svg",
        color: "#E74C3C",
        pdf: "/bunny_iso_cert.pdf"
      }
    ],
    qualityFocusPoints: [
      { title: "Customer Satisfaction",   desc: "Achieved through consistent product quality and service excellence." },
      { title: "Risk-Based Thinking",     desc: "Adopting a proactive process approach to mitigate risks." },
      { title: "Continuous Improvement",  desc: "Relentless optimization of manufacturing and quality systems." },
      { title: "Regulatory Compliance",   desc: "Strict adherence to statutory and regulatory requirements." },
      { title: "Documentation & Control", desc: "Complete traceability and rigorous control of records." }
    ]
  },

  // ── Contact ─────────────────────────────────────────────────
  contact: {
    eyebrow: "Inquiry",
    heading: "LET'S TALK.",
    connectLabel: "Connect",
    formLabels: {
      name: "Your Name",
      email: "Email Address",
      message: "How can we help?"
    },
    formPlaceholders: {
      name: "John Doe",
      email: "john@company.com",
      message: "Tell us about your project..."
    },
    submitLabel: "Send Request",
    copyrightLine: "© 2026 Bunny Industries.",
    emailAddress: "bunnyindustries_hsr@yahoo.in",
    whatsappNumber: "919364360603",
    whatsappMessage: "Hello Bunny Industries, I would like to inquire about your precision manufacturing services.",
    formSubmissionEmail: "bunnyindustries_hsr@yahoo.in",
    emailTemplateSubject: "Official Service Request: {name}",
    emailTemplateHeader: "FORMAL SERVICE REQUEST - BUNNY INDUSTRIES",
    emailFooterNote: "Note to IMS Admin: Please reply directly to the sender's email to acknowledge receipt and proceed with the inquiry."
  },

  // ── Footer ──────────────────────────────────────────────────
  footer: {
    brandLine1: "BUNNY",
    brandLine2: "INDUSTRIES",
    unit1: {
      address: "SIDCO Industrial Estate Phase-1, Hosur-635126, Tamil Nadu, India.",
      mapLink: "https://maps.app.goo.gl/Sx3MX6EP6HndtSPq9?g_st=aw"
    },
    unit2: {
      address: "2/2, VTR Road, SF No. 185/2A, Door No. 185/2, Thiruvalluvar Nagar, Zuzuvadi, Hosur-635126.",
      mapLink: "https://maps.app.goo.gl/VXAc7UpvBX72Likc8"
    },
    columnHeadings: {
      links: "Quick Links",
      services: "Our Services",
      company: "Our Company"
    },
    legalLinkLabels: ["Privacy Policy", "Disclaimer", "Terms and Conditions"],
    contactCtaLabel: "Contact Us",
    quickLinks: [
      { label: "Home" },
      { label: "About Us" },
      { label: "Sectors" },
      { label: "Infrastructure" },
      { label: "Certifications" }
    ],
    servicesList: [
      "VMC",
      "CNC TURNING & TURNMILL",
      "EDM WIRECUTTING",
      "EDM SPARKING",
      "CONVENTIONAL MACHINERIES"
    ]
  },

  // ── Legal ────────────────────────────────────────────────────
  legal: {
    privacy: {
      title: "Privacy Policy",
      content: `Bunny Industries ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Bunny Industries and its group companies.

Information Collection: We may collect personal information that you provide to us directly, including but not limited to your name, email address, phone number, company details, and any technical drawings or Request for Quote (RFQ) details submitted through our contact channels. We also automatically collect certain information when you visit, use, or navigate the site, such as your IP address, browser type, and operating system.

Use of Information: The information we collect is used in various ways, including to provide, operate, and maintain our website; improve, personalize, and expand our services; understand and analyze how you use our website; and communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.

Data Security and Confidentiality: As a precision manufacturing firm, we understand the critical nature of intellectual property. Any CAD files, technical blueprints, or proprietary data shared with us for quotation or manufacturing purposes are held in strict confidence. We implement a variety of industry-standard security measures to maintain the safety of your personal and corporate information.

Third-Party Sharing: We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our business partners, trusted affiliates, and advertisers for the purposes outlined above.`
    },
    disclaimer: {
      title: "Disclaimer",
      content: `The information provided by Bunny Industries on this website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.

Technical and Engineering Specifications: The machining capabilities, tolerances, certifications, and metrics displayed on this website are indicative of our general capabilities. They do not constitute a binding technical guarantee or engineering specification for any specific project. All manufacturing tolerances, material properties, and deliverables must be explicitly agreed upon in a formal, written contract or Purchase Order prior to the commencement of production.

Limitation of Liability: Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.

External Links: The site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.`
    },
    terms: {
      title: "Terms and Conditions",
      content: `These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Bunny Industries ("we," "us," or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website, or mobile application related, linked, or otherwise connected thereto.

Intellectual Property Rights: Unless otherwise indicated, the site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws.

User Representations: By using the site, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Terms and Conditions; (2) you will not access the site through automated or non-human means, whether through a bot, script, or otherwise; (3) you will not use the site for any illegal or unauthorized purpose.

Governing Law: These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Hosur, Tamil Nadu.

Modifications: We reserve the right, in our sole discretion, to make changes or modifications to these Terms and Conditions at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Terms and Conditions, and you waive any right to receive specific notice of each such change.`
    }
  }
};

export default defaultContent;
