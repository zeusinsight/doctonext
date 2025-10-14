import { cn } from "@/lib/utils";

interface SectionTitleProps {
    title: string;
    subtitle: string;
    className?: string;
}

export const SectionTitle = ({ title, subtitle, className }: SectionTitleProps) => {
    return (
        <div className={cn("mx-auto mb-8 text-center", className)}>
            <h2 className="mb-2 text-lg text-primary tracking-wider">
                {subtitle}
            </h2>
            <h3 className="font-bold text-3xl md:text-4xl">
                {title}
            </h3>
        </div>
    );
};
