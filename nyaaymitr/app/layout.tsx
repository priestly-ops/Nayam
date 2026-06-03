import type { Metadata, Viewport } from 'next';
import { DM_Sans, Noto_Sans_Devanagari, Playfair_Display } from 'next/font/google';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const notoDevanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-noto-devanagari' });

export const metadata: Metadata = {
  title: 'NyaayMitr',
  description: 'Secure legal consultation and advocate directory platform',
};

export const viewport: Viewport = {
  themeColor: '#132240',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable} ${notoDevanagari.variable} bg-nyaay-surface text-nyaay-cream antialiased`}>
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <div id="main-content" tabIndex={-1}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </body>
    </html>
  );
}
