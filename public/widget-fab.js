"use strict";(()=>{var E='<svg viewBox="0 0 24 24"><path d="M4 4h16v12H7l-3 3V4z"/></svg>',T='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>';(function(){var v;let u=window,h=u.__aiChatConfig||{},a=document.currentScript,f=(a==null?void 0:a.getAttribute("data-ai-chat-origin"))||(a!=null&&a.src?new URL(a.src).origin:""),M="#4338ca",g=((v=h.theme)==null?void 0:v.primaryColor)||"#8b5cf6",i=document.createElement("div");i.id="__ai-chat-widget-host",i.style.position="fixed",i.style.zIndex="2147483647",i.style.bottom="20px",i.style.right="20px",document.body.appendChild(i);let c=i.attachShadow({mode:"open"}),m=document.createElement("style");m.textContent=`
    :host { all: initial; }
    .fab-wrap { position: relative; width: 60px; height: 60px; }
    .aura {
      position: absolute; inset: -14px;
      border-radius: 50%;
      background: radial-gradient(circle, ${g}55, transparent 70%);
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
      background: linear-gradient(135deg, ${M}, ${g});
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
  `;let o=document.createElement("div");o.className="fab-wrap";let b=document.createElement("div");b.className="aura";let e=document.createElement("button");e.className="fab",e.setAttribute("aria-label","Open chat"),e.innerHTML=E;let l=document.createElement("div");l.className="chat-mount",o.appendChild(b),o.appendChild(e),c.appendChild(m),c.appendChild(o),c.appendChild(l);let d=null,s=null,p=!1,x=!1,n=null;function L(t){p=t,e.innerHTML=t?T:E,e.setAttribute("aria-label",t?"Close chat":"Open chat")}function w(){return d?Promise.resolve(d):s||(e.style.opacity="0.6",s=import(`${f}/widget-chunk.js`).then(t=>(e.style.opacity="1",t.mountChat(l,c,{...h,apiOrigin:f}),(u.__aiChatCmdBuffer||[]).forEach(r=>{var k;let[N,...H]=r;(k=t.dispatch)==null||k.call(t,N,...H)}),d=t,t)).catch(t=>{throw e.style.opacity="1",s=null,console.warn("[ai-chat-widget] failed to load widget-chunk.js:",t),t}),s)}async function C(){var t;y();try{let r=await w();(t=r.dispatch)==null||t.call(r,"toggle"),L(!p)}catch{}}function y(){n&&(n.remove(),n=null)}function _(){x||p||(x=!0,n=document.createElement("div"),n.className="nudge",n.innerHTML=`\u{1F44B} Need a hand with anything? I'm here to help.<button class="nudge-close" aria-label="Dismiss">\u2715</button>`,n.addEventListener("click",t=>{if(t.target.classList.contains("nudge-close")){t.stopPropagation(),y();return}C()}),o.appendChild(n))}e.addEventListener("click",C),e.addEventListener("mouseenter",()=>w(),{once:!0}),setTimeout(_,8e3)})();})();
