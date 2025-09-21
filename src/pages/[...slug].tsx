import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import type { PostResult } from '@/lib/mdx';
import { getAllPosts } from '@/lib/mdx.server';
import DocsLayout from '@/layout/DocsLayout'; 

type Props = {
  post: PostResult;
  posts: Array<{ slug: string[]; frontMatter: any }>;
};

export default function PostPage({ post, posts }: Props) {
  const { frontMatter, mdxSource } = post;

  return (
    <>
      <Head>
        <title>{frontMatter.title}</title>
        {frontMatter.description && (
          <meta name="description" content={frontMatter.description} />
        )}
        {frontMatter.keywords && (
          <meta
            name="keywords"
            content={
              Array.isArray(frontMatter.keywords)
                ? frontMatter.keywords.join(', ')
                : frontMatter.keywords
            }
          />
        )}
        {frontMatter.canonicalUrl && (
          <link rel="canonical" href={frontMatter.canonicalUrl} />
        )}
      </Head>

      <DocsLayout posts={posts}>
        <article className="prose prose-sm sm:prose lg:prose-lg mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 max-w-none">
          <MDXRemote {...mdxSource} />
        </article>
      </DocsLayout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { getStaticPathsFromPosts } = await import('@/lib/mdx.server');
  const paths = getStaticPathsFromPosts();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { getPostBySlug } = await import('@/lib/mdx.server');

  const slugArray: string[] = Array.isArray(params?.slug)
    ? params.slug
    : [params?.slug as string];

  try {
    const post = await getPostBySlug(slugArray);
    const posts = getAllPosts(); 

    return {
      props: { post, posts },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};