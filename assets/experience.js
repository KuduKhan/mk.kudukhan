/* Lightweight progressive enhancement: search, keyboard navigation and project briefs. */
(function(){
"use strict";
const cards=Array.from(document.querySelectorAll(".project-card[data-project]"));
const filters=Array.from(document.querySelectorAll("[data-filter]"));
const projectSearch=document.getElementById("project-search");
const projectCount=document.getElementById("project-count");
const filterStatus=document.getElementById("project-filter-status");
const empty=document.getElementById("project-empty");
const reset=document.getElementById("project-reset");
const palette=document.getElementById("command-dialog");
const paletteTrigger=document.getElementById("quick-nav-trigger");
const paletteInput=document.getElementById("command-search");
const results=document.getElementById("command-results");
const brief=document.getElementById("project-dialog");
const floatingTop=document.getElementById("floating-top");
let focusReturn=null;
const projects=[
{slug:"khanhomes",title:"KhanHomes",field:"Property technology",stage:"Active development",description:"Kenya-first property management platform with leasing, maintenance, tenant conversations and operational tools.",focus:["Property and lease workflows","Tenant communication and maintenance","Responsive operations dashboards"],stack:["Next.js","TypeScript","Supabase"],repo:"https://github.com/KuduKhan/khanhomes",website:"https://khanhomes.vercel.app/"},
{slug:"khaniversity-platform",title:"KHANIVERSITY",field:"Education technology",stage:"Learning preview",description:"A virtual learning environment connecting structured computer science courses, hands-on exercises and capstone workflows.",focus:["Courses and practice exercises","Cohort and peer learning","Capstone and review foundations"],stack:["Next.js","Education","Supabase"],repo:"https://github.com/KuduKhan/khaniversity-platform"},
{slug:"mysoft-office",title:"MySoft Office",field:"Productivity software",stage:"Iterative releases",description:"A multi-editor productivity platform exploring documents, spreadsheets, slides, notes and Office-format compatibility.",focus:["Document and spreadsheet editors","Presentations and notes","File compatibility and export fidelity"],stack:["Documents","Spreadsheets","Editing"],repo:"https://github.com/KuduKhan/mysoft-office"},
{slug:"kudupray-frontend",title:"KuduPray",field:"Faith and utility",stage:"Application development",description:"An Islamic companion experience with Qur'an reading, prayer-time tools, audio and daily-use guidance.",focus:["Qur'an reading and audio","Prayer and learning tools","Accessible mobile navigation"],stack:["Next.js","Audio","Web"],repo:"https://github.com/KuduKhan/kudupray-frontend"},
{slug:"amanah-giving-Frontend",title:"Amanah Giving",field:"Giving technology",stage:"Frontend prototype",description:"A charitable-giving frontend exploring donors, campaign discovery and Zakat workflows. Financial processing is simulated.",focus:["Campaign discovery","Donor and Zakat tools","Transparent prototype workflows"],stack:["Next.js","Giving","UX"],repo:"https://github.com/KuduKhan/amanah-giving-Frontend"},
{slug:"islamtok",title:"IslamTok",field:"Creator platform",stage:"MVP development",description:"A moderation-first short-video platform with creator tools, mobile app foundations and backend workflows.",focus:["Video feeds and creator tools","Moderation processes","API and upload architecture"],stack:["Expo","NestJS","Media"],repo:"https://github.com/KuduKhan/islamtok"},
{slug:"music-world",title:"Music World",field:"Media discovery",stage:"Active development",description:"Responsive music discovery across artists, creators and live experiences.",focus:["Explore and discover content","Saved collections","Lightweight server services"],stack:["Node.js","Discovery","Music"],repo:"https://github.com/KuduKhan/music-world"},
{slug:"pukka-gen",title:"Pukka Gen",field:"Creative web",stage:"Website development",description:"A Vite-powered TypeScript frontend emphasizing expressive design and interactive presentation.",focus:["Visual language","Responsive design","TypeScript interactions"],stack:["Vite","TypeScript","Design"],repo:"https://github.com/KuduKhan/pukka-gen"}
];
const lookup=new Map(projects.map(p=>[p.slug,p]));
const nav=[
{title:"Home",description:"Introduction",href:"#home"},
{title:"Selected work",description:"Projects and platforms",href:"#work"},
{title:"Expertise",description:"Engineering and security",href:"#expertise"},
{title:"About",description:"Background and principles",href:"#about"},
{title:"Contact",description:"Start a conversation",href:"#contact"}];
const entries=nav.concat(projects.map(p=>({title:p.title,description:p.field+" · "+p.stack.join(", "),href:"#project-"+p.slug.toLowerCase()})));
function filter(){
 const selected=filters.find(b=>b.getAttribute("aria-pressed")==="true");
 const category=selected?selected.dataset.filter:"all",query=projectSearch.value.trim().toLocaleLowerCase();
 let count=0;
 cards.forEach(card=>{
  const p=lookup.get(card.dataset.project);
  const haystack=[p.title,p.field,p.description,...p.stack,...p.focus].join(" ").toLocaleLowerCase();
  const visible=(category==="all"||card.dataset.category===category)&&(!query||haystack.includes(query));
  card.hidden=!visible;if(visible)count++;
 });
 projectCount.textContent=String(count).padStart(2,"0")+(count===1?" PROJECT":" PROJECTS");
 filterStatus.textContent=count+" project"+(count===1?"":"s")+" displayed"+(query?" for "+projectSearch.value:"");
 empty.hidden=count!==0;
}
filters.forEach(button=>button.addEventListener("click",()=>{
 filters.forEach(item=>{const active=item===button;item.classList.toggle("active",active);item.setAttribute("aria-pressed",String(active));});
 filter();
}));
projectSearch.addEventListener("input",filter);
reset.addEventListener("click",()=>{projectSearch.value="";filters.find(b=>b.dataset.filter==="all").click();projectSearch.focus();});
filter();

function modal(dialog,trigger){
 if(typeof dialog.showModal!=="function")return false;
 focusReturn=trigger||document.activeElement;dialog.showModal();return true;
}
[palette,brief].forEach(dialog=>{
 dialog.addEventListener("close",()=>{if(focusReturn&&focusReturn.isConnected)focusReturn.focus({preventScroll:true});focusReturn=null;});
 dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
});
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>document.getElementById(b.dataset.close).close()));
function render(){
 const term=paletteInput.value.trim().toLocaleLowerCase();
 const found=entries.filter(p=>(p.title+" "+p.description).toLocaleLowerCase().includes(term)).slice(0,13);
 results.replaceChildren();
 if(!found.length){const p=document.createElement("p");p.className="command-no-results";p.textContent="No matching sections or projects.";results.append(p);return;}
 found.forEach((entry,i)=>{
  const link=document.createElement("a");link.className="command-result";link.href=entry.href;
  const mark=document.createElement("span");mark.className="command-mark";mark.textContent=String(i+1).padStart(2,"0");mark.setAttribute("aria-hidden","true");
  const copy=document.createElement("span");copy.className="command-copy";
  const title=document.createElement("strong");title.textContent=entry.title;
  const desc=document.createElement("small");desc.textContent=entry.description;
  copy.append(title,desc);const arrow=document.createElement("span");arrow.textContent="↗";arrow.setAttribute("aria-hidden","true");
  link.append(mark,copy,arrow);link.addEventListener("click",()=>palette.close());results.append(link);
 });
}
function openPalette(){paletteInput.value="";render();if(modal(palette,paletteTrigger))paletteInput.focus();else document.getElementById("work").scrollIntoView();}
paletteTrigger.addEventListener("click",openPalette);
paletteInput.addEventListener("input",render);
paletteInput.addEventListener("keydown",event=>{
 if(event.key==="ArrowDown"){const first=results.querySelector("a");if(first){event.preventDefault();first.focus();}}
 if(event.key==="Enter"){const first=results.querySelector("a");if(first){event.preventDefault();first.click();}}
});
results.addEventListener("keydown",event=>{
 if(event.key!=="ArrowDown"&&event.key!=="ArrowUp")return;
 const links=Array.from(results.querySelectorAll("a")),i=links.indexOf(document.activeElement);if(i<0)return;
 event.preventDefault();if(event.key==="ArrowUp"&&i===0)paletteInput.focus();else links[(i+(event.key==="ArrowDown"?1:-1)+links.length)%links.length].focus();
});
document.addEventListener("keydown",event=>{
 const editing=event.target instanceof HTMLElement&&(event.target.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(event.target.tagName));
 if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){event.preventDefault();if(palette.open)palette.close();else openPalette();}
 else if(event.key==="/"&&!editing&&!palette.open&&!brief.open&&!event.ctrlKey&&!event.metaKey&&!event.altKey){event.preventDefault();openPalette();}
});
cards.forEach(card=>{
 const p=lookup.get(card.dataset.project);if(!p)return;
 const button=document.createElement("button");button.type="button";button.className="project-brief-trigger";button.setAttribute("aria-label","Read "+p.title+" project brief");
 button.setAttribute("aria-haspopup","dialog");button.setAttribute("aria-controls","project-dialog");
 button.append(document.createTextNode("Project brief "));
 const arrow=document.createElement("span");arrow.className="brief-arrow";arrow.textContent="↗";arrow.setAttribute("aria-hidden","true");button.append(arrow);
 button.addEventListener("click",()=>{
  document.getElementById("brief-category").textContent=p.field.toUpperCase()+" / PROJECT BRIEF";
  document.getElementById("brief-title").textContent=p.title;
  document.getElementById("brief-status").textContent=p.stage.toUpperCase();
  document.getElementById("brief-description").textContent=p.description;
  const list=document.getElementById("brief-highlights");list.replaceChildren();
  p.focus.forEach(text=>{const li=document.createElement("li");li.textContent=text;list.append(li);});
  const tags=document.getElementById("brief-tags");tags.replaceChildren();
  p.stack.forEach(text=>{const tag=document.createElement("span");tag.textContent=text;tags.append(tag);});
  document.getElementById("brief-source").href=p.repo;
  const site=document.getElementById("brief-site");site.hidden=!p.website;if(p.website)site.href=p.website;
  if(!modal(brief,button))window.open(p.repo,"_blank","noopener,noreferrer");
 });
 (card.querySelector(".project-content")||card).append(button);
});
floatingTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"}));
let frame=0;function onScroll(){if(frame)return;frame=requestAnimationFrame(()=>{frame=0;const show=window.scrollY>620;floatingTop.classList.toggle("visible",show);floatingTop.toggleAttribute("inert",!show);});}
window.addEventListener("scroll",onScroll,{passive:true});onScroll();
if("IntersectionObserver" in window&&window.matchMedia("(prefers-reduced-motion: no-preference)").matches){
 const items=Array.from(document.querySelectorAll(".project-card,.expertise-card,.about-visual,.about-copy,.contact-main,.contact-side"));
 document.documentElement.classList.add("enhanced");
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("reveal-done");observer.unobserve(entry.target);}}),{threshold:.04,rootMargin:"0px 0px 35px 0px"});
 items.forEach(item=>{item.classList.add("reveal-pending");observer.observe(item);});
}
})();