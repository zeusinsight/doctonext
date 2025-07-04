import { PageHeader } from "@/components/layout/page-header"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Integrations"
}

export default function IntegrationsPage() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Integrations page"
                description="Track and monitor your key performance metrics."
            />
        </div>
    )
}
