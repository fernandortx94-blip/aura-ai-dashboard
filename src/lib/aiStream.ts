const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tool`;

export type Msg = { role: "user" | "assistant"; content: string };

export async function streamAI({
  tool,
  messages,
  onDelta,
  onDone,
  onError,
}: {
  tool: string;
  messages: Msg[];
  onDelta: (delta: string) => void;
  onDone: () => void;
  onError?: (msg: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ tool, messages }),
  });

  if (!resp.ok || !resp.body) {
    let err = "Error en la solicitud";
    try { const j = await resp.json(); err = j.error || err; } catch {}
    onError?.(err);
    onDone();
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let done = false;

  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const parsed = JSON.parse(json);
        const c = parsed.choices?.[0]?.delta?.content;
        if (c) onDelta(c);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
  onDone();
}