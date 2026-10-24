import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { HighlightProvider } from '@/context/HighlightContext';

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
    <html lang="en" className="dark h-full antialiased bg-[#111111] text-[#ededed]">
      <body className="min-h-full flex flex-col bg-[#111111] text-[#ededed] font-sans selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
        <AuthProvider>
          <HighlightProvider>{children}</HighlightProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
