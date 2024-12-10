// src/components/ScatterChartComponent.tsx
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type ScatterChartComponentProps = {
  data: any[];
  xKey: string;
  yKey: string;
  title: string;
};

const ScatterChartComponent: React.FC<ScatterChartComponentProps> = ({ data, xKey, yKey, title }) => {
  return (
    <div style={{ width: '100%', height: 300, marginBottom: '20px' }}>
      <h3>{title}</h3>
      <ResponsiveContainer>
        <ScatterChart>
          <XAxis type="number" dataKey={xKey} name={xKey} />
          <YAxis type="number" dataKey={yKey} name={yKey} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name={title} data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterChartComponent;
