export type ProjectDetail = {
  slug: string;
  title: string;
  role: string;
  quote: string;
  problemStatement: string;
  features: { title: string; description: string }[];
  builtWithLabel?: string;
  techStackLabel?: string;
  techStack: string[];
  whatIDid: string[];
  walkthroughTitle?: string;
  walkthroughLabel?: string;
  tabs: { label: string; images: string[] }[];
};

export const projectDetails: ProjectDetail[] = [
  {
    slug: "armor",
    title: "A.R.M.O.R. System",
    role: "Lead Developer / Full-Stack Developer",
    quote: "Security systems shouldn't feel like a liability.",
    problemStatement:
      "Modern academic institutions face increasing risks from fragmented data systems and insecure digital storage. A.R.M.O.R. was designed to unify school operations while providing role-based access control, AES-256-GCM encrypted file storage, and a complete audit trail of sensitive actions — giving administrators, faculty, and students exactly the level of access they need, nothing more.",
    features: [
      {
        title: "Role-Based Access",
        description:
          "Admin, Faculty, and Student each see only what they need.",
      },
      {
        title: "Encrypted Vault",
        description: "Files secured with AES-256-GCM at rest.",
      },
      {
        title: "Audit Log",
        description: "Immutable trace of every sensitive action.",
      },
      {
        title: "Automated IP Resolution",
        description: "Detects host IPs across networks, no manual config.",
      },
    ],
    techStackLabel: "TECH STACK",
    builtWithLabel: "Built With",
    walkthroughLabel: "WALKTHROUGH",
    walkthroughTitle: "See It In Action",
    techStack: [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "MongoDB",
      "RESTful APIs",
      "JWT Auth",
    ],
    whatIDid: [
      "Led full-stack development of the security and access management platform.",
      "Designed the responsive, user-centric front-end interfaces.",
      "Engineered the automated IP fetcher module for dynamic network resolution.",
      "Documented system architecture with UML use case diagrams and workflow charts.",
    ],
    tabs: [
      { label: "Sign In", images: ["/armor/signin/signin.png"] },
      {
        label: "Admin",
        images: [
          "/armor/admin/admindb.png",
          "/armor/admin/analytics.png",
          "/armor/admin/auditlogs.png",
          "/armor/admin/fileexplorer.png",
          "/armor/admin/students.png",
          "/armor/admin/users.png",
        ],
      },
      {
        label: "Faculty",
        images: [
          "/armor/faculty/facultydb.png",
          "/armor/faculty/faculty_students.png",
          "/armor/faculty/facultyFE.png",
        ],
      },
      {
        label: "Student",
        images: [
          "/armor/students/studentsdb.png",
          "/armor/students/studentsFE.png",
        ],
      },
    ],
  },
  {
    slug: "dnms",
    title: "DNMS (DUNAMIS) CLOTHING LINE",
    role: "Co-Owner & Lead Creative Strategist",
    quote: "A brand isn't just what you sell — it's what people remember.",
    problemStatement:
      "Independent clothing brands often struggle to stand out beyond the product itself. DNMS was built around a complete brand identity from apparel graphics and packaging to social media presence and customer experience so every touchpoint reflects a consistent, memorable identity. Overseeing everything from concept to fulfillment meant design decisions stayed grounded in what the business and its customers actually needed.",
    features: [
      {
        title: "Brand Identity & Concept Development",
        description:
          "Custom apparel design, streetwear aesthetics, and cohesive brand concepts.",
      },
      {
        title: "Social Media Management",
        description:
          "Content creation, promotional campaigns, and direct audience engagement.",
      },
      {
        title: "Client & Order Operations",
        description:
          "Seamless inquiry handling, order tracking, and customer experience support.",
      },
      {
        title: "Inventory & Supply Control",
        description:
          "Optimized stock tracking, supplier coordination, and product fulfillment.",
      },
    ],
    techStackLabel: "DESIGN & PLATFORMS",
    builtWithLabel: "Tools & Platforms",
    walkthroughLabel: "STREETWEAR BRAND & CREATIVE OPERATIONS",
    walkthroughTitle: "The Brand In Motion",
    techStack: [
      "Adobe Illustrator",
      "Canva",
      "Meta Business Suite",
      "Lightroom",
      "Facebook",
      "Tiktok",
      "Instagram",
    ],
    whatIDid: [
      "Co-founded and led the creative direction of the DNMS brand.",
      "Designed the full brand identity including logo, typography, and color system.",
      "Produced all apparel graphics and product mockups.",
      "Managed social media presence and content calendar.",
      "Handled order fulfillment logistics and client communications.",
    ],
    tabs: [
      {
        label: "V1 Collection",
        images: [
          "/dnms/v1/v1 (5).png",
          "/dnms/v1/v1.png",
          "/dnms/v1/v1 (3).png",
          "/dnms/v1/v1 (4).png",
          "/dnms/v1/v1 (2).png",
        ],
      },

      {
        label: "Lip-Lock Collection",
        images: [
          "/dnms/liplock/lp.png",
          "/dnms/liplock/lp (2).png",
          "/dnms/liplock/lp (3).png",
          "/dnms/liplock/lp (4).png",
          "/dnms/liplock/lp (5).png",
          "/dnms/liplock/lp.jpg",
        ],
      },
    ],
  },
  {
    slug: "enov8tive",
    title: "Enov8tive CI V2",
    role: "UI/UX Designer Intern",
    quote: "One design system, two platforms, zero compromises.",
    problemStatement:
      "Enov8tive's mobile application needed a desktop counterpart that felt native to larger screens without breaking the design language users already knew. Working within the senior design team's Figma workflow, the focus was translating mobile screen designs into desktop layouts while preserving component consistency across the entire design system so the experience scaled up without losing what made it work in the first place.",
    features: [
      {
        title: "UI Translation",
        description: "Mobile designs adapted cleanly for desktop viewports.",
      },
      {
        title: "Design System",
        description:
          "Reusable component library built for consistency at scale.",
      },
      {
        title: "Responsive Web",
        description: "Fluid layouts that work across all screen sizes.",
      },
      {
        title: "UX Research",
        description: "User flows validated through wireframe iteration.",
      },
    ],
    techStackLabel: "TECH STACK",
    builtWithLabel: "Design Tools",
    walkthroughLabel: "ENTERPRISE APPLICATION & UI TRANSLATION",
    walkthroughTitle: "Enov8tive CI V2",
    techStack: [
      "Figma",
      "Auto-Layout",
      "Design Systems",
      "Wireframing",
      "Prototyping",
    ],
    whatIDid: [
      "Translated existing mobile UI into a full desktop interface.",
      "Built a scalable component library in Figma.",
      "Designed responsive layouts for all major breakpoints.",
      "Collaborated with the development team to ensure design feasibility.",
      "Iterated on wireframes based on internal feedback and user testing.",
    ],
    tabs: [
      { label: "Dashboard", images: ["/enov8tive/db/db.png"] },
      {
        label: "Workflow & Frames",
        images: [
          "/enov8tive/w&f/w&f (1).png",
          "/enov8tive/w&f/w&f (2).png",
          "/enov8tive/w&f/w&f (3).png",
          "/enov8tive/w&f/w&f (4).png",
          "/enov8tive/w&f/w&f (5).png",
          "/enov8tive/w&f/w&f (6).png",
          "/enov8tive/w&f/w&f (7).png",
          "/enov8tive/w&f/w&f (8).png",
        ],
      },
    ],
  },
  {
    slug: "evergreen",
    title: "Evergreen Banking Super System",
    role: "Lead UI/UX Designer",
    quote: "Enterprise banking shouldn't need a manual.",
    problemStatement:
      "Banking platforms often carry so much functionality that usability becomes an afterthought. Evergreen Banking Super System was designed to hold both a full suite of transaction, dashboard, and onboarding tools built on a clean, responsive visual architecture, so complex financial workflows stay simple enough for everyday use without cutting corners on capability.",
    features: [
      {
        title: "Brand Identity & Concept Strategy",
        description:
          "End-to-end visual identity, custom design systems, and cohesive brand storytelling.",
      },
      {
        title: "Digital Engagement & Content Strategy",
        description:
          "Strategic content creation, targeted audience growth, and community management.",
      },
      {
        title: "Client Operations & Fulfillment",
        description:
          "End-to-end inquiry resolution, order tracking workflows, and client support systems.",
      },
      {
        title: "Supply Chain & Inventory Management",
        description:
          "Scalable stock management, vendor relations, and streamlined logistics control.",
      },
    ],
    techStackLabel: "DESIGN & DEV STACK",
    builtWithLabel: "Design Tools & Systems",
    walkthroughLabel: "UI/UX DESIGN & PRODUCT SYSTEM CASE STUDY",
    walkthroughTitle: "Evergreen",
    techStack: [
      "Figma",
      "Auto-Layout",
      "Design Systems",
      "Prototyping",
      "User Flow & Site Mapping",
      "Responsive Web Design",
    ],
    whatIDid: [
      "Designed the full UI/UX system for the Evergreen banking platform.",
      "Built a token-based design system covering color, typography, and spacing.",
      "Architected user flows for core banking features.",
      "Created high-fidelity prototypes for stakeholder presentations.",
      "Ensured WCAG compliance across all interface components.",
    ],
    tabs: [
      {
        label: "Design System & Flow",
        images: [
          "/eg/eg (1).png",
          "/eg/eg (2).png",
          "/eg/eg (3).png",
          "/eg/eg (4).png",
          "/eg/eg (5).png",
          "/eg/eg (6).png",
          "/eg/eg (7).png",
          "/eg/eg (8).png",
        ],
      },
    ],
  },
];
