import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E7D8CC",
};

export const metadata: Metadata = {
  title: {
    default: "LOVE IN GAME — Премиальное игровое кафе PlayStation 5",
    template: "%s | LOVE IN GAME",
  },
  description:
    "Современное игровое пространство премиального уровня с PlayStation 5. Уютная атмосфера, качественный сервис и вкусная кухня. Забронируйте место прямо сейчас.",
  keywords: [
    "игровое кафе",
    "PlayStation 5",
    "PS5",
    "игровой клуб",
    "аренда PS5",
    "LOVE IN GAME",
    "бронирование",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: "LOVE IN GAME — Премиальное игровое кафе PS5",
    description:
      "Современное игровое пространство премиального уровня. PlayStation 5, уютная атмосфера, вкусная кухня.",
    siteName: "LOVE IN GAME",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOVE IN GAME — Премиальное игровое кафе PS5",
    description:
      "Современное игровое пространство премиального уровня. PlayStation 5, уютная атмосфера, вкусная кухня.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
