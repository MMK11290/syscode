import type { AppProps } from "next/app";
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { ThemeProvider } from '@/components/ThemeContext';
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <div className="app-container">
        <Navbar />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}