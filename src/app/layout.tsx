import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { HighlightProvider } from '@/context/HighlightContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Doc.DOOM — Enterprise Information Intelligence',
  description:
    'AI-powered information intelligence system that understands documents, discovers structured facts, detects missing and conflicting information, generates document-specific visualizations, and enables verified action.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased bg-slate-950 text-slate-100">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans`}>
        <AuthProvider>
          <HighlightProvider>{children}</HighlightProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
