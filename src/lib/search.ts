// src/lib/search.ts
// Server-side search index builder
import { getAllMdxFiles, filePathToSlug, contentDirectory, getPlainTextFromMdx } from './mdx.server.js';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import type { FrontMatter } from './mdx.server';

/**
 * Searchable item shape for Fuse.js index.
 */
export interface SearchItem {
  slug: string[]; // e.g., ['linux', 'tips']
  title: string;
  description?: string;
  keywords?: string[];
  content: string; // Plain text extracted from MDX
}

/**
 * Generates an array of searchable items from all MDX files.
 */
export async function getSearchIndex(): Promise<SearchItem[]> {
  const files = getAllMdxFiles(contentDirectory);
  const index: SearchItem[] = [];

  for (const filePath of files) {
    try {
      const slug = filePathToSlug(filePath);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data: frontMatterRaw, content } = matter(raw);
      const frontMatter = (frontMatterRaw && typeof frontMatterRaw === 'object') ? (frontMatterRaw as FrontMatter) : {};

      const plainContent = await getPlainTextFromMdx(content);

      // Normalize keywords: accept string (comma-separated) or array
      let keywords: string[] | undefined;
      if (Array.isArray(frontMatter.keywords)) {
        keywords = frontMatter.keywords.map(String).map((s) => s.trim()).filter(Boolean);
      } else if (typeof frontMatter.keywords === 'string') {
        keywords = frontMatter.keywords.split(',').map((s) => s.trim()).filter(Boolean);
      }

      // Determine title (fall back safely)
      const lastSegment = slug.length > 0 ? slug[slug.length - 1] : undefined;
      const title = (frontMatter.title && String(frontMatter.title).trim()) || lastSegment || 'Untitled';

      index.push({
        slug,
        title,
        description: typeof frontMatter.description === 'string' ? frontMatter.description : undefined,
        keywords,
        content: plainContent,
      });
    } catch (err) {
      console.error(`Error processing ${filePath} for search index:`, err);
      // Skip invalid files but continue building index
    }
  }

  return index;
}