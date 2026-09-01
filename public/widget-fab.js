"use strict";(()=>{(function(){var g;let c=window,h=c.__aiChatConfig||{},n=document.currentScript,d=(n==null?void 0:n.getAttribute("data-ai-chat-origin"))||(n!=null&&n.src?new URL(n.src).origin:""),i=document.createElement("div");i.id="__ai-chat-widget-host",i.style.position="fixed",i.style.zIndex="2147483647",i.style.bottom="20px",i.style.right="20px",document.body.appendChild(i);let s=i.attachShadow({mode:"open"}),u=document.createElement("style");u.textContent=`
    :host { all: initial; }
    .fab {
      width: 56px; height: 56px; border-radius: 50%;
      background: ${((g=h.theme)==null?void 0:g.primaryColor)||"#4f46e5"};
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; border: none; box-shadow: 0 4px 14px rgba(0,0,0,.25);
      transition: transform .15s ease;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .fab:hover { transform: scale(1.06); }
    .fab svg { width: 26px; height: 26px; fill: #fff; }
    .chat-mount { position: fixed; bottom: 90px; right: 20px; }
  `;let e=document.createElement("button");e.className="fab",e.setAttribute("aria-label","Open chat"),e.innerHTML='<svg viewBox="0 0 24 24"><path d="M4 4h16v12H7l-3 3V4z"/></svg>';let r=document.createElement("div");r.className="chat-mount",s.appendChild(u),s.appendChild(e),s.appendChild(r);let l=null,a=null;function p(){return l?Promise.resolve(l):a||(e.style.opacity="0.6",a=import(`${d}/widget-chunk.js`).then(t=>(e.style.opacity="1",t.mountChat(r,s,{...h,apiOrigin:d}),(c.__aiChatCmdBuffer||[]).forEach(o=>{var f;let[m,...C]=o;(f=t.dispatch)==null||f.call(t,m,...C)}),l=t,t)).catch(t=>{throw e.style.opacity="1",a=null,console.warn("[ai-chat-widget] failed to load widget-chunk.js:",t),t}),a)}e.addEventListener("click",async()=>{var t;try{let o=await p();(t=o.dispatch)==null||t.call(o,"toggle")}catch{}}),e.addEventListener("mouseenter",()=>p(),{once:!0})})();})();
