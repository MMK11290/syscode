
---

III: Notes / rationale for a few choices

- **`FrontMatter` interface:** I included the core SEO fields you requested (`title`, `description`, `keywords`, `canonicalUrl`) and allowed arbitrary additional fields using an index signature. If you want more strict fields (e.g., `date: string`) we can extend it.  
- **`MDXRemoteSerializeResult` type:** I imported the type from `next-mdx-remote`. If your installed version exposes a different type name, swap or fallback to `any`. Using the proper type helps with downstream rendering code.  
- **`rehype-highlight` plugin typing:** plugin types can sometimes mismatch; I casted it as `any` in a small local array so TypeScript doesn't complain. This keeps strong typing elsewhere while avoiding third-party typing friction.  
- **Error handling:** `getPostBySlug` throws a clear error if the file doesn't exist — this is deliberate: better to fail fast with a helpful message than produce an obscure ENOENT inside a build process. If you prefer silent fallback, we can return `null` instead.  
- **No mutable default arrays:** `fileList?: string[]` + `fileList = fileList ?? []` avoids any ambiguous behavior and is safe under strict rules.

---

IV: How to use these utilities in Next.js pages

Example `getStaticPaths`:

```ts
// pages/[...slug].tsx (or app router equivalent)
import { getStaticPathsFromPosts, getPostBySlug } from 'src/lib/mdx';

export async function getStaticPaths() {
  const paths = getStaticPathsFromPosts();
  return { paths: paths.map(p => ({ params: { slug: p.params.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const slugArray: string[] = Array.isArray(params.slug) ? params.slug : [params.slug];
  const post = await getPostBySlug(slugArray);
  return { props: { post } };
}
