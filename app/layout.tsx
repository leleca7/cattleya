import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/data";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Cattleya | Bolsas & Calçados",
    template: "%s | Cattleya",
  },
  description: "Bolsas e calçados selecionados para acompanhar o seu estilo.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${sans.variable}`}>
        <SiteChrome
          header={<SiteHeader settings={settings} />}
          footer={<SiteFooter settings={settings} />}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
