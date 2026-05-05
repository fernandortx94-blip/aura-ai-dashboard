import { useState } from "react";
import { Sidebar, TOOLS, type ToolKey } from "@/components/dashboard/Sidebar";
import { ChatPanel } from "@/components/dashboard/ChatPanel";
import { ImagePanel } from "@/components/dashboard/ImagePanel";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles } from "lucide-react";

const Index = () => {
  const [active, setActive] = useState<ToolKey>("chat");

  const renderPanel = () => {
    switch (active) {
      case "chat":
        return (
          <ChatPanel
            tool="chat"
            title="Chat Inteligente"
            description="Haz cualquier pregunta. Respuestas claras, rápidas y contextuales."
            placeholder="Escribe tu mensaje... (Enter para enviar)"
            emptyHint="Pregúntame lo que sea: ideas, explicaciones, planificación o brainstorming."
          />
        );
      case "image":
        return <ImagePanel />;
      case "code":
        return (
          <ChatPanel
            tool="code"
            title="Asistente de Código"
            description="Escribe, depura y entiende código en cualquier lenguaje."
            placeholder="Pega tu código o describe lo que necesitas..."
            emptyHint="Pídeme que escriba un componente, depure un error o explique un snippet."
          />
        );
      case "translate":
        return (
          <ChatPanel
            tool="translate"
            title="Traductor"
            description="Traduce textos a cualquier idioma manteniendo el tono."
            placeholder='Ej: "Traduce al japonés: Buenos días, ¿cómo estás?"'
            emptyHint="Indica el idioma destino y el texto. Detecto automáticamente el idioma de origen."
          />
        );
      case "summarize":
        return (
          <ChatPanel
            tool="summarize"
            title="Resumidor de Textos"
            description="Convierte textos largos en resúmenes claros y útiles."
            placeholder="Pega aquí el texto que quieres resumir..."
            emptyHint="Pega un artículo, ensayo o documento y obtendrás los puntos clave."
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background bg-gradient-radial">
      <Sidebar active={active} onSelect={setActive} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-primary shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Nebula AI</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-sidebar border-border">
              <nav className="p-3 pt-10 space-y-1">
                {TOOLS.map((t) => {
                  const Icon = t.icon;
                  const isActive = active === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setActive(t.key)}
                      className={`w-full text-left flex items-center gap-3 rounded-xl px-3 py-3 ${isActive ? "bg-gradient-soft border border-primary/30" : "hover:bg-sidebar-accent"}`}
                    >
                      <span className={`grid place-items-center h-9 w-9 rounded-lg ${isActive ? "bg-gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium">{t.label}</span>
                    </button>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <main className="flex-1 min-h-0">{renderPanel()}</main>
      </div>
    </div>
  );
};

export default Index;
