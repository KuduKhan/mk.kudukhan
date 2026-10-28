/* Editorial polish: visible-by-default entrances, navigable chapter state and print. */
(function(){
"use strict";
const print=document.getElementById("print-resume");
if(print)print.addEventListener("click",()=>window.print());
document.querySelectorAll("svg.ui-icon").forEach(icon=>icon.setAttribute("focusable","false"));
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
let stored=null;
try{stored=localStorage.getItem("mufasa-portfolio-motion-v1");}catch{/* optional */}
const allowMotion=()=>!reduced.matches&&stored!=="paused";
if("IntersectionObserver" in window){
 const toc=Array.from(document.querySelectorAll('.case-toc a[href^="#"]'));
 const targets=toc.map(link=>({link,section:document.querySelector(link.getAttribute("href"))})).filter(item=>item.section);
 if(targets.length){
  const tocObserver=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue;
    for(const item of targets){
     if(item.section===entry.target)item.link.setAttribute("aria-current","location");
     else item.link.removeAttribute("aria-current");
    }
   }
  },{rootMargin:"-25% 0px -62% 0px"});
  targets.forEach(item=>tocObserver.observe(item.section));
 }
 if(allowMotion()&&typeof Element!=="undefined"&&Element.prototype.animate){
  const elements=Array.from(document.querySelectorAll(".case-index-card,.case-facts .case-stat,.case-decisions li,.resume-experience>div"));
  const entrance=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue;
    entrance.unobserve(entry.target);
    if(!allowMotion())continue;
    const i=elements.indexOf(entry.target);
    entry.target.animate(
     [{opacity:.88,transform:"translateY(12px)"},{opacity:1,transform:"translateY(0)"}],
     {duration:420,delay:(i%4)*45,easing:"cubic-bezier(.22,1,.36,1)"}
    );
   }
  },{threshold:.08,rootMargin:"0px 0px 45px 0px"});
  elements.forEach(element=>entrance.observe(element));
 }
}
})();