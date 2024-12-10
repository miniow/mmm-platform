// src/components/BarChartComponent.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type BarChartComponentProps = {
  data: any[];
  xKey: string;
  yKey: string;
  title: string;
};

const BarChartComponent: React.FC<BarChartComponentProps> = ({ data, xKey, yKey, title }) => {
  return (
    <div style={{ width: '100%', height: 300, marginBottom: '20px' }}>
      <h3>{title}</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={yKey} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
