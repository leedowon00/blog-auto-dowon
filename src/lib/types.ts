export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary?: string;
  content: string;
  readingTime?: string;
  pinned?: boolean;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary?: string;
  pinned?: boolean;
}
