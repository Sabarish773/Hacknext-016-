import type { Metadata } from 'next';
import { Playfair_Display, Inter, Great_Vibes } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { HighlightProvider } from '@/context/HighlightContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-cursive',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Doc.DOOM — Enterprise Information Intelligence',
  description:
    'AI-powered information intelligence system that understands documents, discovers structured facts, detects missing and conflicting information, generates document-specific visualizations, and enables verified action.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8F3F0] text-[#0B192C] font-sans selection:bg-[#014BAA]/15 selection:text-[#014BAA]">
        <AuthProvider>
          <HighlightProvider>{children}</HighlightProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
