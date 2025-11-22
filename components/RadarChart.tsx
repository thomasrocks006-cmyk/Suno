import React from 'react';

interface RadarChartProps {
  data: { category: string; score: number }[];
  maxScore?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, maxScore = 10 }) => {
  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 40;
  const angleStep = (2 * Math.PI) / data.length;

  // Calculate points for the score polygon
  const scorePoints = data.map((item, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const distance = (item.score / maxScore) * radius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Calculate points for grid circles
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="relative w-full flex justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid circles */}
        {gridLevels.map((level, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius * level}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Grid lines from center to each category */}
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Score polygon */}
        <polygon
          points={scorePoints}
          fill="rgba(34, 211, 238, 0.2)"
          stroke="#22d3ee"
          strokeWidth="2"
          className="animate-fade-in"
        />

        {/* Score points */}
        {data.map((item, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const distance = (item.score / maxScore) * radius;
          const x = center + distance * Math.cos(angle);
          const y = center + distance * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#22d3ee"
              className="hover:r-6 transition-all cursor-pointer"
            >
              <title>{item.category}: {item.score}/{maxScore}</title>
            </circle>
          );
        })}

        {/* Category labels */}
        {data.map((item, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelDistance = radius + 25;
          const x = center + labelDistance * Math.cos(angle);
          const y = center + labelDistance * Math.sin(angle);
          
          return (
            <text
              key={i}
              x={x}
              y={y}
              fontSize="11"
              fontWeight="600"
              fill="#9ca3af"
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none select-none"
            >
              {item.category.split(' ').map((word, wi) => (
                <tspan key={wi} x={x} dy={wi === 0 ? 0 : 12}>
                  {word}
                </tspan>
              ))}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
