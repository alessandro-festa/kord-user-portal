import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SUSE AI Universal Proxy - User Portal',
  description: 'SUSE MCP Adapter Configuration Portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/img/favicon.ico" />
        <link rel="stylesheet" href="/assets/main.css" />
        <script src="/assets/main.js" defer></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
