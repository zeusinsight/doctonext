import { ChatInterface } from "@/components/messages/chat-interface";
import { ContractSuccessHandler } from "@/components/contracts/contract-success-handler";

export default function MessagesPage() {
  return (
    <div className="min-h-screen w-full space-y-6">
      <div className="w-full">
        <ChatInterface />
        <ContractSuccessHandler />
      </div>
    </div>
  );
}
