"use client"

import React, { useState, useEffect } from "react"
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
import { Edit } from "lucide-react"
import { useRouter } from "next/router"
import { Post } from "@/lib/types"
import { RichTextEditor } from "@/components/rich-text-editor"
import TurndownService from 'turndown'
import { marked } from 'marked'

interface EditPostDialogProps {
    post: Post
}

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
})

export function EditPostDialog({ post }: EditPostDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState(post.title)
    const [content, setContent] = useState("")
    const [tags, setTags] = useState(post.tags.join(", "))
    const [pinned, setPinned] = useState(post.pinned || false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    // Reset state when post changes or dialog opens
    useEffect(() => {
        if (isOpen) {
            setTitle(post.title)
            setTags(post.tags.join(", "))
            setPinned(post.pinned || false)
            // Convert markdown to HTML for the editor
            const htmlContent = marked(post.content) as string
            setContent(htmlContent)
        }
    }, [isOpen, post])

    const handleSubmit = async () => {
        if (!title) return

        setIsSubmitting(true)
        try {
            // Convert HTML to Markdown
            const markdown = turndownService.turndown(content)

            const res = await fetch("/api/update-post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    category: post.category,
                    slug: post.slug,
                    title,
                    content: markdown,
                    tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
                    pinned,
                }),
            })

            if (res.ok) {
                setIsOpen(false)
                // Refresh the page to show the updated post
                router.replace(router.asPath)
            } else {
                alert("Failed to update post")
            }
        } catch (error) {
            console.error(error)
            alert("Error updating post")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    수정
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>글 수정</DialogTitle>
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
