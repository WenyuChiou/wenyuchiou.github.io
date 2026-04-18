// SVG cover illustrations for projects & blog
const Covers = {
  wagf: (
    <svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(0.62 0.1 75)"/>
          <stop offset="1" stopColor="oklch(0.52 0.13 45)"/>
        </linearGradient>
        <pattern id="wgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="oklch(0.3 0.02 50 / 0.15)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="400" height="225" fill="url(#wg1)"/>
      <rect width="400" height="225" fill="url(#wgrid)"/>
      {/* Network of agents */}
      {Array.from({length: 14}).map((_,i) => {
        const cx = 50 + (i%5)*70 + (Math.floor(i/5)%2)*35;
        const cy = 60 + Math.floor(i/5)*55;
        return <g key={i}>
          <circle cx={cx} cy={cy} r="10" fill="oklch(0.98 0.01 80 / 0.9)" stroke="oklch(0.25 0.04 50)" strokeWidth="1.2"/>
          <circle cx={cx} cy={cy} r="3" fill="oklch(0.25 0.04 50)"/>
        </g>;
      })}
      {Array.from({length: 10}).map((_,i) => {
        const x1 = 50 + (i%5)*70 + 30;
        const y1 = 60 + Math.floor(i/5)*55;
        return <line key={'l'+i} x1={x1} y1={y1} x2={x1+35} y2={y1+55} stroke="oklch(0.25 0.04 50 / 0.5)" strokeWidth="1" strokeDasharray="3 3"/>;
      })}
      <text x="20" y="210" fontFamily="ui-monospace" fontSize="10" fill="oklch(0.25 0.04 50)" opacity="0.7">{"// agents × bounded rationality"}</text>
    </svg>
  ),
  zotero: (
    <svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="225" fill="oklch(0.9 0.03 60)"/>
      {/* stacked papers */}
      {[0,1,2,3,4].map(i => (
        <g key={i} transform={`translate(${80+i*10}, ${40+i*12}) rotate(${-3+i*1.5})`}>
          <rect width="200" height="130" rx="4" fill="oklch(0.97 0.015 80)" stroke="oklch(0.25 0.04 50)" strokeWidth="1"/>
          <rect x="18" y="20" width="140" height="4" fill="oklch(0.25 0.04 50 / 0.5)"/>
          <rect x="18" y="32" width="100" height="3" fill="oklch(0.25 0.04 50 / 0.3)"/>
          <rect x="18" y="50" width="160" height="2" fill="oklch(0.25 0.04 50 / 0.2)"/>
          <rect x="18" y="58" width="160" height="2" fill="oklch(0.25 0.04 50 / 0.2)"/>
          <rect x="18" y="66" width="120" height="2" fill="oklch(0.25 0.04 50 / 0.2)"/>
        </g>
      ))}
      <circle cx="320" cy="80" r="34" fill="oklch(0.52 0.13 45)"/>
      <text x="320" y="88" textAnchor="middle" fontFamily="serif" fontSize="28" fill="oklch(0.98 0.01 80)">AI</text>
      <path d="M286 90 Q 270 110 250 115" stroke="oklch(0.52 0.13 45)" strokeWidth="1.5" fill="none" strokeDasharray="3 3"/>
    </svg>
  ),
  codex: (
    <svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="225" fill="oklch(0.22 0.02 60)"/>
      <g fontFamily="ui-monospace" fontSize="11" fill="oklch(0.85 0.04 70)">
        <text x="24" y="40">{"$ agent.delegate({"}</text>
        <text x="40" y="58"><tspan fill="oklch(0.7 0.12 60)">task</tspan>: "refactor api",</text>
        <text x="40" y="76"><tspan fill="oklch(0.7 0.12 60)">budget</tspan>: 4000,</text>
        <text x="40" y="94"><tspan fill="oklch(0.7 0.12 60)">contract</tspan>: schema,</text>
        <text x="24" y="112">{"})"}</text>
        <text x="24" y="140" fill="oklch(0.7 0.14 150)">→ spawned child agent #4af</text>
        <text x="24" y="156" fill="oklch(0.7 0.14 150)">→ 3 tools, 1 contract</text>
        <text x="24" y="184" fill="oklch(0.6 0.02 70)">▊</text>
      </g>
      <circle cx="360" cy="30" r="6" fill="oklch(0.72 0.13 55)"/>
    </svg>
  ),
  agentic: (
    <svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ag-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(0.96 0.02 80)"/>
          <stop offset="1" stopColor="oklch(0.9 0.04 60)"/>
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill="url(#ag-bg)"/>
      {/* connecting lines — mesh of skills */}
      <g stroke="oklch(0.52 0.13 45 / 0.35)" strokeWidth="1.2" fill="none">
        <path d="M80 60 Q 200 90 320 60"/>
        <path d="M80 60 L 200 160"/>
        <path d="M320 60 L 200 160"/>
        <path d="M80 60 L 320 165"/>
        <path d="M80 165 L 320 60"/>
        <path d="M200 160 L 320 165"/>
        <path d="M80 165 L 200 160"/>
      </g>
      {/* skill nodes as labeled chips */}
      <g fontFamily="ui-monospace" fontSize="11" fill="oklch(0.3 0.04 50)">
        <g transform="translate(40,44)">
          <rect width="90" height="32" rx="6" fill="oklch(0.98 0.01 80)" stroke="oklch(0.52 0.13 45)" strokeWidth="1.2"/>
          <text x="45" y="21" textAnchor="middle">research-hub</text>
        </g>
        <g transform="translate(280,44)">
          <rect width="90" height="32" rx="6" fill="oklch(0.98 0.01 80)" stroke="oklch(0.52 0.13 45)" strokeWidth="1.2"/>
          <text x="45" y="21" textAnchor="middle">zotero-skills</text>
        </g>
        <g transform="translate(160,144)">
          <rect width="90" height="32" rx="6" fill="oklch(0.52 0.13 45)" stroke="oklch(0.52 0.13 45)"/>
          <text x="45" y="21" textAnchor="middle" fill="oklch(0.98 0.01 80)">codex-delegate</text>
        </g>
        <g transform="translate(40,149)">
          <rect width="90" height="32" rx="6" fill="oklch(0.98 0.01 80)" stroke="oklch(0.52 0.13 45)" strokeWidth="1.2"/>
          <text x="45" y="21" textAnchor="middle">gemini-cli</text>
        </g>
        <g transform="translate(280,149)">
          <rect width="90" height="32" rx="6" fill="oklch(0.98 0.01 80)" stroke="oklch(0.52 0.13 45)" strokeWidth="1.2"/>
          <text x="45" y="21" textAnchor="middle">mcp-tools</text>
        </g>
      </g>
      <text x="20" y="210" fontFamily="serif" fontStyle="italic" fontSize="12" fill="oklch(0.4 0.02 50)">composable skills · a researcher&apos;s AI-native toolkit</text>
    </svg>
  ),
  flood: (
    <svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fl1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.9 0.04 80)"/>
          <stop offset="1" stopColor="oklch(0.55 0.1 240)"/>
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill="url(#fl1)"/>
      {/* city silhouette */}
      <g fill="oklch(0.25 0.04 50)">
        {[40,80,130,170,210,260,310,360].map((x,i)=>{
          const h = 60 + (i*13)%70;
          return <rect key={i} x={x} y={225-h-50} width="28" height={h}/>;
        })}
      </g>
      {/* water lines */}
      {[0,1,2,3].map(i => (
        <path key={i} d={`M0 ${170+i*10} Q 100 ${165+i*10} 200 ${170+i*10} T 400 ${170+i*10}`} stroke="oklch(0.55 0.1 240)" strokeWidth="2" fill="none" opacity={0.7-i*0.15}/>
      ))}
      {/* agent dots */}
      {[90,150,230,290,340].map((x,i) => (
        <g key={i}><circle cx={x} cy={165} r="5" fill="oklch(0.52 0.13 45)"/><circle cx={x} cy={165} r="2" fill="oklch(0.98 0.01 80)"/></g>
      ))}
    </svg>
  ),
  essay1: (
    <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" fill="oklch(0.93 0.03 75)"/>
      <text x="20" y="50" fontFamily="serif" fontStyle="italic" fontSize="26" fill="oklch(0.25 0.04 50)">bounded</text>
      <text x="20" y="82" fontFamily="serif" fontStyle="italic" fontSize="26" fill="oklch(0.52 0.13 45)">rationality</text>
      <text x="20" y="114" fontFamily="serif" fontSize="14" fill="oklch(0.38 0.02 50)">= f(prompt, noise)</text>
      <line x1="20" y1="155" x2="280" y2="155" stroke="oklch(0.25 0.04 50 / 0.3)" strokeWidth="1"/>
      <text x="20" y="175" fontFamily="ui-monospace" fontSize="10" fill="oklch(0.38 0.02 50)">essay · reasoning</text>
    </svg>
  ),
  essay2: (
    <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" fill="oklch(0.88 0.04 60)"/>
      {/* two interlocking circles */}
      <circle cx="120" cy="100" r="55" fill="none" stroke="oklch(0.52 0.13 45)" strokeWidth="2"/>
      <circle cx="180" cy="100" r="55" fill="none" stroke="oklch(0.25 0.04 50)" strokeWidth="2"/>
      <text x="90" y="104" fontFamily="serif" fontSize="14" fill="oklch(0.52 0.13 45)">hazard</text>
      <text x="178" y="104" fontFamily="serif" fontSize="14" fill="oklch(0.25 0.04 50)">agents</text>
      <text x="150" y="180" textAnchor="middle" fontFamily="ui-monospace" fontSize="10" fill="oklch(0.38 0.02 50)">coupling, in practice</text>
    </svg>
  ),
  essay3: (
    <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" fill="oklch(0.2 0.015 60)"/>
      {[0,1,2].map(i => (
        <g key={i} transform={`translate(${40+i*80}, ${60})`}>
          <rect width="60" height="80" rx="8" fill="oklch(0.3 0.02 60)" stroke="oklch(0.72 0.13 55)" strokeWidth="1"/>
          <circle cx="30" cy="30" r="10" fill="oklch(0.72 0.13 55)"/>
          <rect x="14" y="50" width="32" height="3" fill="oklch(0.72 0.13 55 / 0.5)"/>
          <rect x="14" y="58" width="22" height="3" fill="oklch(0.72 0.13 55 / 0.3)"/>
        </g>
      ))}
      <text x="150" y="170" textAnchor="middle" fontFamily="ui-monospace" fontSize="11" fill="oklch(0.78 0.1 80)">three small agents</text>
    </svg>
  ),
};
window.Covers = Covers;
