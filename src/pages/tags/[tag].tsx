import * as React from 'react';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '@/components/layout';
import PostCard from '@/components/post-card';
import { getAllTags, getPostsByTag } from '@/lib/posts';
import { PostMeta } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getTagColor, getTagIcon } from '@/lib/constants';
import { ArrowLeft } from 'lucide-react';

interface TagPageProps {
    tag: string;
    tagPosts: PostMeta[];
}

/**
 * 태그별 글 목록 페이지
 * - 태그 색상 코딩 적용
 * - 그리드 레이아웃으로 글 표시
 */
export default function TagPage({ tag, tagPosts }: TagPageProps) {
    const colors = getTagColor(tag);
    const iconSymbol = React.useMemo(() => getTagIcon(tag), [tag]);

    return (
        <Layout>
            <Head>
                <title>#{tag} - 안티그래비티 블로그</title>
                <meta name="description" content={`${tag} 태그의 글 목록`} />
            </Head>

            <section className="mb-10">
                <div className="mb-6">
                    <Link href="/tags">
                        <Button variant="ghost" size="sm" className="mb-4 gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            모든 태그 보기
                        </Button>
                    </Link>
                    
                    <div className={`
                        ${colors.bg} ${colors.border}
                        border rounded-xl p-6 inline-flex items-center gap-3
                    `}>
                        <span aria-hidden className={`text-3xl ${colors.text}`}>
                            {iconSymbol}
                        </span>
                        <div>
                            <h1 className={`text-3xl font-bold ${colors.text} mb-1`}>
                                #{tag}
                            </h1>
                            <p className={`text-sm ${colors.text} opacity-70`}>
                                {tagPosts.length}개의 글
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                {tagPosts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>이 태그에 해당하는 글이 없습니다.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tagPosts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>
                )}
            </section>
        </Layout>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const tags = getAllTags(); // Returns {tag, count}[]

    const paths = tags.map(({ tag }) => ({
        params: { tag: encodeURIComponent(tag) },
    }));

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const tag = params?.tag as string;
    const decodedTag = decodeURIComponent(tag);
    const tagPosts = getPostsByTag(decodedTag);

    return {
        props: {
            tag: decodedTag,
            tagPosts,
        },
    };
};
