import React from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface LayoutProps {
    children: React.ReactNode;
}

/**
 * 메인 레이아웃 컴포넌트
 * - 좌측 사이드바 (PC)
 * - 상단 헤더 (모바일)
 * - 메인 콘텐츠 영역
 */
export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            {/* PC용 사이드바 */}
            <Sidebar />

            {/* 모바일용 헤더 */}
            <header className="lg:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center px-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-2">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">메뉴 열기</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64">
                            <Sidebar />
                        </SheetContent>
                    </Sheet>
                    <Link href="/" className="font-bold">
                        은하수 보드
                    </Link>
                </div>
            </header>

            {/* 메인 콘텐츠 (사이드바 너비만큼 왼쪽 여백) */}
            <main className="lg:pl-64 min-h-screen flex flex-col">
                <div className="flex-1 container max-w-6xl py-6 lg:py-10 px-4 md:px-8">
                    {children}
                </div>
                <footer className="py-6 md:px-8 md:py-0">
                    <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                            © 2025 Antigravity. Built with Next.js
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
