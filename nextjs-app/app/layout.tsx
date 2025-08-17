import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider"; // ✅ import

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: "Recallify - AI-Powered Learning & Memory Tools",
  description: "Transform your learning with AI-powered flashcards, quizzes, and study assistance. Boost memory retention and academic performance with Recallify.",
  keywords: ["AI learning", "educational tools", "flashcards", "quiz maker", "study assistant", "memory improvement"],
  authors: [{ name: "Recallify Team" }],
  openGraph: {
    title: "Recallify - AI-Powered Learning Tools",
    description: "Transform your learning with AI-powered flashcards, quizzes, and study assistance.",
    type: "website",
    url: 'http://localhost:3000',
    siteName: 'Recallify',
    images: [
      {
        url: '/api/og', // You can create an Open Graph image API route later
        width: 1200,
        height: 630,
        alt: 'Recallify - AI-Powered Learning Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recallify - AI-Powered Learning Tools',
    description: 'Transform your learning with AI-powered flashcards, quizzes, and study assistance.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider> {/* ✅ wrap children */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
