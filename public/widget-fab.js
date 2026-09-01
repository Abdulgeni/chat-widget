"use strict";(()=>{(function(){var p;let s=window,r=s.__aiChatConfig||{},e=document.currentScript,c=(e==null?void 0:e.getAttribute("data-ai-chat-origin"))||(e!=null&&e.src?new URL(e.src).origin:""),n=document.createElement("div");n.id="__ai-chat-widget-host",n.style.position="fixed",n.style.zIndex="2147483647",n.style.bottom="20px",n.style.right="20px",document.body.appendChild(n);let a=n.attachShadow({mode:"open"}),d=document.createElement("style");d.textContent=`
    :host { all: initial; }
    .fab {
      width: 56px; height: 56px; border-radius: 50%;
      background: ${((p=r.theme)==null?void 0:p.primaryColor)||"#4f46e5"};
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; border: none; box-shadow: 0 4px 14px rgba(0,0,0,.25);
      transition: transform .15s ease;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .fab:hover { transform: scale(1.06); }
    .fab svg { width: 26px; height: 26px; fill: #fff; }
    .chat-mount { position: fixed; bottom: 90px; right: 20px; }
  `;let t=document.createElement("button");t.className="fab",t.setAttribute("aria-label","Open chat"),t.innerHTML='<svg viewBox="0 0 24 24"><path d="M4 4h16v12H7l-3 3V4z"/></svg>';let o=document.createElement("div");o.className="chat-mount",a.appendChild(d),a.appendChild(t),a.appendChild(o);let h=!1;async function l(){if(h)return;h=!0,t.style.opacity="0.6";let i=await import(`${c}/widget-chunk.js`);t.style.opacity="1",i.mountChat(o,a,{...r,apiOrigin:c}),(s.__aiChatCmdBuffer||[]).forEach(m=>{var f;(f=i.dispatch)==null||f.call(i,...m)})}t.addEventListener("click",l,{once:!1}),t.addEventListener("mouseenter",()=>{l()},{once:!0})})();})();
