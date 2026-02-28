import { Plus, Sparkles, Settings, Zap } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const models = [
  { name: "Rita", selected: true, icon: Sparkles },
  { name: "GPT-4o", selected: false },
  { name: "Claude 3.5", selected: false },
  { name: "Gemini Pro", selected: false },
  { name: "Llama 3", selected: false },
];

const chatHistory = [
  "如何优化React性能",
  "Python数据分析教程",
  "企业级API设计最佳实践",
  "机器学习入门指南",
];

const tabs = ["All", "Free Models", "Pro Models"];

interface InnerSidebarProps {
  onNewChat: () => void;
}

const InnerSidebar = ({ onNewChat }: InnerSidebarProps) => {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="w-64 flex-shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col">
      {/* New Chat Button */}
      <div className="p-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-colors hover:bg-primary/90"
        >
          <Plus size={16} />
          New Chat
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="px-3 pb-2">
        <div className="flex bg-accent rounded-lg p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${
                activeTab === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Models */}
      <div className="px-3 pb-3">
        <p className="text-xs font-medium text-muted-foreground mb-2 px-1">Models</p>
        <div className="space-y-0.5">
          {models.map((model) => (
            <button
              key={model.name}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                model.selected
                  ? "bg-primary/8 text-primary font-medium"
                  : "text-sidebar-foreground hover:bg-accent"
              }`}
            >
              {model.icon && <model.icon size={14} className="text-primary" />}
              {!model.icon && <div className="w-3.5" />}
              {model.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3">
        <p className="text-xs font-medium text-muted-foreground mb-2 px-1">7 Days Ago</p>
        <div className="space-y-0.5">
          {chatHistory.map((title, i) => (
            <button
              key={i}
              className="w-full text-left px-2.5 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-accent transition-colors truncate"
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/60 to-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
            B
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">bonjour0414</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap size={10} className="text-primary" />
              <span>1006</span>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InnerSidebar;
