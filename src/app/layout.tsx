import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { AnalysisProvider } from "@/context/AnalysisContext";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = "ResumeIQ";
const description =
  "AI-powered resume analysis that compares your resume against live market requirements and highlights the gaps to fix.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | AI Resume Analyzer`,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  keywords: [
    "resume analyzer",
    "AI resume review",
    "ATS score",
    "job requirements",
    "professional resume",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName,
    title: `${siteName} | AI Resume Analyzer`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | AI Resume Analyzer`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>
          <AnalysisProvider>{children}</AnalysisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
