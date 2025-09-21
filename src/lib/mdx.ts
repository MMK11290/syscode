// src/lib/mdx.ts
// This file contains only type definitions and client-safe utilities

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
  mdxSource: any; // We can't import MDXRemoteSerializeResult on client side
};

// Empty implementations for client-side (these will throw if called)
export const contentDirectory = '';

export function getAllMdxFiles(dir?: string, fileList?: string[]): string[] {
  throw new Error('getAllMdxFiles can only be used on the server side');
}

export function filePathToSlug(filePath: string): string[] {
  throw new Error('filePathToSlug can only be used on the server side');
}

export async function getPostBySlug(slugArray: string[]): Promise<PostResult> {
  throw new Error('getPostBySlug can only be used on the server side');
}

export function getAllPosts(): Array<{ slug: string[]; frontMatter: FrontMatter }> {
  throw new Error('getAllPosts can only be used on the server side');
}

export function getStaticPathsFromPosts(): Array<{ params: { slug: string[] } }> {
  throw new Error('getStaticPathsFromPosts can only be used on the server side');
}

export async function getPlainTextFromMdx(content: string): Promise<string> {
  throw new Error('getPlainTextFromMdx can only be used on the server side');
}