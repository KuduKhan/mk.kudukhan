/* Portfolio v2.3 — local motion preferences and intentional pointer micro-interactions. */
(function(){
"use strict";
const root=document.documentElement;
const hero=document.querySelector(".hero-art");
const control=document.getElementById("motion-control");
const state=document.getElementById("motion-state");
const glyph=control?.querySelector("use");
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
const capable=window.matchMedia("(hover: hover) and (pointer: fine)");
const key="mufasa-portfolio-motion-v1";
function stored(){try{return localStorage.getItem(key);}catch{return null;}}
function save(value){try{localStorage.setItem(key,value);}catch{/* Storage is optional. */}}
function updateMotion(){
 const paused=reduced.matches||stored()==="paused";
 root.classList.toggle("motion-paused",paused);
 control.hidden=reduced.matches;
 control.setAttribute("aria-pressed",String(paused));
 control.setAttribute("aria-label",paused?"Resume decorative animations":"Pause decorative animations");
 state.textContent=paused?"Motion off":"Motion on";
 if(glyph)glyph.setAttribute("href","/assets/icons.svg#icon-"+(paused?"play":"pause"));
}
control.addEventListener("click",()=>{
 const paused=root.classList.contains("motion-paused");
 save(paused?"running":"paused");updateMotion();
});
if(typeof reduced.addEventListener==="function")reduced.addEventListener("change",updateMotion);
updateMotion();
hero.addEventListener("pointermove",event=>{
 if(!capable.matches||reduced.matches||root.classList.contains("motion-paused"))return;
 const bounds=hero.getBoundingClientRect();
 const x=((event.clientX-bounds.left)/bounds.width-.5)*14;
 const y=((event.clientY-bounds.top)/bounds.height-.5)*14;
 hero.style.setProperty("--art-x",x.toFixed(1)+"px");
 hero.style.setProperty("--art-y",y.toFixed(1)+"px");
},{passive:true});
hero.addEventListener("pointerleave",()=>{
 hero.style.setProperty("--art-x","0px");hero.style.setProperty("--art-y","0px");
});
document.querySelectorAll(".project-card").forEach(card=>{
 card.addEventListener("pointermove",event=>{
  if(!capable.matches||reduced.matches)return;
  const rect=card.getBoundingClientRect();
  card.style.setProperty("--spot-x",((event.clientX-rect.left)/rect.width*100).toFixed(1)+"%");
  card.style.setProperty("--spot-y",((event.clientY-rect.top)/rect.height*100).toFixed(1)+"%");
 },{passive:true});
});
if(!reduced.matches){
 Array.from(document.querySelectorAll(".hero-copy>.eyebrow,.hero-copy>h1,.hero-copy>.hero-description,.hero-copy>.hero-buttons,.hero-copy>.hero-foot"))
 .forEach((el,i)=>{el.style.animationDelay=String(80+i*75)+"ms";el.classList.add("mini-in");});
}
document.querySelectorAll("svg.ui-icon").forEach(svg=>svg.setAttribute("focusable","false"));
})();
