import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch({headless:true});
const widths = [320,360,390,480,768,1024,1440,1920];
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
      await page.locator("#menu-toggle").click();
      assert.equal(await page.locator("#menu-toggle").getAttribute("aria-expanded"),"true");
      await page.locator("#mobile-nav a[href='#about']").click();
      assert.equal(await page.locator("#menu-toggle").getAttribute("aria-expanded"),"false");
    }
    const oldTheme=await page.locator("html").getAttribute("data-theme");
    await page.locator("#theme-toggle").click();
    assert.notEqual(await page.locator("html").getAttribute("data-theme"),oldTheme,width+"px theme toggle");
    console.log("PASS",width+"px — layout, filtering, dialogs, keyboard, navigation, theme");
    await context.close();
  }
} finally {
  await browser.close();
}
