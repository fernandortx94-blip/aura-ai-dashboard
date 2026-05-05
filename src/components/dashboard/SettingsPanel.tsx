import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, Volume2 } from "lucide-react";
import { getVoiceSettings, setVoiceSettings, getVoices, onVoicesChanged, speak, type VoiceSettings } from "@/lib/tts";

export function SettingsPanel() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>(getVoiceSettings());

  useEffect(() => {
    const refresh = () => setVoices(getVoices());
    refresh();
    return onVoicesChanged(refresh);
  }, []);

  const update = (patch: Partial<VoiceSettings>) => setSettings(setVoiceSettings(patch));

  return (
    <div className="h-full w-full flex flex-col p-4 md:p-6 overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-primary shadow-glow">
          <Settings2 className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Configuración de voz</h2>
          <p className="text-xs text-muted-foreground">Web Speech API · voces del dispositivo</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-border bg-card/60 backdrop-blur p-5 space-y-5">
        <div className="flex items-center justify-between">
          <Label htmlFor="tts-enabled-panel" className="text-sm">Lectura en voz alta</Label>
          <Switch id="tts-enabled-panel" checked={settings.enabled} onCheckedChange={(v) => update({ enabled: v })} />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Voz del dispositivo</Label>
          <Select value={settings.voiceURI ?? ""} onValueChange={(v) => update({ voiceURI: v || null })}>
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

        <Button variant="secondary" className="w-full gap-2" onClick={() => speak("Hola, soy Ferbot AI. Esta es una prueba de voz.")}>
          <Volume2 className="h-4 w-4" /> Probar voz
        </Button>
      </div>
    </div>
  );
}