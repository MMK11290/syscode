// pages/_app.tsx
import type { AppProps } from "next/app";
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { ThemeProvider } from '@/components/ThemeContext';
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Navbar />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </ThemeProvider>
  );
}