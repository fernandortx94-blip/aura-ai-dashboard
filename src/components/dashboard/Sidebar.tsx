import { MessageSquare, ImageIcon, Code2, Languages, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToolKey = "chat" | "image" | "code" | "translate" | "summarize";

export const TOOLS: { key: ToolKey; label: string; icon: any; desc: string }[] = [
  { key: "chat", label: "Chat Inteligente", icon: MessageSquare, desc: "Conversa con la IA" },
  { key: "image", label: "Generador de Imágenes", icon: ImageIcon, desc: "Crea visuales únicos" },
  { key: "code", label: "Asistente de Código", icon: Code2, desc: "Escribe y depura código" },
  { key: "translate", label: "Traductor", icon: Languages, desc: "Traduce a cualquier idioma" },
  { key: "summarize", label: "Resumidor de Textos", icon: FileText, desc: "Sintetiza documentos" },
];

export function Sidebar({ active, onSelect }: { active: ToolKey; onSelect: (k: ToolKey) => void }) {
  return (
    <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-border bg-sidebar/60 backdrop-blur-xl">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-border">
        <div className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-primary shadow-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-tight">Nebula AI</h1>
          <p className="text-xs text-muted-foreground">Dashboard multifunción</p>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        <p className="px-3 pt-3 pb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Herramientas</p>
        {TOOLS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onSelect(t.key)}
              className={cn(
                "group w-full text-left flex items-start gap-3 rounded-xl px-3 py-3 transition-all",
                "hover:bg-sidebar-accent",
                isActive && "bg-gradient-soft border border-primary/30 shadow-elegant"
              )}
            >
              <span className={cn(
                "grid place-items-center h-9 w-9 rounded-lg shrink-0 transition-all",
                isActive ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-secondary text-muted-foreground group-hover:text-foreground"
              )}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1 min-w-0">
                <span className={cn("block text-sm font-medium", isActive ? "text-foreground" : "text-sidebar-foreground")}>{t.label}</span>
                <span className="block text-xs text-muted-foreground truncate">{t.desc}</span>
              </span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="rounded-xl p-4 bg-gradient-soft border border-primary/20">
          <p className="text-xs font-medium">Powered by Lovable AI</p>
          <p className="text-[11px] text-muted-foreground mt-1">Gemini · GPT-5 · Nano Banana</p>
        </div>
      </div>
    </aside>
  );
}