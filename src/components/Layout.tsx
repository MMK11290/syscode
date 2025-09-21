// components/Layout.tsx
import React from 'react';
import Head from 'next/head';
import Search from './Search';

type PostItem = {
  slug: string[];
  frontMatter: {
    title?: string;
    description?: string;
    keywords?: string[] | string;
    canonicalUrl?: string;
    [key: string]: unknown;
  };
};

type LayoutProps = {
  children: React.ReactNode;
  posts?: PostItem[]; // Make posts optional
};

const Layout = ({ children, posts }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>MDX Blog</title>
        <meta name="description" content="A blog with MDX and search" />
      </Head>
      <header>
        <h1>My MDX Blog</h1>
        <Search />
        {/* Optional: Display posts navigation */}
        {posts && posts.length > 0 && (
          <nav>
            <h2>Recent Posts</h2>
            <ul>
              {posts.slice(0, 5).map(post => (
                <li key={post.slug.join('/')}>
                  <a href={`/${post.slug.join('/')}`}>
                    {post.frontMatter.title || 'Untitled'}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
      <main>{children}</main>
      <footer>© {new Date().getFullYear()}</footer>
    </>
  );
};

export default Layout;