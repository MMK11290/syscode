import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeHighlight from 'rehype-highlight';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import removeMarkdown from 'remove-markdown';
import { visit, SKIP, CONTINUE } from 'unist-util-visit';
import type { Node, Parent } from 'unist';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

/**
 * Core front-matter fields used for SEO + allow arbitrary extra fields.
 */
export interface FrontMatter {
  title?: string;
  description?: string;
  keywords?: string[] | string;
  canonicalUrl?: string;
  // allow arbitrary future fields
  [key: string]: unknown;
}

/**
 * Return-type for getPostBySlug
 */
export type PostResult = {
  slug: string[]; // array of path segments
  frontMatter: FrontMatter;
  mdxSource: MDXRemoteSerializeResult;
};

/** Path to the MDX content root directory */
export const contentDirectory: string = path.join(process.cwd(), 'src', 'contents');

/**
 * Recursively reads all .mdx files under a directory and returns full absolute paths.
 * - Uses a safe optional fileList param to avoid mutable default traps.
 * @param dir absolute directory path (default: contentDirectory)
 * @param fileList optional accumulator (will be initialized if omitted)
 * @returns array of absolute file paths (strings) ending with .mdx
 */
export function getAllMdxFiles(dir: string = contentDirectory, fileList?: string[]): string[] {
  fileList = fileList ?? [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllMdxFiles(fullPath, fileList);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.mdx')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

/**
 * Converts a full MDX file path to a slug array for routing.
 * E.g. "/.../src/contents/linux/tips.mdx" -> ['linux', 'tips']
 * E.g. "/.../src/contents/linux/index.mdx" -> ['linux']
 *
 * Uses path.parse for cross-platform safety.
 * @param filePath absolute path to the .mdx file
 */
export function filePathToSlug(filePath: string): string[] {
  const relPath = path.relative(contentDirectory, filePath);
  // Use path.parse to reliably get dir and name
  const parsed = path.parse(relPath);
  const dirPart = parsed.dir ? parsed.dir.split(path.sep).filter(Boolean) : [];
  const name = parsed.name; // does NOT include extension
  if (name.toLowerCase() === 'index') {
    return dirPart;
  }
  return [...dirPart, name];
}

/**
 * Loads a single MDX file given a slug (array of segments), parses frontmatter,
 * serializes MDX for next-mdx-remote, and returns structured data.
 *
 * Behavior:
 * - If slugArray is empty ([]) it will try to read `${contentDirectory}/index.mdx`
 * - Throws a descriptive Error if the resolved file does not exist or read fails
 *
 * @param slugArray array of path segments like ['linux', 'tips']
 */
export async function getPostBySlug(slugArray: string[]): Promise<PostResult> {
  // explicit handling of empty slug -> root index.mdx
  let resolvedPath: string;
  if (!Array.isArray(slugArray)) {
    throw new TypeError('getPostBySlug expects slugArray: string[]');
  }

  if (slugArray.length === 0) {
    resolvedPath = path.join(contentDirectory, 'index.mdx');
  } else {
    resolvedPath = path.join(contentDirectory, ...slugArray) + '.mdx';
  }

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`MDX file not found: ${resolvedPath}`);
  }

  try {
    const raw = fs.readFileSync(resolvedPath, 'utf-8');
    const { data: dataRaw, content } = matter(raw);

    // ensure frontMatter conforms at least to an object shape
    const frontMatter = (dataRaw && typeof dataRaw === 'object') ? (dataRaw as FrontMatter) : {};

    // Cast plugin if TS complains about plugin types
    const rehypePlugins: Array<any> = [rehypeHighlight as any];

    const mdxSource: MDXRemoteSerializeResult = await serialize(content, {
      mdxOptions: {
        rehypePlugins,
      },
    });

    return {
      slug: slugArray,
      frontMatter,
      mdxSource,
    };
  } catch (err) {
    // Wrap with context to help debugging at runtime
    throw new Error(`Failed to load/serialize MDX at ${resolvedPath}: ${(err as Error).message}`);
  }
}

/**
 * Reads all MDX files recursively and returns an array of `{ slug, frontMatter }`
 * Useful for creating index pages or generating `getStaticPaths`.
 */
export function getAllPosts(): Array<{ slug: string[]; frontMatter: FrontMatter }> {
  const files = getAllMdxFiles(contentDirectory);
  const posts = files.map((filePath) => {
    const slug = filePathToSlug(filePath);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data: dataRaw } = matter(raw);
    const frontMatter = (dataRaw && typeof dataRaw === 'object') ? (dataRaw as FrontMatter) : {};
    return { slug, frontMatter };
  });
  return posts;
}

/**
 * Optional helper that returns a list of paths suitable for Next.js getStaticPaths
 * Example: [{ params: { slug: ['linux','tips'] } }, ...]
 */
export function getStaticPathsFromPosts(): Array<{ params: { slug: string[] } }> {
  return getAllPosts().map((p) => ({ params: { slug: p.slug } }));
}

/**
 * Extracts plain text from MDX content, stripping code blocks, JSX, and formatting.
 * Uses remark to parse MDX, removes code nodes, then strips to plain text.
 * @param content MDX content string (after frontmatter)
 * @returns Plain text string
 */
export async function getPlainTextFromMdx(content: string): Promise<string> {
  try {
    const processor = remark().use(remarkMdx);
    const tree = processor.parse(content);

    // Remove code blocks to avoid indexing code
    visit(tree, 'code', (_node: Node, index: number | undefined, parent: Parent | undefined) => {
      if (parent && index !== undefined) {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
      return CONTINUE;
    });

    // Stringify back to markdown, then remove markdown formatting
    const mdString = processor.stringify(tree);
    const plainText = removeMarkdown(mdString).replace(/\n+/g, ' ').trim();

    return plainText;
  } catch (err) {
    console.error('Error extracting plain text from MDX:', err);
    return ''; // Fallback to empty on error
  }
}