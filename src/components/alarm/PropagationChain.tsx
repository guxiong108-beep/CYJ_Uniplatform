import type { PropagationNode } from "../../types";

export function PropagationChain({ nodes }: { nodes: PropagationNode[] }) {
  return (
    <div className="chain" role="img" aria-label="告警传播链路">
      <svg viewBox="0 0 760 140" preserveAspectRatio="none">
        <line x1="52" y1="64" x2="708" y2="64" className="chain-line" />
        {nodes.map((node, index) => {
          const x = 64 + index * (640 / Math.max(1, nodes.length - 1));
          return (
            <g key={node.id}>
              {index > 0 && <text x={x - 70} y="50" className="chain-delta">{node.delta}</text>}
              <circle cx={x} cy="64" r="16" className={`chain-node chain-${node.type}`} />
              <text x={x} y="101" textAnchor="middle" className="chain-title">{node.deviceName}</text>
              <text x={x} y="119" textAnchor="middle" className="chain-subtitle">{node.alarm}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
