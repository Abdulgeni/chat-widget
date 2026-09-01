interface AiChatConfig {
  appId?: string;
  apiKey?: string;
  jwt?: string;
  theme?: { primaryColor?: string };
}

interface ChatModule {
  mountChat: (container: HTMLElement, shadow: ShadowRoot, config: AiChatConfig & { apiOrigin: string }) => void;
  dispatch?: (cmd: string, ...args: unknown[]) => void;
}

(function initFab() {
  const w = window as unknown as {
    __aiChatConfig?: AiChatConfig;
    __aiChatCmdBuffer?: unknown[][];
  };
  const config = w.__aiChatConfig || {};

  const currentScript = document.currentScript as HTMLScriptElement | null;
  const origin =
    currentScript?.getAttribute('data-ai-chat-origin') ||
    (currentScript?.src ? new URL(currentScript.src).origin : '');

  const host = document.createElement('div');
  host.id = '__ai-chat-widget-host';
  host.style.position = 'fixed';
  host.style.zIndex = '2147483647';
  host.style.bottom = '20px';
  host.style.right = '20px';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }
    .fab {
      width: 56px; height: 56px; border-radius: 50%;
      background: ${config.theme?.primaryColor || '#4f46e5'};
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; border: none; box-shadow: 0 4px 14px rgba(0,0,0,.25);
      transition: transform .15s ease;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .fab:hover { transform: scale(1.06); }
    .fab svg { width: 26px; height: 26px; fill: #fff; }
    .chat-mount { position: fixed; bottom: 90px; right: 20px; }
  `;

  const button = document.createElement('button');
  button.className = 'fab';
  button.setAttribute('aria-label', 'Open chat');
  button.innerHTML = `<svg viewBox="0 0 24 24"><path d="M4 4h16v12H7l-3 3V4z"/></svg>`;

  const chatMount = document.createElement('div');
  chatMount.className = 'chat-mount';

  shadow.appendChild(style);
  shadow.appendChild(button);
  shadow.appendChild(chatMount);

  let chatModule: ChatModule | null = null;
  let loadingPromise: Promise<ChatModule> | null = null;

  function loadChatEngine(): Promise<ChatModule> {
    if (chatModule) return Promise.resolve(chatModule);
    if (loadingPromise) return loadingPromise;

    button.style.opacity = '0.6';
    loadingPromise = import(/* webpackIgnore: true */ `${origin}/widget-chunk.js`)
      .then((mod: ChatModule) => {
        button.style.opacity = '1';
        mod.mountChat(chatMount, shadow, { ...config, apiOrigin: origin });
        (w.__aiChatCmdBuffer || []).forEach((args) => {
          const [cmd, ...rest] = args as [string, ...unknown[]];
          mod.dispatch?.(cmd, ...rest);
        });
        chatModule = mod;
        return mod;
      })
      .catch((err) => {
        button.style.opacity = '1';
        loadingPromise = null;
        console.warn('[ai-chat-widget] failed to load widget-chunk.js:', err);
        throw err;
      });

    return loadingPromise;
  }

  // Every click: ensure the engine is loaded, THEN toggle the window open/closed.
  button.addEventListener('click', async () => {
    try {
      const mod = await loadChatEngine();
      mod.dispatch?.('toggle');
    } catch {
      // already logged above
    }
  });

  // Prefetch on hover intent only — does not open the window.
  button.addEventListener('mouseenter', () => loadChatEngine(), { once: true });
})();

export {};