import { MessageSquare, Image, Video, AudioLines } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { icon: MessageSquare, label: "AI Chat", active: true },
  { icon: Image, label: "AI Image", active: false },
  { icon: Video, label: "AI Video", active: false },
  { icon: AudioLines, label: "AI Audio", active: false },
];

const IconSidebar = () => {
  return (
    <div className="w-16 flex-shrink-0 flex flex-col items-center border-r border-sidebar-border bg-sidebar py-5 gap-2">
      {/* Logo */}
      <div className="mb-6">
        <motion.div
          className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center glow-primary-sm"
          whileHover={{ scale: 1.1 }}
          animate={{ boxShadow: [
            "0 0 12px -3px hsl(240 73.9% 61% / 0.2)",
            "0 0 18px -3px hsl(240 73.9% 61% / 0.4)",
            "0 0 12px -3px hsl(240 73.9% 61% / 0.2)",
          ]}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-primary-foreground font-bold text-sm tracking-tight">R</span>
        </motion.div>
      </div>

      {/* Nav Icons */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map((item) => (
          <motion.button
            key={item.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
              item.active
                ? "bg-primary/10 text-primary glow-primary-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
            title={item.label}
          >
            <item.icon size={20} strokeWidth={item.active ? 2 : 1.5} />
          </motion.button>
        ))}
      </nav>
    </div>
  );
};

export default IconSidebar;
