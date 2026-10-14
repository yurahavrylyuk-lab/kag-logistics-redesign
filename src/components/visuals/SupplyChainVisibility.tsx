export function SupplyChainVisibility() {
  return (
    <svg aria-hidden="true" className="supply-scene" viewBox="0 0 640 420">
      <title>Freight moving from a container yard across a highway to a warehouse dock</title>
      <rect className="supply-sky" height="420" width="640" />
      <path className="supply-horizon" d="M0 248c80-28 140-8 220-22s150-6 220 16 140 8 200-10v18H0Z" />
      <path className="supply-ground" d="M0 250h640v170H0Z" />
      <path className="supply-road" d="M0 338h640" />
      <path className="supply-shoulder" d="M0 322h640M0 354h640" />
      <path className="supply-lane" d="M0 338h640" />

      <g className="supply-yard">
        <rect height="34" width="46" x="28" y="196" />
        <rect height="34" width="46" x="76" y="196" />
        <rect height="34" width="46" x="28" y="160" />
        <rect height="34" width="46" x="76" y="160" />
        <rect height="28" width="46" x="28" y="130" />
        <rect height="22" width="22" x="128" y="208" />
        <rect height="22" width="22" x="152" y="208" />
        <path d="M36 196v34M48 196v34M60 196v34M84 196v34M96 196v34M108 196v34M36 160v34M48 160v34M84 160v34M96 160v34" />
      </g>

      <g className="supply-warehouse">
        <path d="M438 146h168l22 26v96H438V146Z" />
        <path d="M454 214h26v54h-26zm36 0h26v54h-26zm36 0h26v54h-26zm36 0h26v54h-26z" />
        <path d="M438 186h190" />
        <path d="M454 268h18l-4 10h-10zm36 0h18l-4 10h-10zm36 0h18l-4 10h-10zm36 0h18l-4 10h-10z" />
      </g>

      <g className="supply-dock-truck">
        <rect height="28" rx="2" width="78" x="500" y="292" />
        <path d="M578 300h28l14 16v20h-42V300Z" />
        <circle cx="522" cy="326" r="8" />
        <circle cx="598" cy="326" r="8" />
      </g>

      <g className="supply-truck">
        <rect className="supply-trailer" height="40" rx="2" width="108" x="196" y="278" />
        <path className="supply-cab" d="M304 292h46l26 22v28h-72V292Z" />
        <path className="supply-window" d="M318 300h22l12 12h-34V300Z" />
        <g className="supply-wheels">
          <circle cx="226" cy="326" r="13" />
          <circle cx="274" cy="326" r="13" />
          <circle cx="348" cy="326" r="13" />
        </g>
        <g className="supply-hubs">
          <circle cx="226" cy="326" r="5" />
          <circle cx="274" cy="326" r="5" />
          <circle cx="348" cy="326" r="5" />
        </g>
      </g>

      <path className="supply-route" d="M62 118C150 70 230 168 318 112s130-24 250 18" />
      <g className="supply-pins">
        <circle cx="62" cy="118" r="8" />
        <circle cx="318" cy="112" r="8" />
        <circle cx="568" cy="130" r="8" />
      </g>
    </svg>
  );
}
