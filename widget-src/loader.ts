// widget-src/loader.ts
// Compiled -> public/widget.js. Target: <10KB gzipped, zero deps.

type QueuedCall = [string, ...unknown[]];

interface ChatWidgetGlobal {
  q?: QueuedCall[];
  (...args: unknown[]): void;
}

declare global {
  interface Window {
    aiChat?: ChatWidgetGlobal;
    ChatWidgetObject?: string;
    __aiChatConfig?: Record<string, unknown>;
  }
}

(function bootstrap() {
  const w = window;
  const objName = w.ChatWidgetObject || "aiChat";
  const existing = w[objName as "aiChat"];
  const queue: QueuedCall[] = (existing && existing.q) || [];

  const currentScript = document.currentScript as HTMLScriptElement | null;
  const scriptSrc = currentScript?.src || "";
  const origin = scriptSrc ? new URL(scriptSrc).origin : "";

  let config: Record<string, unknown> = {};
  let fabInjected = false;

  function injectFab() {
    if (fabInjected) return;
    fabInjected = true;
    const s = document.createElement("script");
    s.src = `${origin}/widget-fab.js`;
    s.async = true;
    s.setAttribute("data-ai-chat-origin", origin);
    document.head.appendChild(s);
  }

  function handleCommand(...args: unknown[]) {
    const [cmd, payload] = args as [string, Record<string, unknown> | undefined];
    if (cmd === "init") {
      config = { ...config, ...(payload || {}) };
      w.__aiChatConfig = config;
      injectFab();
    } else {
      w.__aiChatConfig = w.__aiChatConfig || {};
      (w as any).__aiChatCmdBuffer = (w as any).__aiChatCmdBuffer || [];
      (w as any).__aiChatCmdBuffer.push(args);
    }
  }

  const realFn = ((...args: unknown[]) => handleCommand(...args)) as ChatWidgetGlobal;
  w[objName as "aiChat"] = realFn;

  queue.forEach((call) => handleCommand(...call));
})();

export {};