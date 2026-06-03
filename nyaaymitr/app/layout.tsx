import type { Metadata } from 'next';
import { DM_Sans, Noto_Sans_Devanagari, Playfair_Display } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const notoDevanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-noto-devanagari' });

export const metadata: Metadata = {
  title: 'NyaayMitr',
  description: 'Secure legal consultation and advocate directory platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${playfair.variable} ${notoDevanagari.variable} bg-nyaay-surface text-nyaay-navy antialiased`}>
        {children}
      </body>
    </html>
  );
}
