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

  const accent1 = '#4338ca';
  const accent2 = config.theme?.primaryColor || '#8b5cf6';

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
    .fab-wrap { position: relative; width: 60px; height: 60px; }
    .aura {
      position: absolute; inset: -14px;
      border-radius: 50%;
      background: radial-gradient(circle, ${accent2}55, transparent 70%);
      opacity: 0;
      transition: opacity .3s ease;
      pointer-events: none;
      animation: auraBreathe 3s ease-in-out infinite;
    }
    .fab-wrap:hover .aura { opacity: 1; }
    @keyframes auraBreathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.12); } }

    .fab {
      position: relative;
      width: 60px; height: 60px; border-radius: 20px;
      background: linear-gradient(135deg, ${accent1}, ${accent2});
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; border: none;
      box-shadow: 0 10px 30px rgba(0,0,0,.28), 0 2px 8px rgba(0,0,0,.15);
      transition: transform .3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow .2s ease;
      font-family: system-ui, sans-serif;
      animation: fabPop .5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes fabPop { from { transform: scale(0) rotate(-10deg); } to { transform: scale(1) rotate(0); } }
    .fab:hover { transform: scale(1.08) rotate(-2deg); }
    .fab:active { transform: scale(.94); }
    .fab svg { width: 25px; height: 25px; fill: #fff; }
    .chat-mount { position: fixed; bottom: 92px; right: 20px; }

    .nudge {
      position: absolute;
      bottom: 72px;
      right: 0;
      width: 220px;
      background: #16171d;
      color: #f2f3f5;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 18px 18px 4px 18px;
      padding: 12px 14px;
      font-size: 13px;
      font-family: system-ui, sans-serif;
      line-height: 1.4;
      box-shadow: 0 12px 30px rgba(0,0,0,.35);
      cursor: pointer;
      animation: nudgeIn .5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes nudgeIn { from { opacity: 0; transform: translateY(8px) scale(.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .nudge-close {
      position: absolute; top: -8px; right: -8px;
      width: 20px; height: 20px; border-radius: 50%;
      background: #2a2b33; color: #fff; border: none;
      font-size: 11px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
  `;

  const wrap = document.createElement('div');
  wrap.className = 'fab-wrap';

  const aura = document.createElement('div');
  aura.className = 'aura';

  const button = document.createElement('button');
  button.className = 'fab';
  button.setAttribute('aria-label', 'Open chat');
  button.innerHTML = CHAT_ICON;

  const chatMount = document.createElement('div');
  chatMount.className = 'chat-mount';

  wrap.appendChild(aura);
  wrap.appendChild(button);
  shadow.appendChild(style);
  shadow.appendChild(wrap);
  shadow.appendChild(chatMount);

  let chatModule: ChatModule | null = null;
  let loadingPromise: Promise<ChatModule> | null = null;
  let isOpen = false;
  let nudgeShown = false;
  let nudgeEl: HTMLDivElement | null = null;

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

  async function openChat() {
    dismissNudge();
    try {
      const mod = await loadChatEngine();
      mod.dispatch?.('toggle');
      setIcon(!isOpen);
    } catch {
      /* already logged */
    }
  }

  function dismissNudge() {
    if (nudgeEl) {
      nudgeEl.remove();
      nudgeEl = null;
    }
  }

  function showNudge() {
    if (nudgeShown || isOpen) return;
    nudgeShown = true;
    nudgeEl = document.createElement('div');
    nudgeEl.className = 'nudge';
    nudgeEl.innerHTML = `👋 Need a hand with anything? I'm here to help.<button class="nudge-close" aria-label="Dismiss">✕</button>`;
    nudgeEl.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).classList.contains('nudge-close')) {
        e.stopPropagation();
        dismissNudge();
        return;
      }
      openChat();
    });
    wrap.appendChild(nudgeEl);
  }

  button.addEventListener('click', openChat);
  button.addEventListener('mouseenter', () => loadChatEngine(), { once: true });

  setTimeout(showNudge, 8000);
})();

export {};