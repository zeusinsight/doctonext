"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link2,
    ImageIcon,
    Heading1,
    Heading2,
    Heading3
} from "lucide-react"

interface ArticleEditorProps {
    content: string
    onChange: (content: string) => void
    className?: string
    placeholder?: string
}

export function ArticleEditor({ 
    content, 
    onChange, 
    className,
    placeholder = "Commencez à écrire votre article..." 
}: ArticleEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3]
                }
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "max-w-full h-auto rounded-lg my-4"
                }
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-600 hover:text-blue-800 underline"
                }
            })
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: "prose prose-lg max-w-none focus:outline-none min-h-[300px] p-4"
            }
        }
    })

    if (!editor) {
        return null
    }

    const addImage = () => {
        const url = window.prompt("URL de l'image:")
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const addLink = () => {
        const previousUrl = editor.getAttributes("link").href
        const url = window.prompt("URL du lien:", previousUrl)

        if (url === null) {
            return
        }

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }

    return (
        <div className={cn("border rounded-lg overflow-hidden", className)}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
                {/* Undo/Redo */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                {/* Headings */}
                <Button
                    variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                {/* Text Formatting */}
                <Button
                    variant={editor.isActive("bold") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant={editor.isActive("italic") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant={editor.isActive("strike") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                {/* Lists */}
                <Button
                    variant={editor.isActive("bulletList") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant={editor.isActive("orderedList") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                {/* Block Elements */}
                <Button
                    variant={editor.isActive("blockquote") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                {/* Links and Images */}
                <Button
                    variant={editor.isActive("link") ? "default" : "ghost"}
                    size="sm"
                    onClick={addLink}
                >
                    <Link2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addImage}
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor */}
            <div className="bg-background">
                <EditorContent 
                    editor={editor} 
                    className="prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg"
                />
                {editor.isEmpty && (
                    <div className="absolute top-20 left-8 text-muted-foreground pointer-events-none">
                        {placeholder}
                    </div>
                )}
            </div>
        </div>
    )
}