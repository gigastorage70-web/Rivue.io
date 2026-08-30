import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '../components/Navigation';
import { Header } from '../components/Header';

export const metadata: Metadata = {
  title: 'Rivue — All-in-One SEO, Competitor Intelligence & Digital PR Platform',
  description: 'Rivue consolidates keyword research, technical site audits, backlinks, digital PR CRM, and social scheduling into a unified Chrome Extension & companion web dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased flex min-h-screen">
        <Navigation />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
