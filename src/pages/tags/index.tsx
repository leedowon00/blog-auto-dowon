import Head from 'next/head';
import { GetStaticProps } from 'next';
import Layout from '@/components/layout';
import { getAllTags } from '@/lib/posts';
import Link from 'next/link';
import { getTagColor, getTagIcon, DEFAULT_TAGS } from '@/lib/constants';

interface TagsIndexProps {
    tags: { tag: string; count: number }[];
}

/**
 * 모든 태그 목록 페이지
 * - 태그별 색상 코딩 적용
 * - 아이콘 표시
 * - 세련된 그리드 레이아웃
 */
type DefaultTag = (typeof DEFAULT_TAGS)[number];

const isDefaultTag = (value: string): value is DefaultTag =>
    DEFAULT_TAGS.includes(value as DefaultTag);

const getTagPriority = (tag: string) => {
    if (isDefaultTag(tag)) {
        return DEFAULT_TAGS.indexOf(tag);
    }
    return Number.MAX_SAFE_INTEGER;
};

export default function TagsIndex({ tags }: TagsIndexProps) {
    // 기본 태그를 우선 표시하고, 나머지는 정렬
    const sortedTags = [...tags].sort((a, b) => {
        const priorityDiff = getTagPriority(a.tag) - getTagPriority(b.tag);
        if (priorityDiff !== 0) {
            return priorityDiff;
        }
        return a.tag.localeCompare(b.tag);
    });

    return (
        <Layout>
            <Head>
                <title>태그 목록 - 안티그래비티 블로그</title>
                <meta name="description" content="블로그 태그 목록" />
            </Head>

            <section className="mb-10">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-4 gradient-text">
                        모든 태그
                    </h1>
                    <p className="text-muted-foreground">
                        태그를 클릭하여 해당 태그의 글을 확인하세요.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedTags.map(({ tag, count }) => {
                        const iconSymbol = getTagIcon(tag);
                        const colors = getTagColor(tag);
                        
                        return (
                            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
                                <div className={`
                                    ${colors.bg} ${colors.border}
                                    border rounded-xl p-6
                                    hover:scale-105 transition-all duration-300
                                    cursor-pointer group
                                    shadow-sm hover:shadow-md
                                `}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span aria-hidden className={`text-2xl ${colors.text}`}>
                                            {iconSymbol}
                                        </span>
                                        <h2 className={`text-xl font-bold ${colors.text}`}>
                                            {tag}
                                        </h2>
                                    </div>
                                    <p className={`text-sm ${colors.text} opacity-70`}>
                                        {count}개의 글
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {tags.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>아직 태그가 없습니다.</p>
                    </div>
                )}
            </section>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const tags = getAllTags();

    // 태그 이름순 정렬
    tags.sort((a, b) => a.tag.localeCompare(b.tag));

    return {
        props: {
            tags,
        },
    };
};
