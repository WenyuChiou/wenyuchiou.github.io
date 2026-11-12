/* experience timeline: pick a stop, arrow keys walk the stops in time order */
(function(){var tl=document.getElementById("tl");if(!tl)return;var bs=[].slice.call(tl.querySelectorAll(".ti")),ps=[].slice.call(document.querySelectorAll("[data-td]")),
o=bs.slice().sort(function(a,b){return a.dataset.o-b.dataset.o});
function pick(b){bs.forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});ps.forEach(function(p){p.classList.toggle("on",p.dataset.td===b.dataset.k)})}
bs.forEach(function(b){b.addEventListener("click",function(){pick(b)})});
tl.addEventListener("keydown",function(e){var i=o.indexOf(document.activeElement);if(i<0||(e.key!=="ArrowRight"&&e.key!=="ArrowLeft"))return;e.preventDefault();var n=o[Math.max(0,Math.min(o.length-1,i+(e.key==="ArrowRight"?1:-1)))];n.focus();pick(n)});
})();
