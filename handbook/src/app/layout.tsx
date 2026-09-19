import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Java DSA Cheatsheet',
  description: 'Fast Java DSA syntax reference — tree-based navigation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <header className="site-header">
          <a href="/"><h1>Java DSA</h1></a>
          <span className="subtitle">Syntax Reference</span>
        </header>
        {children}
      </body>
    </html>
  );
}
