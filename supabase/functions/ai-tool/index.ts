import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  chat: "Eres un asistente de IA inteligente, claro y conciso. Responde siempre en español a menos que el usuario escriba en otro idioma.",
  summarize: "Eres un experto en resumir textos. Devuelve un resumen claro con bullets de los puntos clave seguido de un párrafo final con la idea principal. Mantén el idioma del texto original.",
  code: "Eres un asistente experto en programación. Explica de forma clara, incluye ejemplos de código en bloques markdown con el lenguaje correcto, y señala buenas prácticas. Responde en español salvo que el usuario use otro idioma.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { tool, messages } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY no configurada");

    const system = SYSTEM_PROMPTS[tool] ?? SYSTEM_PROMPTS.chat;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: system }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("Groq error:", response.status, t);
      const msg = response.status === 429
        ? "Límite de Groq alcanzado, intenta más tarde."
        : response.status === 401
          ? "GROQ_API_KEY inválida."
          : "Error de Groq.";
      return new Response(JSON.stringify({ error: msg }), {
        status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-tool error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});