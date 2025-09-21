import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMenu, FiX } from 'react-icons/fi';
import { FrontMatter } from '@/lib/mdx.server';
import styles from './DocsLayout.module.css';

type PostMeta = {
  slug: string[];
  frontMatter: FrontMatter;
};

type DocsLayoutProps = {
  posts: PostMeta[];
  children: React.ReactNode;
};

const DocsLayout = ({ posts, children }: DocsLayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.container}>
      {/* This button appears only on mobile to toggle the menu */}
      <button className={styles.menuButton} onClick={toggleSidebar} aria-label="Toggle Menu">
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* This dark overlay appears only when the mobile menu is open */}
      {isSidebarOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}

      {/* The 'sidebarOpen' class is added/removed based on the button click */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <nav>
          <h2 className={styles.sidebarTitle}>All Posts</h2>
          <ul>
            {posts.map((p) => {
              const slugPath = '/' + p.slug.join('/');
              const title =
                (p.frontMatter.title && String(p.frontMatter.title)) ||
                p.slug[p.slug.length - 1] ||
                'Untitled';
              const isActive = router.asPath === slugPath;

              return (
                <li key={slugPath}>
                  <Link href={slugPath} className={isActive ? styles.activeLink : ''}>
                    {title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default DocsLayout;