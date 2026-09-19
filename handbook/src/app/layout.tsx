import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Java DSA Cheatsheet',
  description: 'Fast Java DSA syntax reference — tree-based navigation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <header className="site-header">
          <Link href="/">
            <h1>Java DSA</h1>
          </Link>
          <span className="subtitle">Syntax Reference</span>
        </header>
        {children}
      </body>
    </html>
  );
}
