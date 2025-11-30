import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PostMeta } from '@/lib/types';
import { getTagColor, getTagIcon } from '@/lib/constants';
import { Calendar, Folder } from 'lucide-react';

interface PostCardProps {
    post: PostMeta;
}

/**
 * 포스트 목록에서 각 포스트를 보여주는 카드 컴포넌트
 * - 태그별 색상 코딩 적용
 * - 호버 효과 개선
 * - 세련된 디자인
 */
export default function PostCard({ post }: PostCardProps) {
    // 카테고리와 슬러그를 합쳐서 올바른 경로 생성
    const postPath = `/blog/${post.category}/${post.slug}`;

    return (
        <Link href={postPath} className="block group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 border-border/60 hover:border-primary/30">
                <CardHeader className="pb-3">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                    {post.summary && (
                        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                            {post.summary}
                        </p>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pt-3 border-t border-border/50">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground w-full">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Folder className="h-3 w-3" />
                            <span>{post.category}</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap w-full">
                        {post.tags.length > 0 ? (
                            post.tags.map((tag) => {
                                const colors = getTagColor(tag);
                                const iconSymbol = getTagIcon(tag);

                                return (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className={`
                                            ${colors.bg} ${colors.text} ${colors.border}
                                            border text-xs font-medium
                                            flex items-center gap-1
                                        `}
                                    >
                                        <span aria-hidden className="text-base leading-none">
                                            {iconSymbol}
                                        </span>
                                        <span>{tag}</span>
                                    </Badge>
                                );
                            })
                        ) : (
                            <span className="text-xs text-muted-foreground">태그 없음</span>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
