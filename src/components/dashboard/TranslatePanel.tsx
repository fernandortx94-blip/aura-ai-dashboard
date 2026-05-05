import { useState } from "react";
import { Loader2, Languages, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const LANGS: { code: string; label: string }[] = [
  { code: "auto", label: "Detectar idioma" },
  { code: "es", label: "Español" },
  { code: "en", label: "Inglés" },
  { code: "fr", label: "Francés" },
  { code: "de", label: "Alemán" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Portugués" },
  { code: "ja", label: "Japonés" },
  { code: "zh", label: "Chino" },
  { code: "ru", label: "Ruso" },
  { code: "ar", label: "Árabe" },
  { code: "ko", label: "Coreano" },
];

const ENDPOINTS = [
  "https://translate.fedilab.app/translate",
  "https://libretranslate.de/translate",
  "https://translate.terraprint.co/translate",
];

export function TranslatePanel() {
  const [source, setSource] = useState("auto");
  const [target, setTarget] = useState("en");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const swap = () => {
    if (source === "auto") return;
    setSource(target);
    setTarget(source);
    setInput(output);
    setOutput(input);
  };

  const translate = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput("");
    let lastErr = "";
    for (const url of ENDPOINTS) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: input, source, target, format: "text" }),
        });
        if (!res.ok) { lastErr = `HTTP ${res.status}`; continue; }
        const data = await res.json();
        if (data?.translatedText) {
          setOutput(data.translatedText);
          setLoading(false);
          return;
        }
        lastErr = "Respuesta vacía";
      } catch (e) {
        lastErr = e instanceof Error ? e.message : "Error de red";
      }
    }
    setLoading(false);
    toast.error(`No se pudo traducir: ${lastErr}`);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <header className="px-4 md:px-10 py-3 md:py-4 border-b border-border shrink-0">
        <h2 className="text-lg md:text-2xl font-semibold tracking-tight">Traductor</h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5 hidden md:block">Traducción gratuita con LibreTranslate.</p>
      </header>

      <div className="flex-1 min-h-0 p-3 md:p-6 flex flex-col gap-3 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="flex-1 md:w-[180px] md:flex-none bg-card border-border h-9"><SelectValue /></SelectTrigger>
            <SelectContent>{LANGS.map(l => <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={swap} className="rounded-full shrink-0 h-9 w-9"><ArrowRightLeft className="h-4 w-4" /></Button>
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger className="flex-1 md:w-[180px] md:flex-none bg-card border-border h-9"><SelectValue /></SelectTrigger>
            <SelectContent>{LANGS.filter(l => l.code !== "auto").map(l => <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe el texto a traducir..."
            className="resize-none bg-card border-border h-full min-h-0"
          />
          <div className="rounded-md border border-border bg-card p-3 text-sm whitespace-pre-wrap overflow-y-auto h-full min-h-0">
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : (output || <span className="text-muted-foreground">La traducción aparecerá aquí...</span>)}
          </div>
        </div>

        <div className="flex justify-end shrink-0">
          <Button onClick={translate} disabled={loading || !input.trim()} size="sm" className="bg-gradient-primary hover:opacity-90 shadow-glow">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Languages className="h-4 w-4 mr-2" />}
            Traducir
          </Button>
        </div>
      </div>
    </div>
  );
}
