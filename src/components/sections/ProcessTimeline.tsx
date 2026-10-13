const steps = ['Understand', 'Design', 'Execute', 'Monitor', 'Optimize'];

export function ProcessTimeline() {
  return <ol className="process-timeline">{steps.map((step, index) => <li aria-label={`0${index + 1} ${step}`} key={step}><strong aria-hidden="true">0{index + 1}</strong><span>{step}</span></li>)}</ol>;
}
