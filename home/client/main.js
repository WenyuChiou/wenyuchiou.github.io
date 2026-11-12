/* Homepage behaviour: tabs, the valley figure, workflow steps, project filter, reveal, pointer light, section pill, underlay river. */
(function(){
var r=document.documentElement,q=location.search,doc=document;
function $(s,c){return Array.prototype.slice.call((c||doc).querySelectorAll(s))}
function one(s,c){return (c||doc).querySelector(s)}
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches,ST=/static/.test(q);
r.classList.add("js");

/* tabs with sliding pill */
function placeInd(tb){var b=one('[aria-selected="true"]',tb),i=one(".ind",tb);if(!b||!i||!b.offsetWidth)return;i.style.width=b.offsetWidth+"px";i.style.transform="translateX("+b.offsetLeft+"px)"}
$(".tabs[data-tabs]").forEach(function(tb){var id=tb.dataset.tabs,bs=$("button",tb);
function pick(b,user){bs.forEach(function(x){x.setAttribute("aria-selected",x===b?"true":"false");x.tabIndex=x===b?0:-1});placeInd(tb);
$('[data-panel^="'+id+':"]').forEach(function(p){p.classList.toggle("on",p.dataset.panel===id+":"+b.dataset.k)});
tb.dispatchEvent(new CustomEvent("pick",{detail:{k:b.dataset.k,user:!!user}}));setTimeout(relayout,60)}
bs.forEach(function(b){b.addEventListener("click",function(){pick(b,true)})});
tb.addEventListener("keydown",function(e){var i=bs.indexOf(doc.activeElement);if(i<0||(e.key!=="ArrowRight"&&e.key!=="ArrowLeft"))return;e.preventDefault();var n=bs[(i+(e.key==="ArrowRight"?1:-1)+bs.length)%bs.length];n.focus();pick(n,true)});
tb.pick=function(k,user){var b=bs.filter(function(x){return x.dataset.k===String(k)})[0];if(b)pick(b,user)}});

/* publications, posters and talks: hovering a row, focusing inside it or pressing its Details button shows that row's card */
$(".pk").forEach(function(pk){var rows=$(".pkr",pk),cards=$(".pkd",pk),stacked=matchMedia("(max-width:980px)");
/* stacked layout: the card sits under its row, so closing the card above would move the row away from the pointer;
   there hover does nothing, and after a press or focus the page scrolls by the same amount so the row stays put */
function show(k,row){var y=row&&row.getBoundingClientRect().top;
rows.forEach(function(x){var on=x.dataset.pk===k;x.classList.toggle("on",on);one(".pkx",x).setAttribute("aria-pressed",on?"true":"false")});cards.forEach(function(c){c.classList.toggle("on",c.dataset.pk===k)});
if(row){var d=row.getBoundingClientRect().top-y;if(d)scrollBy({top:d,behavior:"instant"})}}
rows.forEach(function(x){x.addEventListener("mouseenter",function(){if(!stacked.matches)show(x.dataset.pk)});
["focusin","click"].forEach(function(ev){x.addEventListener(ev,function(){show(x.dataset.pk,stacked.matches?x:null)})})})});

/* valley: phases, river level, adaptation switch */
var V=one("#valley"),rng=one("#lv"),sw=one("#adapt"),ring=one(".fig .ring .r1"),ftabs=one('.tabs[data-tabs="ph"]'),ph=0,adapt=false,vt,wt;
function lvl(){V.style.setProperty("--lv",rng.value);rng.style.setProperty("--lvp",rng.value+"%")}
function wet(){var Ly=440-rng.value*1.4;$(".hs",V).forEach(function(h){var g=+h.dataset.g,up=adapt&&h.classList.contains("up"),w=Ly<g-3&&!(up&&Ly>g-58);h.classList.toggle("wet",w);h.classList.toggle("cov",w&&adapt&&h.classList.contains("ins"))})}
function setAdapt(a){adapt=a;V.classList.toggle("adapt",a);sw.setAttribute("aria-pressed",a?"true":"false")}
function phase(p){ph=p;V.classList.remove("p0","p1","p2","p3");V.classList.add("p"+p);ring.style.strokeDasharray=(p+1)+" 4";
rng.value=[8,8,91,24][p];setAdapt(p>0);V.classList.toggle("wetsky",p===2);lvl();clearTimeout(wt);wt=setTimeout(wet,ST?0:850)}
function stopV(){clearInterval(vt)}
ftabs.addEventListener("pick",function(e){phase(+e.detail.k);if(e.detail.user)stopV()});
rng.addEventListener("input",function(){stopV();V.classList.add("drag");V.classList.toggle("wetsky",+rng.value>70);lvl();wet()});
rng.addEventListener("change",function(){V.classList.remove("drag")});
sw.addEventListener("click",function(){stopV();setAdapt(!adapt);wet()});
["pointerenter","focusin"].forEach(function(ev){one(".fig").addEventListener(ev,stopV)});
phase(0);
if(ST)ftabs.pick(2);else if(!RM)vt=setInterval(function(){ftabs.pick((ph+1)%4)},4600);

/* workflow steps light up in turn; a step highlights its repo */
var fb=$("#flow button"),fi=0,ft,rows=$(".tile");
function flow(i){fb.forEach(function(b,j){b.classList.toggle("live",i===j)});var rr=i<0?"":fb[i].dataset.r;rows.forEach(function(x){x.classList.toggle("hl",!!rr&&x.dataset.r===rr)})}
fb.forEach(function(b,i){b.addEventListener("click",function(){clearInterval(ft);flow(i)})});
["pointerenter","focusin"].forEach(function(ev){one("#flow").addEventListener(ev,function(){clearInterval(ft)})});
if(ST)flow(1);else if(!RM)ft=setInterval(function(){flow(fi);fi=(fi+1)%fb.length},2100);

/* project list filter */
one('.tabs[data-tabs="pj"]').addEventListener("pick",function(e){var k=e.detail.k,n=0;rows.forEach(function(x){var g=x.dataset.g,show=k==="all"||g.indexOf(k)>-1;x.classList.toggle("hide",!show);if(show&&e.detail.user){x.style.animation="none";x.offsetWidth;x.style.animation="pin .6s var(--ease) "+(n++*45)+"ms both"}});});

/* reveal: blur-in once, then hand the element back to its own transitions */
var rvs=$(".hero .intro>*,.fig,.mq,section .eb,section h2,.sub,section .tabs[data-tabs],section .blk,.cvd");
rvs.forEach(function(el){el.classList.add("rv")});
function show(el,i){el.style.transitionDelay=(i*80)+"ms";el.classList.add("in");setTimeout(function(){el.style.transitionDelay="";el.classList.remove("rv","in")},1500+i*80)}
/* swept on scroll and layout instead of an observer, so nothing stays hidden if the tab loaded in the background */
function sweep(){if(!rvs.length)return;var k=0;rvs=rvs.filter(function(el){var b=el.getBoundingClientRect();if(b.width&&b.top<innerHeight*.94&&b.bottom>0){show(el,k++);return false}return true})}
if(RM||ST){rvs.forEach(function(el){el.classList.remove("rv")});rvs=[]}
setTimeout(sweep,60);setTimeout(sweep,900);

/* pointer light on blocks */
$(".blk").forEach(function(el){el.addEventListener("pointermove",function(e){var b=el.getBoundingClientRect();el.style.setProperty("--mx",(e.clientX-b.left)+"px");el.style.setProperty("--my",(e.clientY-b.top)+"px")})});

/* nav: current section pill */
var secs=$("main section[id]"),navA=$(".nav nav a"),nind=one(".nav .ind"),curId="";
function navInd(){var a=navA.filter(function(x){return x.getAttribute("href")==="#"+curId})[0];navA.forEach(function(x){x.classList.toggle("cur",x===a)});
if(a&&a.offsetWidth){nind.style.opacity=1;nind.style.width=a.offsetWidth+"px";nind.style.transform="translateX("+a.offsetLeft+"px)"}else nind.style.opacity=0}

/* underlay: one river down the page, drawn as you scroll */
var U=one("#under"),rv1,drop,rlen=0,rp=0,rt=0,ry0=0,rH=1,raf=0;
function under(){var W=r.clientWidth,H=r.scrollHeight,gut=Math.max(16,(W-Math.min(1240,W-48))/2),gx=gut/2,wig=Math.min(34,gut*.45),side=1;U.setAttribute("width",W);U.setAttribute("height",H);U.setAttribute("viewBox","0 0 "+W+" "+H);
/* the river keeps to one gutter beside each section and crosses over in the empty band between sections */
var px=W*.5,py=Math.min(innerHeight*.8,780),d="M"+px+" "+py,rings="";ry0=py;
secs.forEach(function(s,j){var T=s.offsetTop,P=parseFloat(getComputedStyle(s).paddingTop)||100,B=T+s.offsetHeight,x=side>0?W-gx:gx,y1=T+P*.85,my=(py+y1)/2,h=B-y1;
d+="C"+px+" "+my+" "+x+" "+my+" "+x+" "+y1+"C"+(x-wig*side)+" "+(y1+h/3)+" "+(x+wig*side)+" "+(y1+2*h/3)+" "+x+" "+B;
for(var k=0;k<5;k++)rings+='<ellipse class="cn" cx="'+x+'" cy="'+(y1+h/2)+'" rx="'+(110+k*80)+'" ry="'+(60+k*46)+'" transform="rotate('+(j%2?16:-16)+" "+x+" "+(y1+h/2)+')"/>';
px=x;py=B;side=-side});
d+="C"+px+" "+(py+70)+" "+W*.5+" "+(H-110)+" "+W*.5+" "+(H-24);
U.innerHTML=rings+'<path class="bank" d="'+d+'"/><path class="rv0" d="'+d+'"/><path class="rv1" d="'+d+'"/><circle class="drop" r="5"/>';
rv1=one(".rv1",U);drop=one(".drop",U);rlen=rv1.getTotalLength();rv1.style.strokeDasharray=rlen+" "+rlen;rH=H-24-ry0;if(ST||RM)rp=1;draw()}
function lenAtY(y){var lo=0,hi=rlen;for(var i=0;i<18;i++){var m=(lo+hi)/2;if(rv1.getPointAtLength(m).y<y)lo=m;else hi=m}return lo}
function draw(){var l=rp>=1?rlen:lenAtY(ry0+rH*rp),p=rv1.getPointAtLength(l);rv1.style.strokeDashoffset=rlen-l;drop.setAttribute("cx",p.x);drop.setAttribute("cy",p.y)}
function loop(){rp+=(rt-rp)*.09;draw();raf=Math.abs(rt-rp)>.0004?requestAnimationFrame(loop):0}
function onScroll(){var y=scrollY,c="";sweep();secs.forEach(function(s){if(s.getBoundingClientRect().top<innerHeight*.45)c=s.id});if(c!==curId){curId=c;navInd()}
if(ST||RM||!rlen)return;rt=Math.max(0,Math.min(1,(y+innerHeight*.72-ry0)/rH));if(!raf)raf=requestAnimationFrame(loop)}
function relayout(){$(".tabs").forEach(placeInd);navInd();under();onScroll()}
addEventListener("scroll",onScroll,{passive:true});addEventListener("resize",relayout);addEventListener("load",relayout);
if(doc.fonts&&doc.fonts.ready)doc.fonts.ready.then(relayout);
relayout();
})();
