import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import Layout from '@/components/layout';
import PostCard from '@/components/post-card';
import { getSortedPostsData, getPostData } from '@/lib/posts';
import { Post, PostMeta } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, Folder } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CreatePostDialog } from '@/components/create-post-dialog';
import { EditPostDialog } from '@/components/edit-post-dialog';
import { useRouter } from 'next/router';
import { Trash2 } from 'lucide-react';

interface Props {
    type: 'post' | 'category';
    postData?: Post;
    categoryPosts?: PostMeta[];
    categoryName?: string;
}

export default function BlogPage({ type, postData, categoryPosts, categoryName }: Props) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!postData || !confirm('정말로 이 글을 삭제하시겠습니까?')) return;

        try {
            const res = await fetch('/api/delete-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: postData.category,
                    slug: postData.slug,
                }),
            });

            if (res.ok) {
                // Redirect to category page
                router.push(`/blog/${postData.category}`);
            } else {
                alert('삭제 실패');
            }
        } catch (error) {
            console.error(error);
            alert('오류 발생');
        }
    };

    if (type === 'post' && postData) {
        return (
            <Layout>
                <Head>
                    <title>{postData.title} | Antigravity</title>
                </Head>
                <article className="max-w-3xl mx-auto">
                    <div className="mb-8 space-y-4">
                        <Link href={`/blog/${postData.category}`}>
                            <Button variant="ghost" size="sm" className="pl-0 text-muted-foreground hover:text-foreground">
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                {postData.category}
                            </Button>
                        </Link>

                        <div className="flex items-center justify-between">
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                                {postData.title}
                            </h1>
                            <div className="flex items-center gap-2">
                                <EditPostDialog post={postData} />
                                <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-2">
                                    <Trash2 className="h-4 w-4" />
                                    삭제
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-zinc dark:prose-invert max-w-none mb-8">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {postData.content}
                        </ReactMarkdown>
                    </div>

                    <div className="border-t pt-6 mt-8 space-y-4">
                        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <time dateTime={postData.date}>
                                    {postData.date ? format(new Date(postData.date), 'yyyy년 M월 d일', { locale: ko }) : ''}
                                </time>
                            </div>
                            <div className="flex items-center gap-1">
                                <Folder className="h-4 w-4" />
                                <span>{postData.category}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {postData.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </article>
            </Layout>
        );
    }

    if (type === 'category' && categoryPosts) {
        return (
            <Layout>
                <Head>
                    <title>{categoryName} | Antigravity</title>
                </Head>
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">{categoryName}</h1>
                            <p className="text-muted-foreground">
                                총 {categoryPosts.length}개의 글이 있습니다.
                            </p>
                        </div>
                        <CreatePostDialog category={categoryName || ''} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {categoryPosts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }

    return <div>404 Not Found</div>;
}

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = getSortedPostsData();

    // 1. Post Paths
    const postPaths = posts.map(post => ({
        params: { slug: [...post.category.split('/'), post.slug] }
    }));

    // 2. Category Paths
    const categoryPaths = new Set<string>();
    posts.forEach(post => {
        const parts = post.category.split('/');
        // Generate all intermediate paths
        // e.g. "A/B" -> "A", "A/B"
        let current = '';
        parts.forEach(part => {
            current = current ? `${current}/${part}` : part;
            categoryPaths.add(current);
        });
    });

    // Add empty categories (created folders but no posts yet)
    const blogDir = path.join(process.cwd(), 'blog');

    function scanDirs(dir: string, base: string[] = []) {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir);

        // 현재 디렉토리도 카테고리 경로에 추가 (base가 비어있지 않다면)
        if (base.length > 0) {
            categoryPaths.add(base.join('/'));
        }

        files.forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                const newBase = [...base, file];
                // 재귀 호출
                scanDirs(fullPath, newBase);
            }
        });
    }
    scanDirs(blogDir);

    const catPaths = Array.from(categoryPaths).map(cat => ({
        params: { slug: cat.split('/') }
    }));

    return {
        paths: [...postPaths, ...catPaths],
        fallback: false
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    if (!params?.slug || !Array.isArray(params.slug)) {
        return { notFound: true };
    }

    // URL 디코딩 (한글 경로 문제 해결)
    const decodedSlug = params.slug.map(part => decodeURIComponent(part));
    const slugPath = decodedSlug.join('/');
    const blogDir = path.join(process.cwd(), 'blog');

    // Check if it is a file (Post)
    // Construct path: blog/slugPath.md
    // Note: slugPath includes category/slug.
    // e.g. "회화 MASTER/영어/post1" -> blog/회화 MASTER/영어/post1.md
    // OS에 맞는 구분자로 변환하여 파일 시스템 접근
    const fsSlugPath = decodedSlug.join(path.sep);
    const filePath = path.join(blogDir, fsSlugPath + '.md');

    if (fs.existsSync(filePath)) {
        // It's a post
        const slug = decodedSlug[decodedSlug.length - 1];
        const category = decodedSlug.slice(0, -1).join('/');
        const postData = await getPostData(category, slug);
        return {
            props: {
                type: 'post',
                postData
            }
        };
    }

    // Check if it is a directory (Category)
    const dirPath = path.join(blogDir, fsSlugPath);
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        // It's a category
        // Get all posts that belong to this category (or subcategories)
        const allPosts = getSortedPostsData();
        // Filter: post.category starts with slugPath
        // post.category는 항상 '/' 구분자를 사용함 (posts.ts 수정 덕분)
        const categoryPosts = allPosts.filter(p =>
            p.category === slugPath || p.category.startsWith(slugPath + '/')
        );

        return {
            props: {
                type: 'category',
                categoryPosts,
                categoryName: slugPath
            }
        };
    }

    return { notFound: true };
};
