import { ChatInterface } from "@/components/messages/chat-interface"

export default function MessagesPage() {
    return (
        <div className="min-h-screen w-full space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Messages</h1>
                <p className="text-white">
                    Communiquez avec les autres professionnels de santé
                </p>
            </div>

            <div className="w-full max-w-7xl">
                <ChatInterface />
            </div>
        </div>
    )
}