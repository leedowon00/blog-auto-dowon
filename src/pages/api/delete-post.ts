import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { category, slug } = req.body;

        if (!category || !slug) {
            return res.status(400).json({ message: 'Category and slug are required' });
        }

        // Construct file path
        const blogDir = path.join(process.cwd(), 'blog');
        const categoryPath = category.split('/').join(path.sep);
        const filePath = path.join(blogDir, categoryPath, `${slug}.md`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Post not found' });
        }

        fs.unlinkSync(filePath);

        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        return res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
}
