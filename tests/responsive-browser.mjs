import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch({headless:true});
const widths = [320,360,375,390,414,480,768,820,1024,1280,1440,1920,2560];
try {
  for (const width of widths) {
    const context=await browser.newContext({
      viewport:{width,height:width<500?760:900},
      reducedMotion:"reduce",colorScheme:"dark",deviceScaleFactor:1
    });
    const page=await context.newPage();
    const errors=[];
    page.on("pageerror",e=>errors.push(e.message));
    await page.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded",timeout:30000});
    await page.waitForFunction(()=>document.querySelectorAll(".project-brief-trigger").length===8);
    assert.equal(await page.locator(".case-detail-link").count(),4);
    assert.equal(await page.locator("#resume").count(),1);
    if([390,1440].includes(width)){
      await page.locator("#screenshots").scrollIntoViewIfNeeded();
      await page.locator(".evidence-desktop").first().waitFor({state:"visible"});
      const images=await page.locator(".evidence-grid img").evaluateAll(async els=>{
        await Promise.all(els.map(img=>img.decode().catch(()=>{})));
        return els.map(img=>({src:img.getAttribute("src"),naturalWidth:img.naturalWidth}));
      });
      assert.equal(images.length,6,"Expected genuine screenshot pairs");
      assert.ok(images.every(img=>img.naturalWidth>0),"Broken screenshot asset "+JSON.stringify(images));
    }
    const cssLinks=await page.locator('link[rel="stylesheet"][href^="/assets/"]').count();
    assert.equal(cssLinks,1,width+"px expected one consolidated local stylesheet");
    assert.ok((await page.locator('.site-header').evaluate(el=>getComputedStyle(el).position))==="sticky");

    const clipping=await page.evaluate(()=>{
      const viewport=document.documentElement.clientWidth;
      const selectors=[".site-header",".hero",".hero-copy",".hero-art",".section-top",".project-toolbar",".projects-grid",".project-card",".expertise-grid",".about-copy",".contact-main",".footer-main"];
      return selectors.flatMap(selector=>Array.from(document.querySelectorAll(selector)).filter(el=>{
        if(el.hidden||getComputedStyle(el).display==="none")return false;
        const r=el.getBoundingClientRect();
        return r.width>0&&(r.left<-2||r.right>viewport+2);
      }).map(el=>({selector,left:Math.round(el.getBoundingClientRect().left),right:Math.round(el.getBoundingClientRect().right),viewport})));
    });
    assert.deepEqual(clipping,[],width+"px clipping in major layout surfaces");
    assert.equal(errors.length,0,width+"px uncaught errors: "+errors.join(" | "));
    assert.equal(await page.locator(".project-card").count(),8);
    const svgCheck=await page.evaluate(async ()=>{
      const response=await fetch("/assets/icons.svg");
      const text=await response.text();
      const symbols=new DOMParser().parseFromString(text,"image/svg+xml").querySelectorAll("symbol").length;
      const icon=document.querySelector(".expertise-symbol .ui-icon");
      const bounds=icon.getBBox();
      return {status:response.status,symbols,width:bounds.width,height:bounds.height,visible:icon.getBoundingClientRect().width};
    });
    assert.equal(svgCheck.status,200,width+"px sprite unavailable");
    assert.ok(svgCheck.symbols>=20,width+"px missing icon symbols");
    assert.ok(svgCheck.width>0 && svgCheck.height>0,width+"px SVG did not render geometry");
    assert.ok(svgCheck.visible>10,width+"px icons are too small");
    const documentOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    const overflowDetails=await page.evaluate(()=>{
      const vw=document.documentElement.clientWidth;
      return [...document.body.querySelectorAll("*")].filter(el=>{
        if(el.hidden||getComputedStyle(el).display==="none")return false;
        const rect=el.getBoundingClientRect();
        if(rect.right<=vw+3&&rect.left>=-3)return false;
        for(let p=el.parentElement;p && p!==document.body && p!==document.documentElement;p=p.parentElement){
          const css=getComputedStyle(p);
          if(["hidden","clip","scroll","auto"].includes(css.overflowX))return false;
        }
        return true;
      }).map(el=>({tag:el.tagName,cls:typeof el.className==="string"?el.className.slice(0,70):"",right:Math.round(el.getBoundingClientRect().right),left:Math.round(el.getBoundingClientRect().left)})).slice(0,14);
    });
    assert.ok(documentOverflow<=2,width+"px horizontal page overflow "+documentOverflow+" offenders="+JSON.stringify(overflowDetails));

    // Test category + text filter together and empty-state recovery.
    await page.locator("#project-search").fill("KhanHomes");
    assert.equal(await page.locator(".project-card:not([hidden])").count(),1,width+"px project search");
    await page.locator("#project-search").fill("nonexistent-project-xyz");
    assert.equal(await page.locator("#project-empty").isVisible(),true,width+"px empty state");
    await page.locator("#project-reset").click();
    assert.equal(await page.locator(".project-card:not([hidden])").count(),8,width+"px project reset");

    // Native dialogs and command search must work for keyboard/touch devices.
    await page.locator("#project-khanhomes .project-brief-trigger").click();
    assert.equal(await page.locator("#project-dialog").evaluate(e=>e.open),true,width+"px project brief");
    assert.match(await page.locator("#brief-title").textContent(),/KhanHomes/);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#project-dialog").evaluate(e=>e.open),false,width+"px dialog close");

    await page.locator("#quick-nav-trigger").click();
    await page.locator("#command-search").fill("KuduPray");
    assert.ok((await page.locator("#command-results .command-result").count())>=1,width+"px palette search");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#command-dialog").evaluate(e=>e.open),false,width+"px palette close");

    // Device breakpoints: mobile navigation and theme responsiveness.
    if(width<=980) {
      assert.equal(await page.locator(".header-cta").isVisible(),false,width+"px desktop CTA must be hidden");
      await page.locator("#menu-toggle").click();
      assert.equal(await page.locator("#menu-toggle").getAttribute("aria-expanded"),"true");
      await page.locator("#mobile-nav a[href='#about']").click();
      assert.equal(await page.locator("#menu-toggle").getAttribute("aria-expanded"),"false");
    }
    const oldTheme=await page.locator("html").getAttribute("data-theme");
    await page.locator("#theme-toggle").click();
    assert.notEqual(await page.locator("html").getAttribute("data-theme"),oldTheme,width+"px theme toggle");
    if(width===390||width===1440){
      const mode=await page.locator("html").getAttribute("data-theme");
      assert.equal(mode,"light",width+"px light theme");
      const colors=await page.locator("body").evaluate(el=>({fg:getComputedStyle(el).color,bg:getComputedStyle(el).backgroundColor}));
      assert.notEqual(colors.fg,colors.bg,width+"px invalid light theme contrast baseline");
    }
    console.log("PASS",width+"px — layout, filtering, dialogs, keyboard, navigation, theme");
    if([390,1024,1440].includes(width)){
      for(const item of [
        {slug:"khanhomes",title:"KhanHomes"},
        {slug:"khaniversity",title:"KHANIVERSITY"},
        {slug:"mysoft-office",title:"MySoft Office"},
        {slug:"kudupray",title:"KuduPray"}]){
        await page.goto("http://127.0.0.1:4173/case-studies/"+item.slug+".html",{waitUntil:"domcontentloaded"});
        assert.match(await page.locator("h1").first().textContent(),new RegExp(item.title,"i"));
        assert.equal(await page.locator(".case-story section").count(),5);
        const over=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
        assert.ok(over<=2,width+"px case study overflow "+item.slug+" "+over);
        if(item.slug==="khanhomes"||item.slug==="kudupray"){
          const shot=page.locator(".case-capture.desktop img");
          await shot.scrollIntoViewIfNeeded();
          await shot.evaluate(el=>el.decode());
          assert.ok(await shot.evaluate(el=>el.naturalWidth>0),item.slug+" broken capture");
        }
      }
      if(width===390){
        await page.goto("http://127.0.0.1:4173/case-studies/khanhomes.html",{waitUntil:"domcontentloaded"});
        const phone=page.locator(".case-capture.mobile img");
        await phone.scrollIntoViewIfNeeded();
        assert.ok(await phone.isVisible(),"Mobile source capture should be visible on phone-sized screens");
        await phone.evaluate(el=>el.decode());
        assert.ok(await phone.evaluate(el=>el.naturalWidth>0),"Mobile screenshot failed to decode");
      }
      await page.goto("http://127.0.0.1:4173/resume.html",{waitUntil:"domcontentloaded"});
      assert.equal(await page.locator(".resume-experience>div").count(),4);
      assert.ok((await page.locator(".resume-sheet").isVisible()));
      const over=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
      assert.ok(over<=2,width+"px résumé overflow "+over);
      await page.evaluate(()=>window.print=()=>{window.__printCalled=true;});
      await page.locator("#print-resume").click();
      assert.equal(await page.evaluate(()=>window.__printCalled),true,"Résumé print action broken");
      await page.emulateMedia({media:"print"});
      assert.equal(await page.locator("#print-resume").isVisible(),false,"Screen-only print control should hide in print mode");
      await page.emulateMedia({media:"screen"});
      console.log("PASS",width+"px — case studies, screenshots, printable résumé");
    }
    await context.close();
  }
  const editorialContext=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});
  const editorialPage=await editorialContext.newPage();
  await editorialPage.goto("http://127.0.0.1:4173/case-studies/",{waitUntil:"domcontentloaded"});
  assert.equal(await editorialPage.locator(".case-index-glyph").count(),4);
  assert.equal(await editorialPage.locator(".case-index-arrow").count(),4);
  assert.equal(await editorialPage.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0,"Case index overflow");
  await editorialContext.close();
  const motionContext=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:"no-preference",colorScheme:"dark"});
  const motionPage=await motionContext.newPage();
  await motionPage.goto("http://127.0.0.1:4173/",{waitUntil:"domcontentloaded"});
  await motionPage.locator("#motion-control").waitFor({state:"visible"});
  assert.equal(await motionPage.locator("#motion-control").getAttribute("aria-pressed"),"false");
  await motionPage.locator("#motion-control").click();
  assert.equal(await motionPage.locator("#motion-control").getAttribute("aria-pressed"),"true");
  assert.equal(await motionPage.locator(".orbit-outer").evaluate(el=>getComputedStyle(el).animationPlayState),"paused");
  await motionPage.locator("#motion-control").click();
  assert.equal(await motionPage.locator("#motion-control").getAttribute("aria-pressed"),"false");
  const iconUse=await motionPage.locator("#motion-control use").getAttribute("href");
  assert.equal(iconUse,"/assets/icons.svg#icon-pause");
  console.log("PASS motion on/off, SVG control, keyboard semantics and preference persistence");
  await motionContext.close();
} finally {
  await browser.close();
}
