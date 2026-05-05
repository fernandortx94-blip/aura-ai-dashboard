import { speak } from "./tts";
import type { ToolKey } from "@/components/dashboard/Sidebar";

let activeTool: ToolKey = "chat";

export function setActiveTool(k: ToolKey) {
  activeTool = k;
}

export function getActiveTool(): ToolKey {
  return activeTool;
}

/**
 * Speak an automatic response. If the user is on the same panel,
 * speaks the content directly. If they are on a different panel,
 * prepends a notification so they know which tool finished.
 */
export function speakResponse(toolKey: ToolKey, toolLabel: string, content: string) {
  if (!content?.trim()) return;
  if (activeTool === toolKey) {
    speak(content);
  } else {
    speak(`Ferbot AI: ${toolLabel} ha terminado. ${content}`);
  }
}

/**
 * Short notification when a non-text tool completes.
 */
export function notifyComplete(toolKey: ToolKey, message: string) {
  if (activeTool === toolKey) return;
  speak(`Ferbot AI: ${message}`);
}