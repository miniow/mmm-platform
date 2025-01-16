import React from 'react';
import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import * as ss from 'simple-statistics'; // Biblioteka do obliczeń statystycznych

interface ScatterPlotWithTrendlineProps {
  data: { x: number; y: number }[]; // Format danych: {x: wartość, y: sprzedaż}
  title: string;
  xLabel: string;
  yLabel: string;
}

const ScatterPlotWithTrendline: React.FC<ScatterPlotWithTrendlineProps> = ({
  data,
  title,
  xLabel,
  yLabel,
}) => {
  // Filtruj dane, aby usunąć punkty z x <= 0 lub y <= 0 (logarytmy wymagają dodatnich wartości)
  const filteredData = data.filter((d) => d.x > 0 && d.y > 0);
  if (filteredData.length !== data.length) {
    console.warn('Niektóre punkty danych z x <= 0 lub y <= 0 zostały wykluczone z trendu.');
  }

  // Wyodrębnij logarytmy x i y dla regresji potęgowej
  const logX = filteredData.map((d) => Math.log(d.x));
  const logY = filteredData.map((d) => Math.log(d.y));

  // Oblicz współczynnik korelacji
  const correlation = ss.sampleCorrelation(logX, logY)?.toFixed(2) || 'N/A';

  // Przygotuj pary danych do regresji liniowej na log(y) vs log(x)
  const dataPairsLog: [number, number][] = filteredData.map((d) => [Math.log(d.x), Math.log(d.y)]);

  // Oblicz regresję liniową na danych przetransformowanych
  const regressionLog = ss.linearRegression(dataPairsLog);
  // const linearLog = ss.linearRegressionLine(regressionLog);

  // Wyznacz parametry modelu potęgowego
  const lnA = regressionLog.b; // Wyraz wolny
  const b = regressionLog.m;   // Nachylenie
  const a = Math.exp(lnA);

  // Generuj dane trendu na podstawie modelu potęgowego
  // Aby linia trendu była płynna, warto posortować dane według x
  const sortedData = [...data].sort((a, b) => a.x - b.x);
  const trendLine = sortedData.map((d) => ({
    x: d.x,
    y: a * Math.pow(d.x, b),
  }));

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <h3>
        {title} (r = {correlation})
      </h3>
      <ResponsiveContainer>
        <ComposedChart>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis
            dataKey="x"
            name={xLabel}
            label={{ value: xLabel, position: 'insideBottom', offset: -5 }}
            type="number"
            domain={['auto', 'auto']}
          />
          <YAxis
            dataKey="y"
            name={yLabel}
            label={{ value: yLabel, angle: -90, position: 'insideLeft', offset: 10 }}
            type="number"
            domain={['auto', 'auto']}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="Punkty danych" data={data} fill="#8884d8" />
          {/* Dodanie potęgowej linii trendu */}
          <Line
            type="monotone"
            data={trendLine}
            dataKey="y"
            stroke="#ff7300"
            name="Trend Line r^2"
            dot={false}
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlotWithTrendline;
