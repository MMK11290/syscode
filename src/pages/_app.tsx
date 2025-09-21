// pages/_app.tsx
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import "../styles/globals.css";

// Remove server-side imports and data fetching from _app
export default function App({ Component, pageProps }: AppProps) {
  // Each page will now pass its own data to Layout
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}