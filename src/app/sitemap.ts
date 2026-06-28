import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://loveingame.kz";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/#pricing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/#games`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#tournaments`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/#contacts`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
