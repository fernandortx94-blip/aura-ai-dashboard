import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Sidebar, TOOLS, type ToolKey } from "@/components/dashboard/Sidebar";
import { ChatPanel } from "@/components/dashboard/ChatPanel";
import { ImagePanel } from "@/components/dashboard/ImagePanel";
import { TranslatePanel } from "@/components/dashboard/TranslatePanel";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { setActiveTool } from "@/lib/voiceNotify";
import { stopSpeaking } from "@/lib/tts";

const ORDER: ToolKey[] = ["chat", "image", "translate", "summarize", "code"];

const Index = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start", duration: 25 });
  const [active, setActive] = useState<ToolKey>("chat");

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const k = ORDER[emblaApi.selectedScrollSnap()];
      setActive(k);
      setActiveTool(k);
      stopSpeaking();
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  const goTo = (k: ToolKey) => {
    const i = ORDER.indexOf(k);
    emblaApi?.scrollTo(i);
    setActive(k);
    setActiveTool(k);
    stopSpeaking();
  };

  const panels: Record<ToolKey, JSX.Element> = {
    chat: (
      <ChatPanel
        tool="chat"
        title="Chat Inteligente"
        description="Haz cualquier pregunta. Respuestas claras, rápidas y contextuales."
        placeholder="Escribe tu mensaje... (Enter para enviar)"
        emptyHint="Pregúntame lo que sea: ideas, explicaciones, planificación o brainstorming."
      />
    ),
    image: <ImagePanel />,
    translate: <TranslatePanel />,
    summarize: (
      <ChatPanel
        tool="summarize"
        title="Resumidor de Textos"
        description="Convierte textos largos en resúmenes claros y útiles."
        placeholder="Pega aquí el texto que quieres resumir..."
        emptyHint="Pega un artículo, ensayo o documento y obtendrás los puntos clave."
      />
    ),
    code: (
      <ChatPanel
        tool="code"
        title="Asistente de Código"
        description="Genera, explica y depura código en cualquier lenguaje."
        placeholder="Describe tu problema o pega tu código..."
        emptyHint="Pídeme una función, una explicación o ayuda para depurar un error."
      />
    ),
  };

  const idx = ORDER.indexOf(active);

  return (
    <div className="h-screen w-full flex bg-background bg-gradient-radial overflow-hidden">
      <Sidebar active={active} onSelect={goTo} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-primary shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Ferbot AI</span>
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
                      onClick={() => goTo(t.key)}
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

        {/* Embla carousel */}
        <main className="flex-1 min-h-0 relative">
          <div ref={emblaRef} className="overflow-hidden h-full">
            <div className="flex h-full touch-pan-y">
              {ORDER.map((k) => (
                <div key={k} className="flex-[0_0_100%] min-w-0 h-full">
                  {panels[k]}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop arrows */}
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={idx === 0}
            className="hidden md:grid place-items-center absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 border border-border backdrop-blur hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed z-10"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={idx === ORDER.length - 1}
            className="hidden md:grid place-items-center absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/80 border border-border backdrop-blur hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed z-10"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/70 border border-border backdrop-blur z-10">
            {ORDER.map((k, i) => (
              <button
                key={k}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Ir a pantalla ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === idx ? "w-6 bg-gradient-primary shadow-glow" : "w-2 bg-muted hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
