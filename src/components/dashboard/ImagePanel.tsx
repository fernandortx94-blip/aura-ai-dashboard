import { useState } from "react";
import { Loader2, Wand2, Download, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ImagePanel() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setImage(null);
    try {
      const seed = Math.floor(Math.random() * 1_000_000);
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("No se pudo generar la imagen"));
        img.src = url;
      });
      setImage(url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error generando imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <header className="px-4 md:px-10 py-3 md:py-4 border-b border-border shrink-0">
        <h2 className="text-lg md:text-2xl font-semibold tracking-tight">Generador de Imágenes</h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5 hidden md:block">Describe lo que imaginas y lo creamos al instante.</p>
      </header>

      <div className="flex-1 min-h-0 p-3 md:p-6 flex flex-col gap-3 md:gap-4 overflow-hidden">
        <div className="rounded-xl border border-border bg-card p-3 shrink-0">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Un astronauta surfeando una nebulosa púrpura..."
            className="min-h-[60px] max-h-24 resize-none border-0 bg-transparent focus-visible:ring-0 p-0 text-sm"
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
            <p className="text-[10px] md:text-xs text-muted-foreground">Pollinations.ai</p>
            <Button onClick={generate} disabled={loading || !prompt.trim()} size="sm" className="bg-gradient-primary hover:opacity-90 shadow-glow">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
              Generar
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 rounded-xl border border-border bg-gradient-soft overflow-hidden grid place-items-center relative">
          {loading && (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-sm text-muted-foreground mt-3">Creando tu imagen...</p>
            </div>
          )}
          {!loading && image && (
            <>
              <img src={image} alt="Imagen generada" className="w-full h-full object-contain" />
              <a href={image} download="ferbot-ai.png" target="_blank" rel="noreferrer" className="absolute top-3 right-3">
                <Button size="icon" variant="secondary" className="rounded-full">
                  <Download className="h-4 w-4" />
                </Button>
              </a>
            </>
          )}
          {!loading && !image && (
            <div className="text-center text-muted-foreground">
              <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Tu imagen aparecerá aquí</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
