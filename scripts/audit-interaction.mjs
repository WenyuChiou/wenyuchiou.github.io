import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";
import axe from "axe-core";
import sharp from "sharp";
const root = process.cwd();
const kind = fs.existsSync("features/flood-lab") ? "flood" : fs.existsSync("features/behavior-lab") ? "behavior" : "workbench";
const selector = { flood: "#human-environment-lab", behavior: "#behavior-comparison", workbench: "[data-workbench]" }[kind];
const route = { flood: "/work/floodabm/", behavior: "/work/human-grounded-llm-evaluation/", workbench: "/work/" }[kind];
const out = "outputs/interaction-audit";
fs.mkdirSync(out, { recursive: true });
const types = { ".html":"text/html", ".css":"text/css", ".js":"text/javascript", ".mjs":"text/javascript", ".svg":"image/svg+xml", ".woff2":"font/woff2", ".json":"application/json", ".png":"image/png", ".webp":"image/webp" };
const server = http.createServer((req,res) => {
  let rel = decodeURIComponent(new URL(req.url,"http://local").pathname).replace(/^\/+/, "");
  if (!rel || rel.endsWith("/")) rel += "index.html";
  const file = path.resolve(root,rel);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404);res.end();return; }
  res.writeHead(200,{"Content-Type":types[path.extname(file)] || "application/octet-stream","Cache-Control":"no-store"});fs.createReadStream(file).pipe(res);
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const origin = "http://127.0.0.1:" + server.address().port;
const executablePath = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await puppeteer.launch({executablePath,headless:true,args:["--enable-unsafe-swiftshader"]});
const failures=[],states=[],network=[];
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const check=(ok,message)=>{if(!ok)failures.push(message);};
async function opened(locale,width=390,theme="light",options={}) {
  const page=await browser.newPage();
  const pointerClick = page.click.bind(page);
  page.click = async (target) => {
    await page.$eval(target,e=>e.scrollIntoView({block:"center"}));
    await pause(60);
    await pointerClick(target);
    await pause(30);
  };
  await page.setViewport({width,height:900,deviceScaleFactor:1,isMobile:width<500,hasTouch:width<500});
  await page.emulateMediaFeatures([{name:"prefers-reduced-motion",value:"reduce"}]);
  await page.evaluateOnNewDocument(theme=>localStorage.setItem("wy-theme",theme),theme);
  if(options.noJS)await page.setJavaScriptEnabled(false);
  if(options.noGL)await page.evaluateOnNewDocument(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:original.call(this,type,...args);};});
  if(options.chunkFailure || options.delayed) {
    await page.setRequestInterception(true);
    page.on("request",r=>{
      if(r.url().includes("/assets/flood/")) {
        if(options.chunkFailure)r.abort();
        else setTimeout(()=>r.continue().catch(()=>{}),800);
      } else r.continue();
    });
  }
  page.on("request",r=>{if(r.url().includes("/assets/flood/"))network.push(r.url());});
  page.on("pageerror",e=>failures.push(locale+":"+width+" runtime "+e.message));
  await page.goto(origin+(locale==="zh-TW"?"/zh":"")+route,{waitUntil:"load"});
  if(!options.noJS)await page.waitForSelector(selector+'[data-enhanced="true"]',{timeout:10000});
  await page.evaluate(async()=>document.fonts.ready);
  await page.$eval(selector,e=>e.scrollIntoView({block:"start"}));
  await pause(150);
  return page;
}
async function canvasBytes(page) {
  const canvas=await page.$("[data-flood-canvas] canvas");
  return sharp(await canvas.screenshot()).raw().toBuffer();
}
try {
  for(const locale of ["en","zh-TW"])for(const theme of ["light","dark"])for(const width of [360,390,768,1440]) {
    const id=kind+"-"+locale+"-"+theme+"-"+width;
    const before=network.length;
    const page=await opened(locale,width,theme);
    if(kind==="flood") {
      check(network.length===before,id+": Three loaded before activation");
      await page.select("[data-flood-draft]","prepare");
      check(await page.$eval(selector,e=>e.dataset.floodAction==="hold"),id+": draft changed applied");
      await page.click("[data-flood-activate]");
      await page.waitForSelector('[data-flood-status="ready"]',{timeout:10000});
      await page.waitForFunction(()=>Number(document.querySelector("[data-flood-canvas]").dataset.floodSceneRenderCount)>0);
      await page.$eval(".flood-stage",e=>e.scrollIntoView({block:"center"}));await pause(120);
      const baseline=await canvasBytes(page);
      check(new Set(baseline).size>30,id+": blank canvas");
      await page.click("[data-flood-apply]");
      await page.$eval(".flood-stage",e=>e.scrollIntoView({block:"center"}));await pause(120);
      const prepared=await canvasBytes(page);
      check(!baseline.equals(prepared),id+": prepare no pixel change");
      await page.select("[data-flood-draft]","hold");await page.click("[data-flood-apply]");
      await page.$eval(".flood-stage",e=>e.scrollIntoView({block:"center"}));await pause(100);
      const hold=await canvasBytes(page);
      await page.select("[data-flood-draft]","insure");await page.click("[data-flood-apply]");
      await page.$eval(".flood-stage",e=>e.scrollIntoView({block:"center"}));await pause(100);
      check(hold.equals(await canvasBytes(page)),id+": insurance changed physical pixels");
      await page.select("[data-flood-draft]","elevate");await page.click("[data-flood-apply]");
      await page.$eval(".flood-stage",e=>e.scrollIntoView({block:"center"}));await pause(100);
      check(!hold.equals(await canvasBytes(page)),id+": elevation no pixel change");
      await page.click('[data-flood-tenure="renter"]');
      check(await page.$eval(selector,e=>e.dataset.floodAction==="hold"),id+": tenure did not reset");
      check(await page.$eval('option[value="elevate"]',e=>e.disabled),id+": renter elevation not disabled");
      await page.click("[data-flood-reset]");
      await page.$eval(".flood-stage",e=>e.scrollIntoView({block:"center"}));await pause(100);
      check(hold.equals(await canvasBytes(page)),id+": reset did not restore baseline");
      await page.click('[data-flood-object="river"]');
      await page.$eval(".flood-stage",e=>e.scrollIntoView({block:"center"}));await pause(100);
      await (await page.$(".flood-stage")).screenshot({path:out+"/"+id+"-scene.png"});
      await page.evaluate(()=>scrollTo(0,0));await pause(150);
      const frames=await page.$eval("[data-flood-canvas]",e=>e.dataset.floodSceneRenderCount);
      await pause(150);check(frames===await page.$eval("[data-flood-canvas]",e=>e.dataset.floodSceneRenderCount),id+": offscreen rendering");
    } else if(kind==="behavior") {
      for(const scenario of ["direction","groups","repeats"])for(const lens of ["direction","groups","repeats"]) {
        await page.click('[data-behavior-scenario-button="'+scenario+'"]');
        await page.focus('[data-behavior-lens-button="'+lens+'"]');await page.keyboard.press("Space");
        check(await page.$eval(selector,(e,[s,l])=>e.dataset.behaviorScenario===s&&e.dataset.behaviorLens===l,[scenario,lens]),id+": comparison state");
      }
      await page.click('[data-behavior-record-button="B4"]');
      check(await page.$eval("[data-behavior-selected-record]",e=>e.dataset.behaviorSelectedRecord==="B4"),id+": record");
      await page.click('[data-behavior-scenario-button="groups"]');await page.click('[data-behavior-lens-button="groups"]');
      check(await page.$$eval(".behavior-track rect",xs=>xs.some(e=>Number(e.getAttribute("width"))>0)),id+": chart empty");
    } else {
      for(const group of ["research","collaboration","learning","all"]) {
        await page.focus('[data-workbench-filter="'+group+'"]');await page.keyboard.press("Space");
        check(await page.$eval(selector,(e,g)=>e.dataset.workbenchGroup===g,group),id+": group");
        check(await page.$$eval('.repo-row[data-workbench-match="true"]',xs=>xs.length)===({research:2,collaboration:2,learning:1,all:5}[group]),id+": highlighted repos");
      }
      check(await page.$$eval(".workbench-project a",xs=>xs.length===5&&xs.every(e=>e.href.startsWith("https://github.com/WenyuChiou/"))),id+": links");
    }
    await page.$eval(selector,e=>e.scrollIntoView({block:"start"}));await pause(100);
    const layout=await page.$eval(selector,e=>({overflow:document.documentElement.scrollWidth>innerWidth+1,small:[...e.querySelectorAll("button,label,p,h2,h3,h4,h5,dt,dd")].filter(x=>x.getBoundingClientRect().height>0&&parseFloat(getComputedStyle(x).fontSize)<14).map(x=>x.tagName+":"+x.textContent.slice(0,30))}));
    check(!layout.overflow,id+": horizontal overflow");check(!layout.small.length,id+": small text "+layout.small);
    await (await page.$(selector)).screenshot({path:out+"/"+id+".png"});
    await page.evaluate(axe.source);
    const violations=await page.evaluate(async selector=>(await axe.run(document.querySelector(selector))).violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)})),selector);
    check(!violations.length,id+": axe "+JSON.stringify(violations));
    states.push({id,layout,violations});await page.close();
  }
  for(const locale of ["en","zh-TW"]) {
    const page=await opened(locale,390,"light",{noJS:true});
    check(await page.$eval(selector,e=>e.innerText.length>100),locale+": noJS evidence missing");
    if(kind==="behavior")check(await page.$$eval("[data-behavior-fallback]",xs=>xs.length)===3,locale+": noJS tables");
    if(kind==="workbench")check(await page.$$eval(".workbench-project a",xs=>xs.length)===5,locale+": noJS sources");
    await page.close();
  }
  if(kind==="flood") {
    for(const options of [{noGL:true},{chunkFailure:true}]) {
      const page=await opened("en",390,"light",options);
      await page.click("[data-flood-activate]");await page.waitForSelector('[data-flood-status="failed"]');
      check(await page.$eval(".flood-diagram",e=>getComputedStyle(e).visibility==="visible"),"failure fallback hidden");
      await page.select("[data-flood-draft]","prepare");await page.click("[data-flood-apply]");
      check(await page.$eval(selector,e=>e.dataset.floodAction==="prepare"),"failure blocked local controls");await page.close();
    }
    const page=await opened("en");
    await page.click("[data-flood-activate]");await page.waitForSelector('[data-flood-status="ready"]');
    await page.select("[data-flood-scenario]","severe");
    await page.$eval("[data-flood-canvas] canvas",e=>e.dispatchEvent(new Event("webglcontextlost",{cancelable:true})));
    await page.waitForSelector('[data-flood-status="failed"]');await page.close();
    const delayed=await opened("en",390,"light",{delayed:true});
    await delayed.click("[data-flood-activate]");await delayed.click("[data-flood-reset]");await pause(1100);
    check(await delayed.$eval(selector,e=>e.dataset.floodStatus==="idle"),"late import attached after reset");await delayed.close();
  }
} catch(error) { failures.push(error.stack); }
finally { await browser.close();await new Promise(resolve=>server.close(resolve)); }
fs.writeFileSync(out+"/summary.json",JSON.stringify({kind,states,failures},null,2));
console.log(JSON.stringify({kind,states:states.length,failures},null,2));
assert.equal(failures.length,0);
