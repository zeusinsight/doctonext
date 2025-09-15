import { cn } from "@/lib/utils"

interface ArticleContentProps {
    content: string
    className?: string
}

export function ArticleContent({ content, className }: ArticleContentProps) {
    return (
        <div
            className={cn(
                "prose prose-lg max-w-none",
                // Custom prose styles for HTML content
                "[&>h1]:mt-8 [&>h1]:mb-4 [&>h1]:font-bold [&>h1]:text-3xl [&>h1]:first:mt-0",
                "[&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:font-semibold [&>h2]:text-2xl [&>h2]:text-blue-900",
                "[&>h3]:mt-5 [&>h3]:mb-2 [&>h3]:font-semibold [&>h3]:text-blue-800 [&>h3]:text-xl",
                "[&>h4]:mt-4 [&>h4]:mb-2 [&>h4]:font-semibold [&>h4]:text-blue-700 [&>h4]:text-lg",
                "[&>p]:mb-4 [&>p]:text-gray-700 [&>p]:leading-relaxed",
                "[&>ul]:mb-4 [&>ul]:list-disc [&>ul]:space-y-1 [&>ul]:pl-6",
                "[&>ol]:mb-4 [&>ol]:list-decimal [&>ol]:space-y-1 [&>ol]:pl-6",
                "[&>li]:text-gray-700",
                "[&>blockquote]:my-4 [&>blockquote]:border-blue-200 [&>blockquote]:border-l-4 [&>blockquote]:bg-blue-50 [&>blockquote]:py-2 [&>blockquote]:pl-4 [&>blockquote]:text-blue-900 [&>blockquote]:italic",
                "[&>code]:rounded [&>code]:bg-gray-100 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:font-mono [&>code]:text-blue-600 [&>code]:text-sm",
                "[&>pre]:mb-4 [&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:bg-gray-900 [&>pre]:p-4 [&>pre]:text-gray-100",
                "[&>a]:text-blue-600 [&>a]:underline [&>a]:underline-offset-2 [&>a]:hover:text-blue-800",
                "[&>img]:my-4 [&>img]:h-auto [&>img]:max-w-full [&>img]:rounded-lg [&>img]:shadow-sm",
                "[&>table]:my-4 [&>table]:min-w-full [&>table]:rounded-lg [&>table]:border [&>table]:border-gray-200",
                "[&>thead]:bg-gray-50",
                "[&>tbody]:bg-white",
                "[&>tr]:border-gray-200 [&>tr]:border-b",
                "[&>th]:px-4 [&>th]:py-2 [&>th]:text-left [&>th]:font-semibold [&>th]:text-gray-900",
                "[&>td]:px-4 [&>td]:py-2 [&>td]:text-gray-700",
                "[&>hr]:my-8 [&>hr]:border-gray-200",
                "[&>strong]:font-semibold [&>strong]:text-gray-900",
                "[&>em]:text-gray-700 [&>em]:italic",
                className
            )}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    )
}
