"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PenTool } from "lucide-react"
import { useRouter } from "next/router"
import { RichTextEditor } from "@/components/rich-text-editor"
import TurndownService from 'turndown'

interface CreatePostDialogProps {
    category: string
}

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
})

export function CreatePostDialog({ category }: CreatePostDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [tags, setTags] = useState("")
    const [pinned, setPinned] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        if (!title) return

        setIsSubmitting(true)
        try {
            // Convert HTML to Markdown
            const markdown = turndownService.turndown(content)

            const res = await fetch("/api/create-post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    content: markdown,
                    tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
                    category,
                    pinned,
                }),
            })

            if (res.ok) {
                setIsOpen(false)
                setTitle("")
                setContent("")
                setTags("")
                setPinned(false)
                // Refresh the page to show the new post
                router.replace(router.asPath)
            } else {
                alert("Failed to create post")
            }
        } catch (error) {
            console.error(error)
            alert("Error creating post")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <PenTool className="h-4 w-4" />
                    글쓰기
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>새 글 작성 ({category})</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 flex-1 overflow-y-auto">
                    <div className="grid gap-2">
                        <Label htmlFor="title">제목</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
                        <Input
                            id="tags"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="예: 영어, 회화, 공부"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="pinned"
                            checked={pinned}
                            onCheckedChange={(checked) => setPinned(checked as boolean)}
                        />
                        <Label htmlFor="pinned" className="cursor-pointer">이 글을 상단에 고정</Label>
                    </div>
                    <div className="grid gap-2 flex-1">
                        <Label>내용</Label>
                        <RichTextEditor content={content} onChange={setContent} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        취소
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "저장 중..." : "저장"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
