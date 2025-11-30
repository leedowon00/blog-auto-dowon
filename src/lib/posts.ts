import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post, PostMeta } from './types';

// 블로그 포스트가 저장된 최상위 디렉토리
const postsDirectory = path.join(process.cwd(), 'blog');

/**
 * 디렉토리를 재귀적으로 탐색하여 모든 .md 파일을 찾습니다.
 */
function getAllMdFiles(dirPath: string, fileList: string[] = []): string[] {
    if (!fs.existsSync(dirPath)) return [];

    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            getAllMdFiles(filePath, fileList);
        } else {
            if (file.endsWith('.md')) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

/**
 * 모든 블로그 포스트의 메타데이터를 가져와서 날짜순으로 정렬하여 반환합니다.
 */
export function getSortedPostsData(): PostMeta[] {
    const allFiles = getAllMdFiles(postsDirectory);

    const allPostsData = allFiles.map(fullPath => {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        // 경로에서 카테고리와 슬러그 추출
        // 예: .../blog/회화 MASTER/영어/2025-11-28-test.md
        // relativePath: 회화 MASTER/영어/2025-11-28-test.md
        // Windows에서도 forward slash로 변환하여 처리
        const relativePath = path.relative(postsDirectory, fullPath).split(path.sep).join('/');
        const pathParts = relativePath.split('/');

        // 파일명 (마지막 요소)
        const fileName = pathParts[pathParts.length - 1];
        const slug = fileName.replace(/\.md$/, '');

        // 카테고리 (파일명 제외한 앞부분)
        const category = pathParts.slice(0, -1).join('/');

        // 날짜 처리
        let date = matterResult.data.date ? new Date(matterResult.data.date).toISOString().split('T')[0] : '';
        const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})-/);
        if (!date && dateMatch) {
            date = dateMatch[1];
        }

        // 제목 처리
        let title = matterResult.data.title;
        if (!title) {
            title = fileName.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '').replace(/-/g, ' ');
        }

        // pinned 값 안전하게 처리
        const pinned = matterResult.data.pinned === true || matterResult.data.pinned === 'true';

        return {
            slug,
            title,
            date,
            category,
            tags: matterResult.data.tags || [],
            summary: matterResult.data.summary || '',
            pinned,
        };
    });

    // 날짜순 정렬 (pinned 우선)
    return allPostsData.sort((a, b) => {
        const pinnedA = a.pinned === true;
        const pinnedB = b.pinned === true;

        if (pinnedA && !pinnedB) return -1;
        if (!pinnedA && pinnedB) return 1;
        if (a.date < b.date) return 1;
        else return -1;
    });
}

/**
 * 모든 포스트의 경로(Category, Slug) 목록을 반환합니다.
 * Next.js의 getStaticPaths에서 사용됩니다.
 */
export function getAllPostIds() {
    const allFiles = getAllMdFiles(postsDirectory);

    return allFiles.map(fullPath => {
        const relativePath = path.relative(postsDirectory, fullPath).split(path.sep).join('/');
        const pathParts = relativePath.split('/');
        const fileName = pathParts[pathParts.length - 1];
        const slug = fileName.replace(/\.md$/, '');
        const category = pathParts.slice(0, -1).join('/');

        return {
            params: {
                category,
                slug,
            },
        };
    });
}

/**
 * 특정 포스트의 상세 데이터를 가져옵니다.
 * category가 중첩될 수 있으므로, category path를 받아서 처리합니다.
 */
export async function getPostData(category: string, slug: string): Promise<Post> {
    // URL 디코딩 (한글 경로 처리)
    const decodedCategory = decodeURIComponent(category);
    const decodedSlug = decodeURIComponent(slug);

    // OS에 맞는 경로 구분자로 변환
    const categoryPath = decodedCategory.split('/').join(path.sep);
    const fullPath = path.join(postsDirectory, categoryPath, `${decodedSlug}.md`);

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    let date = matterResult.data.date ? new Date(matterResult.data.date).toISOString().split('T')[0] : '';
    const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})-/);
    if (!date && dateMatch) {
        date = dateMatch[1];
    }

    let title = matterResult.data.title;
    if (!title) {
        title = slug.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-/g, ' ');
    }

    return {
        slug,
        title,
        date,
        category,
        tags: matterResult.data.tags || [],
        summary: matterResult.data.summary || '',
        pinned: matterResult.data.pinned || false,
        content: matterResult.content,
    };
}

export function getAllTags() {
    const allPosts = getSortedPostsData();
    const tags: Record<string, number> = {};

    allPosts.forEach(post => {
        post.tags.forEach(tag => {
            if (tags[tag]) {
                tags[tag]++;
            } else {
                tags[tag] = 1;
            }
        });
    });

    return Object.entries(tags).map(([tag, count]) => ({ tag, count }));
}

export function getPostsByTag(tag: string) {
    const allPosts = getSortedPostsData();
    return allPosts.filter(post => post.tags.includes(tag));
}
