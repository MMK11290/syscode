// pages/_document.tsx
// This file is for Font, Meta Tags, Preload scripts like Analyts
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Meta tags for SEO */}
        <meta charSet="utf-8" />
        <meta name="description" content="Syscode - Cheatsheets, tips, and tricks for Linux, Windows, and system optimization." />
        <meta name="keywords" content="Linux cheatsheet, Windows tweaks, Syscode, system tips, programming, optimization" />
        <meta name="author" content="Syscode" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />

        {/* Open Graph / Social sharing */}
        <meta property="og:title" content="Syscode" />
        <meta property="og:description" content="Explore cheatsheets, tips, and tricks for Linux and Windows on Syscode." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://syscode.com" />
        <meta property="og:image" content="https://syscode.com/og-image.png" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

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
