/* One year of commits, two ways.
   Dam: each day's commits fall as rain into a linear reservoir (residence time 14 days); release = storage / 14.
   Snake: the year as a grid of days; the snake eats the faintest squares first and the brightest last. */
(function(){
var doc=document,R=doc.documentElement,host=doc.getElementById("act5");if(!host)return;
/* The page carries the year it was built with. A daily job rewrites year.json in the repository, but a commit made by that
   job does not rebuild GitHub Pages, so the live site reads the file from the repository first and its own copy second. */
var LOCAL="/assets/commit-maps/year.json",REPO="https://raw.githubusercontent.com/WenyuChiou/wenyuchiou.github.io/standalone-portfolio/assets/commit-maps/year.json",
srcs=location.hostname==="wenyuchiou.github.io"?[REPO,LOCAL]:[LOCAL],begun=false,built=JSON.parse(host.dataset.days);
function ok(d){return Array.isArray(d)&&d.length>=300&&d.length<=400&&d.every(function(x){return Array.isArray(x)&&/^\d{4}-\d\d-\d\d$/.test(x[0])&&isFinite(x[1])&&x[1]>=0&&x[1]===Math.floor(x[1])})}
function begin(d){if(begun)return;begun=true;try{start(d)}catch(e){if(d!==built)start(built);else throw e}}
/* a copy that ends earlier than the page's own data is stale, so it is skipped */
function fresh(d){return ok(d)&&d[d.length-1][0]>=built[built.length-1][0]}
function load(i){if(i>=srcs.length)return begin(built);fetch(srcs[i]).then(function(r){return r.ok?r.json():null}).then(function(j){if(j&&fresh(j.days))begin(j.days);else load(i+1)}).catch(function(){load(i+1)})}
if(window.fetch&&!/static/.test(location.search)){load(0);setTimeout(function(){begin(built)},2500)}else begin(built);
function start(D){
var N=D.length,ST=/static/.test(location.search),RM=matchMedia("(prefers-reduced-motion:reduce)").matches,
MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],NS="http://www.w3.org/2000/svg",
C=D.map(function(d){return d[1]}),maxC=Math.max.apply(0,C),TAU=14;
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function zh(){return R.dataset.lang==="zh"}
function f1(v){return (+v).toFixed(1)}
function tx(en,z){return zh()?z:en}
function date(i){var d=D[i][0],y=d.slice(0,4),m=+d.slice(5,7),dd=+d.slice(8);return zh()?y+"/"+m+"/"+dd:MON[m-1]+" "+dd+", "+y}
function cnt(v){return zh()?v+" 個 commit":v+(v===1?" commit":" commits")}
function mlab(m){return m===1?D[N-1][0].slice(0,4):zh()?m+" 月":MON[m-1]}
function styles(root){[].forEach.call(root.querySelectorAll("[data-st]"),function(e){e.style.cssText=e.getAttribute("data-st")})}
var span=doc.getElementById("a5range");if(span)span.textContent=date(0)+" → "+date(N-1);
function rnd(seed){var s=seed;return function(){s=(s*16807)%2147483647;return (s-1)/2147483646}}

/* linear reservoir: what is stored, and what the gate lets out each day */
var S=[],RL=[],st=0;C.forEach(function(c){var r=st/TAU;st=st-r+c;S.push(st);RL.push(r)});
var maxS=Math.max.apply(0,S)*1.06,maxR=Math.max.apply(0,RL)||1;
/* rule curves: the middle half of each month's storage, eased across month boundaries */
var mo=D.map(function(d){return d[0].slice(0,7)}),mk=[];mo.forEach(function(m){if(mk.indexOf(m)<0)mk.push(m)});
function qt(a,p){var s=a.slice().sort(function(x,y){return x-y}),k=(s.length-1)*p,f=Math.floor(k);return s[f]+(s[Math.min(f+1,s.length-1)]-s[f])*(k-f)}
var band={};mk.forEach(function(m){var v=S.filter(function(_,i){return mo[i]===m});band[m]=[qt(v,.25),qt(v,.75)]});
function ease(k){var raw=mo.map(function(m){return band[m][k]});return raw.map(function(_,i){var a=Math.max(0,i-7),b=Math.min(N-1,i+7),s=0,j;for(j=a;j<=b;j++)s+=raw[j];return s/(b-a+1)})}
var LO=ease(0),UP=ease(1),Z=S.map(function(s,i){return s>UP[i]?2:s<LO[i]?0:1}),
CALL=[["Store water","蓄水"],["Steady release","正常放流"],["Open the gates","開閘放水"]];
function chip(cls,label,x,y){var w=label.length*(/[^\x00-\x7f]/.test(label)?13:7.4)+14;return '<g class="ch '+cls+'"><rect class="cb" x="'+f1(x)+'" y="'+f1(y-14)+'" width="'+f1(w)+'" height="20" rx="6"/><text x="'+f1(x+7)+'" y="'+f1(y)+'">'+label+'</text></g>'}
var CLOUD="M8 30a9 9 0 0 1 2-17.800a13 13 0 0 1 24.500-5.200a11 11 0 0 1 19.500 6.200a8.500 8.500 0 0 1 1 16.800z";

/* ---------- the dam ---------- */
function dam(el,W){var cv=el.querySelector(".a5c"),ag=el.querySelector(".a5ag"),call=el.querySelector(".a5call"),nar=W<620,Hs=nar?344:440,bh=nar?36:48,H=Hs+16+bh+24,
pl=nar?6:12,dx=(W-2*pl)/(N-1),x=function(i){return pl+i*dx},base=Hs+16+bh,
xd=W*(nar?.64:.7),cy=nar?142:120,fy=Hs-20,hw=nar?20:34,dw=nar?50:86,bx=W*(nar?.2:.17),sky=nar?92:58,
yl=function(v){return fy-12-clamp(v/maxS,0,1)*(fy-12-(cy+18))},
bank="M0 "+(cy-8)+"C"+f1(W*.05)+" "+(cy+50)+" "+f1(bx*.62)+" "+(fy-8)+" "+f1(bx)+" "+fy,
xo=xd+dw*.66,yo=fy-(fy-cy)*.2,i,s="",rg=rnd(7),K=nar?84:130,wv="M-90 0",cl="";
for(i=-90;i<xd+90;i+=40)wv+="q10 -5 20 0t20 0";wv+="V"+(Hs+40)+"H-90Z";
/* rain: streaks in shuffled order so any count spreads evenly over the catchment */
var rain="";for(i=0;i<K;i++){var rx=30+((i*0.618034)%1)*(xd-34),ry=sky+rg()*26;rain+='<line class="rn" x1="'+f1(rx)+'" y1="'+f1(ry)+'" x2="'+f1(rx-5.5)+'" y2="'+f1(ry+22)+'" data-st="--dl:-'+f1(rg()*1.2)+'s;--t:'+f1(.55+rg()*.4)+'s"/>'}
[[.2,16,1.3],[.42,4,1.75],[.66,20,1.35]].forEach(function(c,k){if(nar&&k===2)return;cl+='<path class="cl" transform="translate('+f1(c[0]*(xd-70))+' '+(c[1]+(nar?50:10))+') scale('+(nar?c[2]*.72:c[2])+')" d="'+CLOUD+'"/>'});
/* year strip: one bar per day, lit up to today by a single clip rectangle */
var bars="",bw=clamp(dx*.74,1,6),area="M"+f1(x(0))+" "+base;
if(dx>=2.2){for(i=0;i<N;i++){var h=C[i]?Math.max(2,C[i]/maxC*bh):1;bars+='<rect x="'+f1(x(i)-bw/2)+'" y="'+f1(base-h)+'" width="'+f1(bw)+'" height="'+f1(h)+'"/>'}}
else{for(i=0;i<N;i++)area+="L"+f1(x(i))+" "+f1(base-(C[i]?Math.max(2,C[i]/maxC*bh):1));area+="L"+f1(x(N-1))+" "+base+"Z";bars='<path d="'+area+'"/>'}
var ticks="";D.forEach(function(d,k){if(d[0].slice(8)!=="01")return;var m=+d[0].slice(5,7),xx=f1(x(k)-dx/2);ticks+='<line class="mt" x1="'+xx+'" y1="'+(base-bh-4)+'" x2="'+xx+'" y2="'+(base+20)+'"/>';
if(!nar||m%3===1)ticks+='<text class="ml" x="'+f1(x(k)-dx/2+5)+'" y="'+(base+20)+'">'+mlab(m)+'</text>'});
cv.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+tx("A dam filled by one year of commits","用一年的 commit 蓄水的水壩")+'"><defs>'
+'<linearGradient id="a5sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d262d"/><stop offset="1" stop-color="#10242a" stop-opacity="0"/></linearGradient>'
+'<linearGradient id="a5w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fe1e6"/><stop offset=".25" stop-color="#58bcc4"/><stop offset="1" stop-color="#2f7c86"/></linearGradient>'
+'<linearGradient id="a5d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a6168"/><stop offset="1" stop-color="#1b343b"/></linearGradient>'
+'<clipPath id="a5b"><path d="'+bank+'H'+f1(xd-hw)+'L'+f1(xd-12)+' '+cy+'V0H0Z"/></clipPath><clipPath id="a5sc"><rect x="0" y="0" width="'+W+'" height="'+Hs+'" rx="16"/></clipPath>'
+'<clipPath id="a5lit"><rect class="lit" x="0" y="'+(base-bh-2)+'" width="0" height="'+(bh+3)+'"/></clipPath></defs>'
+'<g clip-path="url(#a5sc)"><rect class="sky" width="'+W+'" height="'+Hs+'"/><g class="cls">'+cl+'</g><g class="rain" data-st="--d:'+(fy-sky-10)+'px">'+rain+'</g>'
+'<g clip-path="url(#a5b)"><g class="lvl"><path class="wv wave" d="'+wv+'"/></g>'
+'<g class="ru"><line x1="0" x2="'+f1(xd)+'" y1="0" y2="0"/>'+chip("u",tx("upper","上限"),nar?bx+6:W*.26,-7)+'</g><g class="rl"><line x1="0" x2="'+f1(xd)+'" y1="0" y2="0"/>'+chip("l",tx("lower","下限"),nar?bx+6:W*.26,19)+'</g></g>'
+'<path class="gr" d="'+bank+'H'+W+'V'+Hs+'H0Z"/><path class="gl" d="'+bank+'H'+W+'"/>'
+'<rect class="dn" x="'+f1(xd+dw-2)+'" y="'+(fy-30)+'" width="'+f1(W-xd-dw+2)+'" height="30"/>'
+'<path class="jet" d="M'+f1(xo)+' '+f1(yo)+'Q'+f1(xo+34)+' '+f1(yo-4)+' '+f1(xo+50)+' '+(fy-6)+'"/>'
+'<path class="dam" d="M'+f1(xd-12)+' '+cy+'H'+f1(xd+12)+'L'+f1(xd+dw)+' '+fy+'H'+f1(xd-hw)+'Z"/><rect class="crest" x="'+f1(xd-22)+'" y="'+(cy-6)+'" width="44" height="7" rx="3"/>'
+'<path class="wire" d="M'+f1(xd)+' '+(cy+6)+'V'+f1(yo)+'H'+f1(xo-4)+'"/>'
+(nar?'':'<text class="tg" text-anchor="end" x="'+f1(xd-56)+'" y="74">'+tx("rain = commits that day","雨量＝當天的 commit")+'</text>')
+'<text class="tg dk" text-anchor="'+(nar?"end":"middle")+'" x="'+f1(nar?xd-hw-8:(bx+xd-hw)/2)+'" y="'+(fy-18)+'">'+tx("storage","蓄水")+'</text>'
+'<text class="tg" text-anchor="end" x="'+(W-(nar?10:16))+'" y="'+(fy-44)+'">'+tx("release","放流")+'</text>'
+'<text class="rd" x="'+(nar?12:20)+'" y="'+(nar?30:38)+'"></text><text class="rc" x="'+(nar?12:20)+'" y="'+(nar?50:60)+'"></text></g>'
+'<line class="ax" x1="'+pl+'" y1="'+(base+.5)+'" x2="'+(W-pl)+'" y2="'+(base+.5)+'"/>'+ticks+'<g class="b0">'+bars+'</g><g class="b1" clip-path="url(#a5lit)">'+bars+'</g>'
+'<g class="ph"><line x1="0" x2="0" y1="'+(Hs+6)+'" y2="'+base+'"/><circle cx="0" cy="'+(Hs+6)+'" r="4.5"/></g></svg>';styles(cv);
var q=function(k){return cv.querySelector(k)},lvl=q(".lvl"),ru=q(".ru"),rl=q(".rl"),jet=q(".jet"),dn=q(".dn"),wire=q(".wire"),ph=q(".ph"),lit=q(".lit"),rd=q(".rd"),rc=q(".rc"),cls=q(".cls"),
rns=[].slice.call(cv.querySelectorAll(".rn")),kPrev=-1,zPrev=-1,sc=cv.firstChild.getBoundingClientRect().width/W||1;
ag.style.transform="translate("+f1((xd-17)*sc)+"px,"+f1((cy-6-38)*sc)+"px)";
function place(){var w=call.offsetWidth,lx=nar?clamp(xd*sc-w/2,4,W*sc-w-4):(xd+26)*sc;call.style.transform="translate("+f1(lx)+"px,"+f1(((nar?cy-6-74:cy-6-34))*sc)+"px)"}
return {draw:function(i){var k=C[i]?Math.max(1,Math.round(Math.pow(C[i]/maxC,.5)*K)):0,j,g=RL[i]/maxR;
lvl.style.transform="translateY("+f1(yl(S[i]))+"px)";ru.style.transform="translateY("+f1(yl(UP[i]))+"px)";rl.style.transform="translateY("+f1(yl(LO[i]))+"px)";
if(k!==kPrev){for(j=0;j<K;j++)rns[j].setAttribute("class",j<k?"rn on":"rn");kPrev=k;cls.style.opacity=f1(.35+.65*Math.min(1,k/(K*.5)))}
jet.style.strokeWidth=f1(g>.02?2+g*(nar?10:15):0);jet.style.opacity=g>.02?1:0;dn.style.transform="scaleY("+f1(.14+g*.86)+")";wire.setAttribute("class","wire"+(Z[i]===2?" on":""));
ph.style.transform="translateX("+f1(x(i))+"px)";lit.setAttribute("width",f1(x(i)+bw/2+.5));rd.textContent=date(i);rc.textContent=cnt(C[i]);
if(Z[i]!==zPrev){call.textContent=tx(CALL[Z[i]][0],CALL[Z[i]][1]);call.dataset.z=Z[i];zPrev=Z[i];place()}},
pick:function(px){return Math.round((px/sc-pl)/dx)},n:N,step:ST?0:56,pause:2400}}

/* ---------- the snake ---------- */
var nz=C.filter(function(c){return c>0}),Q=[qt(nz,.25),qt(nz,.5),qt(nz,.75)],LV=C.map(function(c){return c===0?0:c<=Q[0]?1:c<=Q[1]?2:c<=Q[2]?3:4}),
dow0=new Date(D[0][0]+"T12:00:00Z").getUTCDay(),nW=Math.ceil((N+dow0)/7);
function snake(el,W){var cv=el.querySelector(".a5c"),per=W>=900?nW:W>=520?Math.ceil(nW/2):Math.ceil(nW/3),nb=Math.ceil(nW/per),pitch=Math.min(28,Math.floor(W/per*10)/10),cs=pitch-(pitch<14?2:3),gapB=30,
top=88,ox=(W-per*pitch+pitch-cs)/2,rows=nb*7,H=top+rows*pitch+(nb-1)*gapB+44,pos=[],at={},i,s="",lab="",
X=function(c){return ox+c*pitch},Y=function(r){return top+r*pitch+Math.floor(r/7)*gapB};
for(i=0;i<N;i++){var w=Math.floor((i+dow0)/7),c=w%per,r=Math.floor(w/per)*7+(i+dow0)%7;pos.push([c,r]);at[c+","+r]=i;
s+='<rect class="c0" x="'+f1(X(c))+'" y="'+f1(Y(r))+'" width="'+f1(cs)+'" height="'+f1(cs)+'" rx="'+f1(cs*.24)+'"/>';
if(D[i][0].slice(8)==="01"){var m=+D[i][0].slice(5,7);lab+='<text class="ml" x="'+f1(X(c))+'" y="'+f1(Y(Math.floor(r/7)*7)-9)+'">'+mlab(m)+'</text>'}}
var cells="";for(i=0;i<N;i++)cells+='<rect class="c l'+LV[i]+'" data-i="'+i+'" x="'+f1(X(pos[i][0]))+'" y="'+f1(Y(pos[i][1]))+'" width="'+f1(cs)+'" height="'+f1(cs)+'" rx="'+f1(cs*.24)+'"/>';
var LB=5,body="",lg="",lx=W-ox-5*(cs+4)-(zh()?34:44);for(i=LB;i>=1;i--)body+='<rect class="sb" width="'+f1(cs)+'" height="'+f1(cs)+'" rx="'+f1(cs*.3)+'" data-st="opacity:'+f1(.9-i*.14)+'"/>';
for(i=0;i<5;i++)lg+='<rect class="c l'+i+' lg" x="'+f1(lx+i*(cs+4))+'" y="'+(H-30)+'" width="'+f1(cs)+'" height="'+f1(cs)+'" rx="'+f1(cs*.24)+'"/>';
cv.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+tx("One year of commits as a grid of days; a snake eats the faintest squares first","一年的 commit 格子，蛇從最淡的方塊開始吃")+'">'
+'<text class="rd" x="'+f1(ox)+'" y="26"></text><text class="rc" x="'+f1(ox)+'" y="46"></text>'+lab+s+cells
+'<text class="ml" text-anchor="end" x="'+f1(lx-8)+'" y="'+(H-30+cs*.78)+'">'+tx("Less","少")+'</text>'+lg+'<text class="ml" x="'+f1(lx+5*(cs+4)+4)+'" y="'+(H-30+cs*.78)+'">'+tx("More","多")+'</text>'
+'<g class="snk">'+body+'<g class="sh"><rect width="'+f1(cs)+'" height="'+f1(cs)+'" rx="'+f1(cs*.3)+'"/><circle cx="'+f1(cs*.32)+'" cy="'+f1(cs*.42)+'" r="'+f1(Math.max(1,cs*.09))+'"/><circle cx="'+f1(cs*.68)+'" cy="'+f1(cs*.42)+'" r="'+f1(Math.max(1,cs*.09))+'"/></g></g></svg>';styles(cv);
var q=function(k){return cv.querySelector(k)},rc=[].slice.call(cv.querySelectorAll(".c[data-i]")),lgs=[].slice.call(cv.querySelectorAll(".lg")),sb=[].slice.call(cv.querySelectorAll(".sb")),sh=q(".sh"),rd=q(".rd"),rct=q(".rc"),
eaten=[],left=0,head=[0,0],trail=[],target=-1,manual=-1,lvNow=0,sc=cv.firstChild.getBoundingClientRect().width/W||1;
function show(i){rd.textContent=date(i);rct.textContent=cnt(C[i])}
function put(){sh.setAttribute("transform","translate("+f1(X(head[0]))+" "+f1(Y(head[1]))+")");sb.forEach(function(b,k){var p=trail[trail.length-1-(LB-1-k)]||trail[0]||head;b.setAttribute("transform","translate("+f1(X(p[0]))+" "+f1(Y(p[1]))+")")})}
function reset(){eaten=C.map(function(){return false});left=nz.length;head=[0,0];trail=[];target=-1;manual=-1;rc.forEach(function(e,i){e.setAttribute("class","c l"+LV[i])});lvl(1);put();rd.textContent="";rct.textContent=""}
function lvl(v){lvNow=v;lgs.forEach(function(e,k){e.setAttribute("class","c l"+k+" lg"+(k===v?" cur":""))})}
function eat(i){if(eaten[i]||!C[i])return;eaten[i]=true;left--;rc[i].setAttribute("class","c l"+LV[i]+" eat");show(i)}
function next(){var v,best=-1,bd=1e9,i,d;for(v=1;v<=4&&best<0;v++){for(i=0;i<N;i++)if(!eaten[i]&&LV[i]===v){d=Math.abs(pos[i][0]-head[0])+Math.abs(pos[i][1]-head[1]);if(d<bd){bd=d;best=i}}if(best>=0)lvl(v)}return best}
function move(dc,dr){var c=head[0]+dc,r=head[1]+dr;if(c<0||c>=per||r<0||r>=rows)return false;trail.push(head.slice());if(trail.length>LB+1)trail.shift();head=[c,r];put();return true}
/* one step: walk toward the target, eat it on arrival; false when the grid is empty */
function step(){if(!left)return false;if(manual>=0&&(eaten[manual]||!C[manual]))manual=-1;if(manual>=0)target=manual;else if(target<0||eaten[target])target=next();if(target<0)return false;
var p=pos[target],dc=p[0]-head[0],dr=p[1]-head[1];if(dc)move(dc>0?1:-1,0);else if(dr)move(0,dr>0?1:-1);
if(head[0]===p[0]&&head[1]===p[1]){eat(target);target=-1;manual=-1}return true}
reset();
if(ST){var guard=0;while(left>nz.length*.42&&guard++<20000)step()}
return {step:step,reset:reset,sc:sc,hit:function(px,py){var c=Math.round((px/sc-ox-cs/2)/pitch),yy=py/sc-top,b=clamp(Math.floor(yy/(7*pitch+gapB)),0,nb-1),r=b*7+clamp(Math.round((yy-b*(7*pitch+gapB)-cs/2)/pitch),0,6),i=at[c+","+r];return i==null?-1:i},
show:show,go:function(i){if(i>=0&&C[i]&&!eaten[i]){manual=i;target=i}},key:function(dc,dr){if(move(dc,dr)){var i=at[head[0]+","+head[1]];target=-1;manual=-1;if(i!=null)eat(i)}},left:function(){return left},ms:pitch<14?26:30}}

/* ---------- controllers ---------- */
var ctls=[];
function panelOn(el){return el.classList.contains("on")}
/* dam: a clock over the days */
(function(){var el=host.querySelector('[data-a5="dam"]');if(!el)return;var stage=el.querySelector(".a5s"),PB=el.querySelector(".a5p"),api=null,i=ST?N-23:0,timer,playing=false,auto=!ST&&!RM,W0=0,drag=false;
function set(k){i=clamp(k,0,N-1);if(api)api.draw(i)}
function rebuild(){var W=Math.floor(stage.clientWidth);if(!W)return;W0=W;api=dam(el,W);api.draw(i)}
function tick(){timer=setTimeout(function(){if(i>=N-1){timer=setTimeout(function(){set(0);tick()},2400);return}set(i+1);tick()},56)}
function play(on){playing=on;clearTimeout(timer);PB.setAttribute("aria-pressed",on?"true":"false");if(on)tick()}
function user(){auto=false;play(false)}
function at(e){if(!api)return null;var b=stage.getBoundingClientRect();return api.pick(e.clientX-b.left)}
stage.addEventListener("pointerdown",function(e){if(e.target.closest(".a5p"))return;drag=true;user();var k=at(e);if(k!=null)set(k)});
addEventListener("pointerup",function(){drag=false});addEventListener("pointercancel",function(){drag=false});
stage.addEventListener("pointermove",function(e){if(!drag&&e.pointerType!=="mouse")return;if(playing)play(false);var k=at(e);if(k!=null)set(k)});
stage.addEventListener("pointerleave",function(){if(auto&&!playing&&panelOn(el))play(true)});
stage.addEventListener("keydown",function(e){var m={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7,PageUp:-30,PageDown:30,Home:-N,End:N}[e.key];if(!m)return;e.preventDefault();user();set(i+m)});
PB.addEventListener("click",function(){auto=false;if(!playing&&i>=N-1)set(0);play(!playing)});
if("IntersectionObserver" in window)new IntersectionObserver(function(es){if(es[0].isIntersecting){if(!api||Math.floor(stage.clientWidth)!==W0)rebuild();if(auto&&!playing&&panelOn(el))play(true)}else if(playing&&auto)play(false)},{threshold:.3}).observe(stage);
ctls.push({el:el,rebuild:rebuild,play:play,isAuto:function(){return auto},w:function(){return W0},stage:stage});rebuild()})();
/* snake: steps on its own; a click sends it somewhere, arrow keys steer it */
(function(){var el=host.querySelector('[data-a5="snake"]');if(!el)return;var stage=el.querySelector(".a5s"),PB=el.querySelector(".a5p"),api=null,timer,playing=false,auto=!ST&&!RM,W0=0,idle;
function rebuild(){var W=Math.floor(stage.clientWidth);if(!W)return;W0=W;api=snake(el,W)}
function tick(){timer=setTimeout(function(){if(!api)return;if(!api.step()){timer=setTimeout(function(){api.reset();tick()},2600);return}tick()},api?api.ms:30)}
function play(on){playing=on;clearTimeout(timer);PB.setAttribute("aria-pressed",on?"true":"false");if(on)tick()}
function pt(e){var b=stage.getBoundingClientRect();return api?api.hit(e.clientX-b.left,e.clientY-b.top):-1}
stage.addEventListener("pointermove",function(e){if(e.pointerType!=="mouse")return;var i=pt(e);if(i>=0)api.show(i)});
stage.addEventListener("pointerdown",function(e){if(e.target.closest(".a5p"))return;var i=pt(e);if(i<0)return;api.show(i);api.go(i);if(!playing){auto=true;play(true)}});
stage.addEventListener("keydown",function(e){var m={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!m||!api)return;e.preventDefault();play(false);api.key(m[0],m[1]);clearTimeout(idle);if(auto)idle=setTimeout(function(){if(panelOn(el))play(true)},2500)});
PB.addEventListener("click",function(){auto=!playing;clearTimeout(idle);play(!playing)});
if("IntersectionObserver" in window)new IntersectionObserver(function(es){if(es[0].isIntersecting){if(!api||Math.floor(stage.clientWidth)!==W0)rebuild();if(auto&&!playing&&panelOn(el))play(true)}else if(playing){play(false)}},{threshold:.3}).observe(stage);
ctls.push({el:el,rebuild:rebuild,play:play,isAuto:function(){return auto},w:function(){return W0},stage:stage});rebuild()})();

function refresh(force){ctls.forEach(function(c){var on=panelOn(c.el);if(!on){c.play(false);return}if(force||Math.floor(c.stage.clientWidth)!==c.w())c.rebuild()})}
var tb=doc.querySelector('.tabs[data-tabs="ac"]');if(tb)tb.addEventListener("pick",function(){setTimeout(function(){refresh(true);ctls.forEach(function(c){if(panelOn(c.el)&&c.isAuto())c.play(true)})},40)});
var rz;addEventListener("resize",function(){clearTimeout(rz);rz=setTimeout(function(){refresh(false)},160)});
}
})();
