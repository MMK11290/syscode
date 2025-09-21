import type { Metadata } from 'next';
import { Html, Head, Main, NextScript } from "next/document";

// Define metadata using the Metadata type
export const metadata: Metadata = {
  title: 'Syscode',
  description: 'Cheatsheets, tips, and tricks for Linux, Windows, and system optimization.',
  keywords: ['Linux cheatsheet', 'Windows tweaks', 'Syscode', 'system tips', 'programming', 'optimization'],
  authors: [{ name: 'Syscode' }],
  openGraph: {
    title: 'Syscode',
    description: 'Explore cheatsheets, tips, and tricks for Linux and Windows on Syscode.',
    type: 'website',
    url: 'https://syscode.pages.dev/',
    images: [
      {
        url: 'https://syscode.pages.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Syscode - System tips',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Syscode',
    description: 'Explore cheatsheets, tips, and tricks for Linux and Windows on Syscode.',
    images: ['https://syscode.pages.dev/og-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Fonts (Inter for English text) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased bg-gray-50 text-gray-900 font-inter">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}