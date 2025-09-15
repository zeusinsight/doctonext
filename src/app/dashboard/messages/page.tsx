import { ChatInterface } from "@/components/messages/chat-interface"
import { ContractSuccessHandler } from "@/components/contracts/contract-success-handler"

export default function MessagesPage() {
    return (
        <div className="min-h-screen w-full space-y-6">
            <div className="w-full max-w-7xl">
                <ChatInterface />
                <ContractSuccessHandler />
            </div>
        </div>
    )
}
