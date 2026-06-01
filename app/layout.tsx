import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PesaMind Dashboard',
  description: 'Founder dashboard with analytics and metrics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
