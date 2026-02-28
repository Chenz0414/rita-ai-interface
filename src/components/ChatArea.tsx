import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Paperclip, Globe, Sparkles, Search, Pen, Languages, Wrench, HelpCircle, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickActions = [
  { label: "Deep Research", icon: Search },
  { label: "Image Generation", icon: Image },
  { label: "Quick Question", icon: HelpCircle },
  { label: "Writing", icon: Pen },
  { label: "Translation", icon: Languages },
  { label: "More Tools", icon: Wrench },
];

const mockResponses: Record<string, string> = {
  default: `当然！我很乐意帮助你。以下是一些建议：

1. **保持清晰的代码结构** — 模块化设计能让项目更易维护
2. **使用类型安全** — TypeScript 可以帮助你在编译时发现错误
3. **关注性能优化** — 使用 \`React.memo\` 和 \`useMemo\` 来避免不必要的渲染

\`\`\`typescript
// 示例代码
const optimizedComponent = React.memo(({ data }) => {
  return <div>{data.title}</div>;
});
\`\`\`

如果你有任何具体的问题，请随时告诉我！`,
};

async function mockFetchAI(userMessage: string): Promise<string> {
  // Simulating API call payload
  const _payload = {
    model: "glm-4.7",
    messages: [{ role: "user", content: userMessage }],
  };
  console.log("API Payload (model: glm-4.7):", _payload);

  await new Promise((r) => setTimeout(r, 400));
  return mockResponses.default;
}

interface ChatAreaProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatArea = ({ messages, setMessages }: ChatAreaProps) => {
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setIsStreaming(true);

    const fullResponse = await mockFetchAI(trimmed);

    // Streaming simulation
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    for (let i = 0; i <= fullResponse.length; i++) {
      await new Promise((r) => setTimeout(r, 12));
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: fullResponse.slice(0, i),
        };
        return updated;
      });
    }
    setIsStreaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  const InputBox = (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className="rounded-2xl border border-border bg-background shadow-sm transition-shadow focus-within:shadow-md"
        style={{ boxShadow: "0 2px 12px hsl(var(--chat-input-shadow) / 0.5)" }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="欢迎随时提问或输入 '/' 选择一项技能"
          rows={1}
          className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          style={{ minHeight: 44, maxHeight: 160 }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = Math.min(el.scrollHeight, 160) + "px";
          }}
        />
        <div className="flex items-center justify-between px-3 pb-2.5">
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Paperclip size={16} />
            </button>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/8 text-primary text-xs font-medium">
              <Sparkles size={12} />
              Rita
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setWebSearch(!webSearch)}
              className={`p-1.5 rounded-lg transition-colors ${
                webSearch
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Globe size={16} />
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity"
            >
              <Send size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isEmpty) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-semibold text-foreground mb-2 tracking-tight">
            今天我能为您做些什么？
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full max-w-3xl"
        >
          {InputBox}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mt-5 max-w-3xl"
        >
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-accent transition-colors"
            >
              <action.icon size={14} />
              {action.label}
            </button>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start gap-3"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles size={14} className="text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-chat-user-bg rounded-2xl rounded-br-md px-4 py-3 text-sm text-foreground"
                      : "text-sm text-foreground leading-relaxed"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-pre:bg-muted prose-pre:rounded-xl prose-pre:border prose-pre:border-border prose-code:text-primary prose-code:font-medium prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isStreaming && (
            <div className="flex items-center gap-1.5 ml-10 text-muted-foreground">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary/40"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Fixed bottom input */}
      <div className="border-t border-border bg-background px-6 py-4">
        {InputBox}
      </div>
    </div>
  );
};

export default ChatArea;
