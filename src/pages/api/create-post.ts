import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { title, content, category, tags, pinned } = req.body;

        if (!title || !category) {
            return res.status(400).json({ message: 'Title and category are required' });
        }

        const date = new Date();
        const dateStr = format(date, 'yyyy-MM-dd');

        // Create a safe slug from title
        // Remove special characters, replace spaces with hyphens
        const safeTitle = title
            .replace(/[^\w\s가-힣-]/g, '') // Keep alphanumeric, spaces, korean, hyphens
            .trim()
            .replace(/\s+/g, '-');

        const fileName = `${dateStr}-${safeTitle}.md`;

        // Construct file path
        // category might be "회화 MASTER/영어"
        const blogDir = path.join(process.cwd(), 'blog');
        const categoryPath = category.split('/').join(path.sep);
        const targetDir = path.join(blogDir, categoryPath);
        const filePath = path.join(targetDir, fileName);

        // Ensure directory exists (it should, but safety first)
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Create frontmatter
        const tagList = Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : []);
        const tagStr = JSON.stringify(tagList);
        const isPinned = pinned === true || pinned === 'true';

        const fileContent = `---
title: "${title}"
date: "${dateStr}"
tags: ${tagStr}
pinned: ${isPinned}
---

${content}
`;

        fs.writeFileSync(filePath, fileContent, 'utf8');

        return res.status(200).json({ message: 'Post created successfully', path: filePath });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
}
