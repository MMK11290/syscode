// src/scripts/generate-sitemap.ts
import { promises as fs } from 'fs';
import * as path from 'path';
import { getAllPosts } from '../lib/mdx.server.js';

// The base URL of your website
const siteUrl = 'https://syscode.pages.dev/'; 

async function generateSitemap() {
  console.log('Generating sitemap...');

  try {
    // 1. Get all MDX post slugs
    const posts = getAllPosts(); //
    const postUrls = posts.map(({ slug }) => {
      const slugPath = slug.join('/');
      return `<url><loc>${siteUrl}/${slugPath}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`;
    });

    // 2. Add static pages (like the homepage)
    const staticUrls = [
      `<url><loc>${siteUrl}/</loc><lastmod>${new Date().toISOString()}</lastmod></url>`,
    ];
    
    // 3. Combine all URLs
    const allUrls = [...staticUrls, ...postUrls];

    // 4. Generate the sitemap XML content
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.join('\n  ')}
</urlset>`;

    // 5. Write the sitemap to the public directory
    const outDir = path.join(process.cwd(), 'public');
    await fs.mkdir(outDir, { recursive: true });
    const sitemapPath = path.join(outDir, 'sitemap.xml');
    await fs.writeFile(sitemapPath, sitemapContent, 'utf-8');

    console.log(`Sitemap generated successfully at ${sitemapPath}`);
  } catch (err) {
    console.error('Error generating sitemap:', err);
    process.exit(1);
  }
}

generateSitemap();