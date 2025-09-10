import { ChatInterface } from "@/components/messages/chat-interface"
import { ContractSuccessHandler } from "@/components/contracts/contract-success-handler"

interface ConversationPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ConversationPage({ params }: ConversationPageProps) {
    const { id } = await params

    return (
        <div className="min-h-screen w-full space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Messages</h1>
                <p className="text-white">
                    Communiquez avec les autres professionnels de santé
                </p>
            </div>

            <div className="w-full max-w-7xl">
                <ChatInterface initialConversationId={id} />
                <ContractSuccessHandler />
            </div>
        </div>
    )
}