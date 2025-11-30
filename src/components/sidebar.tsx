"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronRight, Hash, Home } from "lucide-react"

// 카테고리 구조 정의
type CategoryItem = {
    title: string
    href?: string
    items?: CategoryItem[]
}

const categories: CategoryItem[] = [
    {
        title: "에어드랍",
        href: "/blog/에어드랍",
    },
    {
        title: "바이브코딩",
        href: "/blog/바이브코딩",
    },
    {
        title: "AI 최신 소식",
        href: "/blog/AI 최신 소식",
    },
    {
        title: "할인 이벤트",
        href: "/blog/할인 이벤트",
    },
    {
        title: "몰입",
        href: "/blog/몰입",
    },
    {
        title: "회화 MASTER",
        items: [
            {
                title: "영어",
                href: "/blog/회화 MASTER/영어",
                items: [
                    { title: "일일스터디", href: "/blog/회화 MASTER/영어/일일스터디" },
                    { title: "참고자료", href: "/blog/회화 MASTER/영어/참고자료" },
                ]
            },
            {
                title: "일본어",
                href: "/blog/회화 MASTER/일본어",
                items: [
                    { title: "일일스터디", href: "/blog/회화 MASTER/일본어/일일스터디" },
                    { title: "참고자료", href: "/blog/회화 MASTER/일본어/참고자료" },
                ]
            },
        ],
    },
    {
        title: "체험",
        href: "/blog/체험",
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="hidden border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:block lg:w-64 lg:fixed lg:inset-y-0 z-30">
            <div className="flex h-14 items-center border-b px-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                    <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        은하수 보드
                    </span>
                </Link>
            </div>
            <ScrollArea className="h-[calc(100vh-3.5rem)] py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        메뉴
                    </h2>
                    <div className="space-y-1">
                        <Link href="/">
                            <Button variant={pathname === "/" ? "secondary" : "ghost"} className="w-full justify-start">
                                <Home className="mr-2 h-4 w-4" />
                                홈
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        카테고리
                    </h2>
                    <div className="space-y-1">
                        {categories.map((category, index) => (
                            <SidebarItem key={index} item={category} pathname={pathname} />
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

function SidebarItem({ item, pathname, level = 0 }: { item: CategoryItem; pathname: string | null; level?: number }) {
    const [isOpen, setIsOpen] = React.useState(false)
    const isActive = item.href ? pathname === item.href : false

    // Check if any descendant is active
    const hasActiveChild = React.useMemo(() => {
        const checkActive = (items?: CategoryItem[]): boolean => {
            if (!items) return false
            return items.some(sub => (sub.href === pathname) || checkActive(sub.items))
        }
        return checkActive(item.items)
    }, [item.items, pathname])

    // 하위 항목이 활성화되어 있으면 자동으로 펼침
    React.useEffect(() => {
        if (hasActiveChild) {
            setIsOpen(true)
        }
    }, [hasActiveChild])

    if (item.items) {
        return (
            <div className="space-y-1">
                <div className="flex items-center w-full">
                    {item.href ? (
                        <>
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className="flex-1 justify-start hover:bg-muted/50"
                                style={{ paddingLeft: `${level * 12 + 12}px` }}
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {level === 0 && <Hash className="mr-2 h-4 w-4" />}
                                {item.title}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 p-0 hover:bg-muted/50"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsOpen(!isOpen);
                                }}
                            >
                                {isOpen ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="ghost"
                            className="w-full justify-between hover:bg-transparent hover:underline"
                            style={{ paddingLeft: `${level * 12 + 12}px` }}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <span className="flex items-center">
                                {level === 0 && <Hash className="mr-2 h-4 w-4" />}
                                {item.title}
                            </span>
                            {isOpen ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    )}
                </div>
                {isOpen && (
                    <div className="space-y-1">
                        {item.items.map((subItem, index) => (
                            <SidebarItem key={index} item={subItem} pathname={pathname} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <Link href={item.href!}>
            <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start"
                style={{ paddingLeft: `${level * 12 + 12}px` }}
            >
                {level === 0 && <Hash className="mr-2 h-4 w-4" />}
                {item.title}
            </Button>
        </Link>
    )
}
