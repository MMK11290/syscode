'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { SearchItem } from '@/lib/search';
import styles from './Search.module.css';

/**
 * Lightweight local types to avoid "Fuse only refers to a type" TS errors.
 * These are intentionally small subsets of the real Fuse types and are
 * sufficient for our usage here.
 */
type FuseKey<T> = string | { name: string; weight?: number };

type FuseOptionsLocal<T> = {
  keys?: Array<FuseKey<T>>;
  threshold?: number;
  ignoreLocation?: boolean;
  minMatchCharLength?: number;
  includeScore?: boolean;
  includeMatches?: boolean;
  // any extra options allowed
  [key: string]: unknown;
};

type FuseResultLocal<T> = {
  item: T;
  refIndex?: number;
  score?: number | null;
  matches?: unknown[];
};

const defaultFuseOptions: FuseOptionsLocal<SearchItem> = {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'description', weight: 0.2 },
    { name: 'keywords', weight: 0.1 },
    { name: 'content', weight: 0.3 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
};

interface SearchProps {
  fuseOptions?: FuseOptionsLocal<SearchItem>;
}

const Search: React.FC<SearchProps> = ({ fuseOptions = defaultFuseOptions }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FuseResultLocal<SearchItem>[]>([]);
  const [index, setIndex] = useState<SearchItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadIndex() {
      try {
        const res = await fetch('/search-index.json');
        if (!res.ok) throw new Error(`Failed to load search index: ${res.status} ${res.statusText}`);
        const data: SearchItem[] = await res.json();
        if (mounted) setIndex(data);
      } catch (err) {
        if (mounted) setError((err as Error).message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadIndex();
    return () => {
      mounted = false;
    };
  }, []);

  const fuse = useMemo(() => {
    if (!index) return null;
    // cast options to `any` because we're using local typed subset
    return new Fuse(index, fuseOptions as any);
  }, [index, fuseOptions]);

  // debounced search using a ref for the timer (browser-friendly types)
  const handleSearch = useCallback(
    (q: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      if (!fuse || !q.trim()) {
        setResults([]);
        return;
      }

      timerRef.current = setTimeout(() => {
        try {
          const res = fuse.search(q);
          // adapt Fuse results to our local type
          const adapted: FuseResultLocal<SearchItem>[] = (res as any).map((r: any) => ({
            item: r.item,
            refIndex: r.refIndex,
            score: typeof r.score === 'number' ? r.score : r.score ?? null,
            matches: r.matches,
          }));
          setResults(adapted);
        } catch (err) {
          console.error('Fuse search error:', err);
          setResults([]);
        }
      }, 300);
    },
    [fuse]
  );

  useEffect(() => {
    handleSearch(query);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [query, handleSearch]);

  if (loading) return <div>Loading search index...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <input
        type="search"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchInput} // Use a CSS class instead of inline style
      />
      {query && results.length === 0 && <p>No results found.</p>}
      <ul className={styles.resultsList}>
        {results.map((result, idx) => {
          const slugPath = result.item.slug.length ? '/' + result.item.slug.join('/') : '/';
          const key = result.item.slug.join('-') || result.item.title || `res-${idx}`;
          return (
            <li key={key} className={styles.resultItem}>
              <Link href={slugPath}>
                <h3>{result.item.title}</h3>
              </Link>
              <p>
                {(result.item.description ? result.item.description.slice(0, 150) : result.item.content.slice(0, 150)) + '...'}
              </p>
              <small>{typeof result.score === 'number' ? `Score: ${result.score.toFixed(2)}` : null}</small>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Search;