import { createRoot, type Root } from 'react-dom/client';
import ChatApp from './ChatApp';
import { chatStyles } from './styles';

interface MountConfig {
  appId?: string;
  apiKey?: string;
  jwt?: string;
  apiOrigin?: string;
  theme?: { primaryColor?: string };
}

let root: Root | null = null;
let visible = false;
let mountEl: HTMLElement | null = null;

export function mountChat(container: HTMLElement, shadow: ShadowRoot, config: MountConfig) {
  mountEl = container;

  const styleTag = document.createElement('style');
  styleTag.textContent = chatStyles;
  shadow.appendChild(styleTag);

  root = createRoot(container);
  root.render(
    <ChatApp
      theme={config.theme}
      apiOrigin={config.apiOrigin || ''}
      appId={config.appId}
      onClose={() => dispatch('close')}
    />
  );

  container.style.display = 'none';
}

export function dispatch(cmd: string, ...args: unknown[]) {
  if (!mountEl) return;
  if (cmd === 'open') {
    mountEl.style.display = 'block';
    visible = true;
  } else if (cmd === 'close') {
    mountEl.style.display = 'none';
    visible = false;
  } else if (cmd === 'toggle') {
    visible = !visible;
    mountEl.style.display = visible ? 'block' : 'none';
  }
}