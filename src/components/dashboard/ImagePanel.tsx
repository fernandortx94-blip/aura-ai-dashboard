import { useState } from "react";
import { Loader2, Wand2, Download, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ImagePanel() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setImage(null);
    const { data, error } = await supabase.functions.invoke("ai-image", { body: { prompt } });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Error generando imagen");
      return;
    }
    if (data?.error) {
      toast.error(data.error);
      return;
    }
    if (data?.imageUrl) setImage(data.imageUrl);
    else toast.error("No se recibió imagen");
  };

  return (
    <div className="flex h-full flex-col">
      <header className="px-6 md:px-10 py-6 border-b border-border">
        <h2 className="text-2xl font-semibold tracking-tight">Generador de Imágenes</h2>
        <p className="text-sm text-muted-foreground mt-1">Describe lo que imaginas y lo creamos al instante.</p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Un astronauta surfeando una nebulosa púrpura, estilo cinematográfico..."
              className="min-h-[110px] resize-none border-0 bg-transparent focus-visible:ring-0 p-0"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">Modelo: Nano Banana</p>
              <Button onClick={generate} disabled={loading || !prompt.trim()} className="bg-gradient-primary hover:opacity-90 shadow-glow">
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
                Generar
              </Button>
            </div>
          </div>

          <div className="aspect-square w-full rounded-2xl border border-border bg-gradient-soft overflow-hidden grid place-items-center relative">
            {loading && (
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground mt-3">Creando tu imagen...</p>
              </div>
            )}
            {!loading && image && (
              <>
                <img src={image} alt="Imagen generada" className="w-full h-full object-cover" />
                <a href={image} download="nebula-ai.png" className="absolute top-3 right-3">
                  <Button size="icon" variant="secondary" className="rounded-full">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
              </>
            )}
            {!loading && !image && (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Tu imagen aparecerá aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}