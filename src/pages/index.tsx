import Head from "next/head";
import Layout from "@/components/layout";
import CalendarSection from "@/components/calendar-section";
import PostCard from "@/components/post-card";
import { getSortedPostsData } from "@/lib/posts";
import { PostMeta } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HomeProps {
  allPostsData: PostMeta[];
}

export default function Home({ allPostsData }: HomeProps) {
  // 최신 글 5개만 표시
  const recentPosts = allPostsData.slice(0, 5);

  return (
    <Layout>
      <Head>
        <title>은하수 보드</title>
        <meta name="description" content="Next.js Markdown Blog with Calendar" />
      </Head>

      <div className="space-y-10">
        {/* 1. 캘린더 섹션 */}
        <section>
          <CalendarSection />
        </section>

        {/* 2. 최신 글 섹션 */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">최신 글</h2>
            <Link href="/tags">
              <Button variant="ghost" className="gap-2">
                전체 보기 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                아직 작성된 글이 없습니다.
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
