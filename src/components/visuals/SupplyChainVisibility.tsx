const verticalStreets = [40, 112, 184, 256, 328, 400, 472, 544, 616];
const horizontalStreets = [32, 92, 152, 212, 258];

const lanes = [
  { name: 'CLE → YYZ', marks: [6, 34, 58, 100], reached: 58 },
  { name: 'HOU → ORD', marks: [22, 48, 74, 100], reached: 48 },
  { name: 'CMH → BNA', marks: [12, 30, 66, 100], reached: 30 },
];

export function SupplyChainVisibility() {
  return (
    <div className="visibility-schematic">
      <svg aria-hidden="true" className="schematic-map" viewBox="0 0 640 280">
        <title>Schematic route from origin through a transfer point to a destination</title>
        <rect className="schematic-paper" height="280" width="640" />
        <rect className="schematic-park" height="46" rx="6" width="78" x="28" y="24" />
        <rect className="schematic-park" height="52" rx="6" width="96" x="516" y="196" />
        <rect className="schematic-block" height="36" rx="3" width="48" x="128" y="48" />
        <rect className="schematic-block" height="36" rx="3" width="48" x="200" y="108" />
        <rect className="schematic-block" height="36" rx="3" width="48" x="344" y="48" />
        <rect className="schematic-block" height="36" rx="3" width="48" x="416" y="168" />
        <g className="schematic-streets">
          {verticalStreets.map((x) => <path d={`M${x} 12V268`} key={`v-${x}`} />)}
          {horizontalStreets.map((y) => <path d={`M12 ${y}H628`} key={`h-${y}`} />)}
        </g>
        <path className="schematic-done" d="M112 212V92H328V152H430" />
        <path className="schematic-ahead" d="M430 152H544V92" />
        <g className="schematic-stops">
          <circle cx="112" cy="212" r="8" />
          <circle cx="220" cy="92" r="5" />
          <circle cx="328" cy="92" r="7" />
          <circle cx="544" cy="92" r="8" />
        </g>
        <g className="schematic-vehicle">
          <rect height="18" rx="9" width="34" x="413" y="143" />
          <circle cx="424" cy="152" r="3" />
        </g>
      </svg>
      <div aria-hidden="true" className="schematic-board">
        <div className="schematic-scale">
          <span />
          <span className="schematic-hours">
            {['08:00', '10:00', '12:00', '14:00'].map((hour) => <span key={hour}>{hour}</span>)}
          </span>
        </div>
        <div className="schematic-lanes">
          <span className="schematic-now" />
          {lanes.map((lane) => (
            <div className="schematic-lane" key={lane.name}>
              <span>{lane.name}</span>
              <span className="schematic-track">
                {lane.marks.map((mark) => <i data-reached={mark <= lane.reached ? 'true' : 'false'} key={mark} style={{ left: `${mark}%` }} />)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
