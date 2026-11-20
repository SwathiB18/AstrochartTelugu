import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { Noto_Sans_Telugu } from 'next/font/google';
import type { Metadata } from 'next';
const notoTelugu = Noto_Sans_Telugu({
  subsets: ['telugu', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-telugu',
});

export const metadata: Metadata = {
  title: 'AstroChart Telugu',
  description: 'Interactive Natal Horoscope SVG Engine & Ephemeris Calculator ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="te" className={notoTelugu.variable}>
      <body className="bg-light text-dark" style={{ fontFamily: 'var(--font-noto-telugu), sans-serif' }}>
        {children}
      </body>
    </html>
  );
}