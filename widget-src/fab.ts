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

const CHAT_ICON = `<svg viewBox="0 0 24 24"><path d="M4 4h16v12H7l-3 3V4z"/></svg>`;
const CLOSE_ICON = `<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>`;

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

  const primary = config.theme?.primaryColor || '#4f46e5';

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
      width: 60px; height: 60px; border-radius: 50%;
      background: linear-gradient(135deg, ${primary}, ${shade(primary, -18)});
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; border: none;
      box-shadow: 0 8px 24px rgba(0,0,0,.22), 0 2px 6px rgba(0,0,0,.12);
      transition: transform .18s ease, box-shadow .18s ease;
      font-family: system-ui, -apple-system, sans-serif;
      animation: fabPop .35s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes fabPop { from { transform: scale(0); } to { transform: scale(1); } }
    .fab:hover { transform: scale(1.07); box-shadow: 0 10px 28px rgba(0,0,0,.28); }
    .fab:active { transform: scale(.96); }
    .fab svg { width: 26px; height: 26px; fill: #fff; }
    .chat-mount { position: fixed; bottom: 92px; right: 20px; }
  `;

  const button = document.createElement('button');
  button.className = 'fab';
  button.setAttribute('aria-label', 'Open chat');
  button.innerHTML = CHAT_ICON;

  const chatMount = document.createElement('div');
  chatMount.className = 'chat-mount';

  shadow.appendChild(style);
  shadow.appendChild(button);
  shadow.appendChild(chatMount);

  let chatModule: ChatModule | null = null;
  let loadingPromise: Promise<ChatModule> | null = null;
  let isOpen = false;

  function setIcon(open: boolean) {
    isOpen = open;
    button.innerHTML = open ? CLOSE_ICON : CHAT_ICON;
    button.setAttribute('aria-label', open ? 'Close chat' : 'Open chat');
  }

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

  button.addEventListener('click', async () => {
    try {
      const mod = await loadChatEngine();
      mod.dispatch?.('toggle');
      setIcon(!isOpen);
    } catch {
      /* already logged */
    }
  });

  button.addEventListener('mouseenter', () => loadChatEngine(), { once: true });

  function shade(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const r = Math.min(255, Math.max(0, (num >> 16) + amt));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
})();

export {};