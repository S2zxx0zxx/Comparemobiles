import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { MobileDock } from "@/components/mobile-dock";
import { Footer } from "@/components/footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "CompareMobile — Compare smarter. Choose better.", template: "%s · CompareMobile" },
  description: "Smartphone discovery and comparison platform for specs, source-backed insights and better buying decisions.",
  openGraph: {
    title: "CompareMobile",
    description: "Compare smarter. Choose better.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="min-h-screen">
          <SiteHeader />
          <main>{children}</main>
          <Footer />
          <MobileDock />
        </div>
      </body>
    </html>
  );
}
