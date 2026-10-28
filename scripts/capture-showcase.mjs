/* Capture real, unmodified UI viewports from verified public project sites.
 * No mockups, logged-in states, third-party screenshot services or secrets.
 * Failed captures are skipped; never substitute a synthetic image. */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const folder=resolve(root,"assets/showcase");
mkdirSync(folder,{recursive:true});
const sites=[
 {slug:"khanhomes",url:"https://khanhomes.vercel.app/",identify:/khanhomes|property management|aura/i},
 {slug:"khaniversity",url:"https://khaniversity-platform.vercel.app/",identify:/khaniversity|learning academy|virtual university/i},
 {slug:"kudupray",url:"https://kudupray.vercel.app/",identify:/kudupray|qur.?an|prayer time/i},
 {slug:"amanah",url:"https://amanahgiving.vercel.app/",identify:/amanah|zakat|donat/i}
];
const output={kind:"verified-website-captures",notice:"Actual unmodified public webpage captures; availability and UI change over time. No private or mock content.",capturedAt:new Date().toISOString(),screenshots:[]};
const browser=await chromium.launch({headless:true});
try {
 for(const site of sites){
  for(const device of [
   {name:"desktop",width:1440,height:900,mobile:false},
   {name:"mobile",width:390,height:844,mobile:true}
  ]){
   const context=await browser.newContext({viewport:{width:device.width,height:device.height},isMobile:device.mobile,deviceScaleFactor:1,reducedMotion:"reduce",colorScheme:"light"});
   const page=await context.newPage();
   try {
    const response=await page.goto(site.url,{waitUntil:"domcontentloaded",timeout:30000});
    if(!response||response.status()>=400)throw Error("HTTP "+(response?.status()??"no response"));
    await page.waitForTimeout(2300);
    const title=await page.title();
    const body=(await page.locator("body").innerText({timeout:12000})).slice(0,6000);
    if(!site.identify.test(title+" "+body)||body.length<120)throw Error("Site identity/content not verified");
    if(/Authentication Required|Access to this page is restricted|Deployment Protection|DEPLOYMENT_NOT_FOUND|Internal Server Error/i.test(title+" "+body.slice(0,650)))throw Error("Protected or error page");
    const filename=site.slug+"-"+device.name+".jpg";
    await page.screenshot({path:resolve(folder,filename),type:"jpeg",quality:83,animations:"disabled",caret:"hide",fullPage:false});
    output.screenshots.push({project:site.slug,device:device.name,file:"/assets/showcase/"+filename,source:site.url,title:title.slice(0,140),viewport:{width:device.width,height:device.height}});
    console.log("CAPTURED "+site.slug+" "+device.name+" "+title.slice(0,70));
   }catch(err){console.warn("SKIPPED "+site.slug+" "+device.name+": "+err.message.slice(0,180));}
   finally{await context.close();}
  }
 }
}finally{await browser.close();}
writeFileSync(resolve(folder,"manifest.json"),JSON.stringify(output,null,2)+"\n");
if(output.screenshots.length<2){
 console.error("Fewer than two verified screenshots; no fabricated fallbacks.");
 process.exitCode=1;
}
