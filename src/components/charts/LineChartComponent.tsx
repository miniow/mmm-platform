// src/components/charts/LineChartComponent.tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface LineChartComponentProps {
  data: any[];
  xKey: string;
  yKey?: string; // Optional for single-line charts
  lines?: { key: string; color: string; label: string }[]; // Add this for multi-line support
  title?: string;
  xLabel?: string;
  yLabel?: string;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({
  data,
  xKey,
  yKey,
  lines,
  title,
  xLabel,
  yLabel,
}) => {
  console.log('LineChartComponent props:', { data, xKey, yKey, lines, title, xLabel, yLabel });
  
  return (
    <div style={{ width: '100%', height: '300px' }}> {/* Ustalona wysokość */}
      <h3>{title}</h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} label={{ value: xLabel, position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: yLabel, angle: -90, position: 'insideLeft' }} domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          {lines
            ? lines.map((line) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  stroke={line.color}
                  name={line.label}
                />
              ))
            : yKey && (
                <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
              )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};


export default LineChartComponent;

