// pages/[...slug].tsx
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import type { PostResult } from '@/lib/mdx'; // Import types from client-side version

type Props = {
  post: PostResult;
};

export default function PostPage({ post }: Props) {
  const { frontMatter, mdxSource } = post;

  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
        {frontMatter.description && (
          <meta name="description" content={frontMatter.description} />
        )}
        {frontMatter.keywords && (
          <meta name="keywords" content={
            Array.isArray(frontMatter.keywords) 
              ? frontMatter.keywords.join(', ') 
              : frontMatter.keywords
          } />
        )}
        {frontMatter.canonicalUrl && (
          <link rel="canonical" href={frontMatter.canonicalUrl} />
        )}
      </Head>

      <article className="prose mx-auto p-4">
        <MDXRemote {...mdxSource} />
      </article>
    </>
  );
}

// getStaticPaths: Generate paths from MDX files
export const getStaticPaths: GetStaticPaths = async () => {
  // Dynamically import server-side functions to avoid client-side execution
  const { getStaticPathsFromPosts } = await import('@/lib/mdx.server');
  const paths = getStaticPathsFromPosts();
  
  return {
    paths,
    fallback: false, // Set to 'blocking' if you want to support new posts without rebuilding
  };
};

// getStaticProps: Load content based on slug
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Dynamically import server-side functions
  const { getPostBySlug } = await import('@/lib/mdx.server');
  
  const slugArray: string[] = Array.isArray(params?.slug) 
    ? params.slug 
    : [params?.slug as string];
  
  try {
    const post = await getPostBySlug(slugArray);
    return { 
      props: { post },
      // Revalidate at most every hour (optional for static sites with infrequent updates)
    };
  } catch (error) {
    // Handle 404 cases
    return {
      notFound: true,
    };
  }
};