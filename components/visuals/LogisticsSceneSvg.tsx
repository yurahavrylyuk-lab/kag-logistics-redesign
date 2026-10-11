export function LogisticsSceneSvg({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <svg aria-label="Logistics network from origin to destination" className={reducedMotion ? 'logistics-scene is-static' : 'logistics-scene'} role="img" viewBox="0 0 760 520">
      <title>Illustrative logistics network from terminal to warehouse destination</title>
      <rect className="scene-ground" height="520" rx="24" width="760" />
      <path className="scene-road" d="M0 398C160 310 200 445 365 342S570 258 760 166" />
      <g className="scene-terminal"><path d="M88 316 173 269l85 47-85 47-85-47Z" /><path d="M88 316v74l85 47v-74l-85-47Zm170 0v74l-85 47v-74l85-47Z" /><text x="126" y="470">Terminal</text></g>
      <g className="scene-warehouse"><path d="m470 266 100-60 100 60v113H470V266Z" /><path d="M495 282h150v25H495zM495 324h65v55h-65zm84 0h66v55h-66z" /><text x="518" y="420">Warehouse</text></g>
      <g className="scene-rail"><path d="M346 118h195M346 142h195M374 94v72m42-72v72m42-72v72m42-72v72" /><rect height="28" rx="4" width="88" x="384" y="101" /></g>
      <path className="scene-route" d="M173 316C290 392 396 350 520 292S648 225 698 181" />
      {[[173, 316], [520, 292], [698, 181]].map(([cx, cy]) => <circle aria-label="Route node" className="route-node" cx={cx} cy={cy} key={`${cx}-${cy}`} r="12" />)}
    </svg>
  );
}
