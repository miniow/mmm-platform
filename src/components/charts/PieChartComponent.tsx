// src/components/PieChartComponent.tsx
import React from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

type PieChartComponentProps = {
  data: any[];
  dataKey: string;
  nameKey: string;
  title: string;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#33AA6A'];

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data, dataKey, nameKey, title }) => {
  return (
    <div style={{ width: '100%', height: 300, marginBottom: '20px' }}>
      <h3>{title}</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
