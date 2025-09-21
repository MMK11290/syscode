// src/pages/index.tsx
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps, NextPage } from 'next';
import Layout from '../components/Layout';
import Search from '../components/Search';
import type { FrontMatter } from '../lib/mdx.server';
import { getAllPosts } from '../lib/mdx.server';

type PostMeta = {
  slug: string[]; 
  frontMatter: FrontMatter;
};

type Props = {
  posts: PostMeta[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const posts = getAllPosts();

    // Optional: sort posts. Here we sort by title (fallback to slug last segment).
    posts.sort((a, b) => {
      const aTitle = (a.frontMatter.title ?? (a.slug[a.slug.length - 1] ?? '')).toString().toLowerCase();
      const bTitle = (b.frontMatter.title ?? (b.slug[b.slug.length - 1] ?? '')).toString().toLowerCase();
      return aTitle.localeCompare(bTitle);
    });

    return {
      props: {
        posts,
      },
    };
  } catch (err) {
    // In case of error during build, return empty list but don't fail the whole build unexpectedly.
    console.error('getStaticProps error in index:', err);
    return {
      props: { posts: [] },
    };
  }
};

const IndexPage: NextPage<Props> = ({ posts }) => {
  return (
    <Layout>
      <Head>
        <title>Docs / Tips — Sys Code</title>
        <meta name="description" content="A collection of system tips and how-tos (MDX-based)." />
      </Head>

      <main style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
        <header style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>Things Everyone Should Know — Index</h1>
          <p style={{ marginTop: '.5rem', color: '#555' }}>
            Browse guides and tips. Use the search box below to quickly find articles.
          </p>
        </header>

        {/* Client-side search (loads /search-index.json) */}
        <section style={{ marginBottom: '2rem' }}>
          <Search />
        </section>

        <section>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '.5rem' }}>All posts</h2>
          {posts.length === 0 ? (
            <p>No posts found.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {posts.map((p, idx) => {
                const slugPath = p.slug.length ? '/' + p.slug.join('/') : '/';
                const title = (p.frontMatter.title && String(p.frontMatter.title)) || (p.slug[p.slug.length - 1] ?? 'Untitled');
                const desc = typeof p.frontMatter.description === 'string' ? p.frontMatter.description : undefined;
                const key = p.slug.join('-') || `post-${idx}`;

                return (
                  <li key={key} style={{ padding: '0.75rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <Link href={slugPath}>
                      <a style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 style={{ margin: '0 0 .25rem 0' }}>{title}</h3>
                      </a>
                    </Link>
                    {desc ? (
                      <p style={{ margin: 0, color: '#444' }}>{desc}</p>
                    ) : (
                      <p style={{ margin: 0, color: '#777' }}>{p.slug.join(' / ')}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </Layout>
  );
};

export default IndexPage;