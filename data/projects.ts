export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  // Your own thumbnail, e.g. "/thumbs/armor.png". Leave empty to show the placeholder.
  image?: string;
  // Placeholder styling (only used when image is empty)
  thumbLabel: string;
  thumbBg: string;
  thumbText: string;
};

export const projects: Project[] = [
  {
    slug: "armor",
    title: "A.R.M.O.R. System",
    description:
      "Security & access management platform with role-based dashboards.",
    tags: ["Full-Stack", "UI / UX", "Security"],
    image: "/thumbs/armor.png",
    thumbLabel: "A.R.M.O.R.",
    thumbBg: "bg-bg",
    thumbText: "text-ink",
  },
  {
    slug: "dnms",
    title: "DNMS Clothing Line",
    description: "Streetwear brand identity, apparel design, and social media.",
    tags: ["Brand Identity", "Apparel", "Social Media"],
    image: "/thumbs/dnms.png",
    thumbLabel: "DNMS",
    thumbBg: "bg-ink",
    thumbText: "text-bg",
  },
  {
    slug: "enov8tive",
    title: "Enov8tive CI V2",
    description: "Mobile-to-desktop UI translation for an enterprise app.",
    tags: ["UI/UX Design", "Responsive Web", "Design Systems"],
    image: "/thumbs/enov8tive.png",
    thumbLabel: "Enov8tive",
    thumbBg: "bg-ink",
    thumbText: "text-bg",
  },
  {
    slug: "evergreen",
    title: "Evergreen Banking Super System",
    description:
      "Enterprise banking system with a full design system and flows.",
    tags: ["UI/UX Design", "Design Systems", "Responsive Web"],
    image: "/thumbs/evergreen.png",
    thumbLabel: "EVERGREEN",
    thumbBg: "bg-[#0f6e56]",
    thumbText: "text-ink",
  },
];
