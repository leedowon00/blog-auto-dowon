import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { category, slug, content, title, tags, pinned } = req.body;

        if (!category || !slug || !content) {
            return res.status(400).json({ message: 'Category, slug, and content are required' });
        }

        // URL 디코딩 (한글 경로 처리)
        const decodedCategory = decodeURIComponent(category);
        const decodedSlug = decodeURIComponent(slug);

        // Construct file path
        const blogDir = path.join(process.cwd(), 'blog');
        const categoryPath = decodedCategory.split('/').join(path.sep);
        const filePath = path.join(blogDir, categoryPath, `${decodedSlug}.md`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Read existing file to preserve date and other metadata if needed
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data: existingData } = matter(fileContents);

        // Update frontmatter - title은 필수값이므로 항상 설정
        const newData = {
            ...existingData,
            title: title || existingData.title || 'Untitled',
            tags: tags !== undefined ? tags : existingData.tags,
            pinned: pinned !== undefined ? (pinned === true || pinned === 'true') : (existingData.pinned || false),
        };

        const newFileContent = matter.stringify(content, newData);

        fs.writeFileSync(filePath, newFileContent, 'utf8');

        return res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
}
