import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ValidateAI - Validate Your Startup Ideas with AI",
  description: "Get comprehensive startup idea validation with AI-powered insights, market research, and competitor analysis. Free tier available.",
  keywords: "startup validation, AI analysis, market research, business ideas, entrepreneur tools",
  authors: [{ name: "ValidateAI" }],
  openGraph: {
    title: "ValidateAI - Validate Your Startup Ideas with AI",
    description: "Get comprehensive startup idea validation with AI-powered insights, market research, and competitor analysis.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ValidateAI - Validate Your Startup Ideas with AI",
    description: "Get comprehensive startup idea validation with AI-powered insights, market research, and competitor analysis.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased font-sans dark-gradient-bg min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
