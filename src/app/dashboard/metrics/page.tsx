import { PageHeader } from "@/components/page-header"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Metrics"
}

export default function MetricsPage() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Metrics page"
                description="Track and monitor your key performance metrics."
            />
        </div>
    )
}
