// src/scripts/generate-search-index.ts
import { promises as fs } from 'fs';
import * as path from 'path';
import { getSearchIndex } from '../lib/search.js';

async function generate() {
  try {
    const index = await getSearchIndex();

    // اطمینان از اینکه قابل سریالایز است (می‌پرتد اگر circular ref داشته باشد)
    JSON.stringify(index);

    const outDir = path.join(process.cwd(), 'public');
    await fs.mkdir(outDir, { recursive: true });

    const outputPath = path.join(outDir, 'search-index.json');
    const tmpPath = outputPath + '.tmp';

    // نوشتن در فایل موقتی و سپس rename (atomic-ish)
    await fs.writeFile(tmpPath, JSON.stringify(index), 'utf-8');
    await fs.rename(tmpPath, outputPath);

    console.log(`Search index generated at ${outputPath}`);
  } catch (err) {
    console.error('Error generating search index:', err);
    process.exit(1);
  }
}

generate();