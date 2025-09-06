import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/auth-provider";
import { QueryProvider } from "@/components/query-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

/**
 * Inter font configuration for the skillex application
 * Provides clean, professional typography matching the design system
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Application metadata
 * Defines the title, description, and other meta information for the skillex app
 */
export const metadata: Metadata = {
  title: "skillex - Professional Skill Exchange Network",
  description: "Connect with professionals to exchange skills through structured learning cohorts and 1:1 swaps. Learn new skills while teaching others.",
  keywords: ["skill exchange", "professional network", "learning", "teaching", "cohorts", "skill swap"],
  authors: [{ name: "skillex Team" }],
  creator: "skillex",
  publisher: "skillex",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000"),
  openGraph: {
    title: "skillex - Professional Skill Exchange Network",
    description: "Connect with professionals to exchange skills through structured learning cohorts and 1:1 swaps.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "skillex - Professional Skill Exchange Network",
    description: "Connect with professionals to exchange skills through structured learning cohorts and 1:1 swaps.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/**
 * Root layout component for the skillex application
 * Provides the base HTML structure and font configuration
 * 
 * @param children - Child components to render
 * @returns Root layout JSX
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1">
                  {children}
                </main>
              </div>
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
