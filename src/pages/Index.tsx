import { useState, useCallback } from "react";
import IconSidebar from "@/components/IconSidebar";
import InnerSidebar from "@/components/InnerSidebar";
import ChatArea from "@/components/ChatArea";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background tech-grid-bg">
      <IconSidebar />
      <InnerSidebar onNewChat={handleNewChat} />
      <main className="flex-1 flex flex-col min-w-0">
        <ChatArea messages={messages} setMessages={setMessages} />
      </main>
    </div>
  );
};

export default Index;
