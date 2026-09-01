// widget-src/fab.ts
// Compiled -> public/widget-fab.js. Small — icon + shadow root only.

interface AiChatConfig {
  appId?: string;
  apiKey?: string;
  jwt?: string;
  theme?: { primaryColor?: string };
}

(function initFab() {
  const w = window as unknown as {
    __aiChatConfig?: AiChatConfig;
    __aiChatCmdBuffer?: unknown[][];
  };
  const config = w.__aiChatConfig || {};

  const currentScript = document.currentScript as HTMLScriptElement | null;
  const origin =
    currentScript?.getAttribute("data-ai-chat-origin") ||
    (currentScript?.src ? new URL(currentScript.src).origin : "");

  const host = document.createElement("div");
  host.id = "__ai-chat-widget-host";
  host.style.position = "fixed";
  host.style.zIndex = "2147483647";
  host.style.bottom = "20px";
  host.style.right = "20px";
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; }
    .fab {
      width: 56px; height: 56px; border-radius: 50%;
      background: ${config.theme?.primaryColor || "#4f46e5"};
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; border: none; box-shadow: 0 4px 14px rgba(0,0,0,.25);
      transition: transform .15s ease;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .fab:hover { transform: scale(1.06); }
    .fab svg { width: 26px; height: 26px; fill: #fff; }
    .chat-mount { position: fixed; bottom: 90px; right: 20px; }
  `;

  const button = document.createElement("button");
  button.className = "fab";
  button.setAttribute("aria-label", "Open chat");
  button.innerHTML = `<svg viewBox="0 0 24 24"><path d="M4 4h16v12H7l-3 3V4z"/></svg>`;

  const chatMount = document.createElement("div");
  chatMount.className = "chat-mount";

  shadow.appendChild(style);
  shadow.appendChild(button);
  shadow.appendChild(chatMount);

  let chatEngineLoaded = false;

  async function loadChatEngine() {
    if (chatEngineLoaded) return;
    chatEngineLoaded = true;
    button.style.opacity = "0.6";

    const mod = await import(/* webpackIgnore: true */ `${origin}/widget-chunk.js`);
    button.style.opacity = "1";
    mod.mountChat(chatMount, shadow, {
      ...config,
      apiOrigin: origin,
    });

    (w.__aiChatCmdBuffer || []).forEach((args) => {
      mod.dispatch?.(...args);
    });
  }

  button.addEventListener("click", loadChatEngine, { once: false });
  button.addEventListener("mouseenter", () => { loadChatEngine(); }, { once: true });
})();

export {};