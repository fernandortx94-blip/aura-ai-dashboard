import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { streamAI, type Msg } from "@/lib/aiStream";
import { cn } from "@/lib/utils";
import { speakResponse } from "@/lib/voiceNotify";
import { stopSpeaking } from "@/lib/tts";
import type { ToolKey } from "@/components/dashboard/Sidebar";

export function ChatPanel({
  tool,
  title,
  description,
  placeholder,
  emptyHint,
}: {
  tool: ToolKey;
  title: string;
  description: string;
  placeholder: string;
  emptyHint: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    stopSpeaking();
    const userMsg: Msg = { role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setLoading(true);

    let acc = "";
    setMessages((p) => [...p, { role: "assistant", content: "" }]);

    await streamAI({
      tool,
      messages: [...messages, userMsg],
      onDelta: (d) => {
        acc += d;
        setMessages((p) => p.map((m, i) => (i === p.length - 1 ? { ...m, content: acc } : m)));
        requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }));
      },
      onError: (m) => toast.error(m),
      onDone: () => {
        setLoading(false);
        if (acc.trim()) speakResponse(tool, title, acc);
      },
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="px-4 md:px-10 py-3 md:py-4 border-b border-border shrink-0">
        <h2 className="text-lg md:text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5 hidden md:block">{description}</p>
      </header>

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 md:px-10 py-4 md:py-6 space-y-4 md:space-y-6">
        {messages.length === 0 && (
          <div className="h-full grid place-items-center">
            <div className="text-center max-w-md">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow mb-4">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-medium">Listo cuando tú lo estés</h3>
              <p className="text-sm text-muted-foreground mt-2">{emptyHint}</p>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "bg-card border border-border"
              )}
            >
              {m.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-code:text-primary">
                  {m.content ? <ReactMarkdown>{m.content}</ReactMarkdown> : <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3 md:p-6 pb-10 md:pb-6 bg-background/60 backdrop-blur shrink-0">
        <div className="relative max-w-4xl mx-auto">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={placeholder}
            className="min-h-[52px] max-h-32 resize-none pr-14 bg-card border-border focus-visible:ring-primary/50"
          />
          <Button
            onClick={send}
            disabled={loading || !input.trim()}
            size="icon"
            className="absolute right-2 bottom-2 h-10 w-10 rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}