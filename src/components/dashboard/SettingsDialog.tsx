import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, Volume2 } from "lucide-react";
import { getVoiceSettings, setVoiceSettings, getVoices, onVoicesChanged, speak, type VoiceSettings } from "@/lib/tts";

export function SettingsDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>(getVoiceSettings());

  useEffect(() => {
    const refresh = () => setVoices(getVoices());
    refresh();
    const off = onVoicesChanged(refresh);
    return off;
  }, []);

  const update = (patch: Partial<VoiceSettings>) => {
    const next = setVoiceSettings(patch);
    setSettings(next);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
            <Settings2 className="h-4 w-4" /> Configuración
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configuración de voz</DialogTitle>
          <DialogDescription>Ajusta la voz, velocidad y tono usados por Ferbot AI.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="tts-enabled" className="text-sm">Lectura en voz alta</Label>
            <Switch id="tts-enabled" checked={settings.enabled} onCheckedChange={(v) => update({ enabled: v })} />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Voz del dispositivo</Label>
            <Select
              value={settings.voiceURI ?? ""}
              onValueChange={(v) => update({ voiceURI: v || null })}
            >
              <SelectTrigger>
                <SelectValue placeholder={voices.length ? "Selecciona una voz" : "Cargando voces..."} />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {voices.map((v) => (
                  <SelectItem key={v.voiceURI} value={v.voiceURI}>
                    {v.name} — {v.lang}{v.default ? " (predeterminada)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{voices.length} voces disponibles</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Velocidad</Label>
              <span className="text-xs text-muted-foreground">{settings.rate.toFixed(2)}x</span>
            </div>
            <Slider min={0.5} max={2} step={0.05} value={[settings.rate]} onValueChange={([v]) => update({ rate: v })} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Tono</Label>
              <span className="text-xs text-muted-foreground">{settings.pitch.toFixed(2)}</span>
            </div>
            <Slider min={0} max={2} step={0.05} value={[settings.pitch]} onValueChange={([v]) => update({ pitch: v })} />
          </div>

          <Button
            variant="secondary"
            className="w-full gap-2"
            onClick={() => speak("Hola, soy Ferbot AI. Esta es una prueba de voz.")}
          >
            <Volume2 className="h-4 w-4" /> Probar voz
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}