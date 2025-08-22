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
                "[&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mt-8 [&>h1]:mb-4 [&>h1]:first:mt-0",
                "[&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-6 [&>h2]:mb-3 [&>h2]:text-blue-900",
                "[&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-5 [&>h3]:mb-2 [&>h3]:text-blue-800",
                "[&>h4]:text-lg [&>h4]:font-semibold [&>h4]:mt-4 [&>h4]:mb-2 [&>h4]:text-blue-700",
                "[&>p]:text-gray-700 [&>p]:leading-relaxed [&>p]:mb-4",
                "[&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul]:space-y-1",
                "[&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>ol]:space-y-1",
                "[&>li]:text-gray-700",
                "[&>blockquote]:border-l-4 [&>blockquote]:border-blue-200 [&>blockquote]:pl-4 [&>blockquote]:py-2 [&>blockquote]:my-4 [&>blockquote]:bg-blue-50 [&>blockquote]:italic [&>blockquote]:text-blue-900",
                "[&>code]:bg-gray-100 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>code]:text-blue-600",
                "[&>pre]:bg-gray-900 [&>pre]:text-gray-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-4",
                "[&>a]:text-blue-600 [&>a]:hover:text-blue-800 [&>a]:underline [&>a]:underline-offset-2",
                "[&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg [&>img]:my-4 [&>img]:shadow-sm",
                "[&>table]:min-w-full [&>table]:border [&>table]:border-gray-200 [&>table]:rounded-lg [&>table]:my-4",
                "[&>thead]:bg-gray-50",
                "[&>tbody]:bg-white",
                "[&>tr]:border-b [&>tr]:border-gray-200",
                "[&>th]:px-4 [&>th]:py-2 [&>th]:text-left [&>th]:font-semibold [&>th]:text-gray-900",
                "[&>td]:px-4 [&>td]:py-2 [&>td]:text-gray-700",
                "[&>hr]:my-8 [&>hr]:border-gray-200",
                "[&>strong]:font-semibold [&>strong]:text-gray-900",
                "[&>em]:italic [&>em]:text-gray-700",
                className
            )}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    )
}