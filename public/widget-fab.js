"use strict";(()=>{var w='<svg viewBox="0 0 24 24"><path d="M4 4h16v12H7l-3 3V4z"/></svg>',_='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>';(function(){var x;let f=window,u=f.__aiChatConfig||{},n=document.currentScript,p=(n==null?void 0:n.getAttribute("data-ai-chat-origin"))||(n!=null&&n.src?new URL(n.src).origin:""),g=((x=u.theme)==null?void 0:x.primaryColor)||"#4f46e5",a=document.createElement("div");a.id="__ai-chat-widget-host",a.style.position="fixed",a.style.zIndex="2147483647",a.style.bottom="20px",a.style.right="20px",document.body.appendChild(a);let c=a.attachShadow({mode:"open"}),m=document.createElement("style");m.textContent=`
    :host { all: initial; }
    .fab {
      width: 60px; height: 60px; border-radius: 50%;
      background: linear-gradient(135deg, ${g}, ${M(g,-18)});
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
  `;let e=document.createElement("button");e.className="fab",e.setAttribute("aria-label","Open chat"),e.innerHTML=w;let h=document.createElement("div");h.className="chat-mount",c.appendChild(m),c.appendChild(e),c.appendChild(h);let d=null,o=null,C=!1;function y(t){C=t,e.innerHTML=t?_:w,e.setAttribute("aria-label",t?"Close chat":"Open chat")}function b(){return d?Promise.resolve(d):o||(e.style.opacity="0.6",o=import(`${p}/widget-chunk.js`).then(t=>(e.style.opacity="1",t.mountChat(h,c,{...u,apiOrigin:p}),(f.__aiChatCmdBuffer||[]).forEach(i=>{var l;let[s,...r]=i;(l=t.dispatch)==null||l.call(t,s,...r)}),d=t,t)).catch(t=>{throw e.style.opacity="1",o=null,console.warn("[ai-chat-widget] failed to load widget-chunk.js:",t),t}),o)}e.addEventListener("click",async()=>{var t;try{let i=await b();(t=i.dispatch)==null||t.call(i,"toggle"),y(!C)}catch{}}),e.addEventListener("mouseenter",()=>b(),{once:!0});function M(t,i){let s=parseInt(t.replace("#",""),16),r=Math.round(2.55*i),l=Math.min(255,Math.max(0,(s>>16)+r)),v=Math.min(255,Math.max(0,(s>>8&255)+r)),k=Math.min(255,Math.max(0,(s&255)+r));return`#${((1<<24)+(l<<16)+(v<<8)+k).toString(16).slice(1)}`}})();})();
