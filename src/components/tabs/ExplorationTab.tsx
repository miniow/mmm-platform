// src/components/ExplorationTab.tsx

import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { computePowerTrend } from "../../utils/computePowerTrend";
import { generateTrendLine } from "../../utils/generateTrendLine";
import { useTranslation } from "react-i18next";  // 1) Import hooka i18n

interface ExplorationTabProps {
  warehouseData: any[];
}

const ExplorationTab: React.FC<ExplorationTabProps> = ({ warehouseData }) => {
  // 2) Używamy hooka
  const { t } = useTranslation();

  // Prepare data for charts
  const processedWarehouseData = warehouseData.map((item: any) => ({
    id: item.Id,
    FB: Number(item.FB),
    TV: Number(item.TV),
    Radio: Number(item.Radio),
    Sales: Number(item.Sales),
  }));

  // Expenditure data
  const spendData = processedWarehouseData.map((item) => ({
    id: item.id,
    FB: item.FB,
    TV: item.TV,
    Radio: item.Radio,
  }));

  // Sales trend data
  const salesTrendData = processedWarehouseData.map((item) => ({
    id: item.id,
    sales: item.Sales,
  }));

  // Prepare data for Sales vs Expenditure charts
  const fbData = processedWarehouseData.map((item) => ({
    x: item.FB,
    y: item.Sales,
  }));

  const tvData = processedWarehouseData.map((item) => ({
    x: item.TV,
    y: item.Sales,
  }));

  const radioData = processedWarehouseData.map((item) => ({
    x: item.Radio,
    y: item.Sales,
  }));

  // Compute trend lines and R²
  const fbTrend = computePowerTrend(
    fbData.map((d) => d.x),
    fbData.map((d) => d.y)
  );
  const tvTrend = computePowerTrend(
    tvData.map((d) => d.x),
    tvData.map((d) => d.y)
  );
  const radioTrend = computePowerTrend(
    radioData.map((d) => d.x),
    radioData.map((d) => d.y)
  );

  // Generate trend line data
  const fbTrendLine =
    fbTrend &&
    generateTrendLine(
      fbTrend.a,
      fbTrend.b,
      Math.min(...fbData.map((d) => d.x)),
      Math.max(...fbData.map((d) => d.x))
    )
      .map((point) => ({
        x: point.x,
        y: point.y,
      }))
      .sort((a, b) => a.x - b.x);

  const tvTrendLine =
    tvTrend &&
    generateTrendLine(
      tvTrend.a,
      tvTrend.b,
      Math.min(...tvData.map((d) => d.x)),
      Math.max(...tvData.map((d) => d.x))
    )
      .map((point) => ({
        x: point.x,
        y: point.y,
      }))
      .sort((a, b) => a.x - b.x);

  const radioTrendLine =
    radioTrend &&
    generateTrendLine(
      radioTrend.a,
      radioTrend.b,
      Math.min(...radioData.map((d) => d.x)),
      Math.max(...radioData.map((d) => d.x))
    )
      .map((point) => ({
        x: point.x,
        y: point.y,
      }))
      .sort((a, b) => a.x - b.x);

  return (
    <Box sx={{ padding: 4 }}>
      {/* Tabela */}
        {/* Wykresy */}
        <Grid container spacing={4} sx={{ mt: 5 }}>
        {/* Spend Line Chart */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            {t("explorationTab.spendChartTitle")}
          </Typography>
          {spendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={spendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="id"
                  label={{
                    value: t("explorationTab.weekLabel"),
                    position: "insideBottomRight",
                    offset: 0,
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="FB"
                  stroke="#8884d8"
                  name={t("explorationTab.facebookSpend")}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="TV"
                  stroke="#82ca9d"
                  name={t("explorationTab.tvSpend")}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Radio"
                  stroke="#ffc658"
                  name={t("explorationTab.radioSpend")}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography sx={{ mt: 2 }}>
              {t("explorationTab.noSpendData")}
            </Typography>
          )}
        </Grid>

        {/* Sales Trend Line Chart */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            {t("explorationTab.salesChartTitle")}
          </Typography>
          {salesTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="id"
                  label={{
                    value: t("explorationTab.weekLabel"),
                    position: "insideBottomRight",
                    offset: 0,
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#ff7300"
                  name={t("explorationTab.salesLine")}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Typography sx={{ mt: 2 }}>
              {t("explorationTab.noSalesData")}
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Sales vs Expenditure with Power Trend Lines */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          {t("explorationTab.salesVsExpenditure")}
        </Typography>
        <Grid container spacing={4}>
          {/* Facebook Spend */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              {t("explorationTab.facebookVsSales")}
            </Typography>
            {fbData.length > 0 && fbTrendLine && fbTrend ? (
              <Box position="relative">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={fbTrendLine}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name={t("explorationTab.facebookSpend")}
                      label={{
                        value: t("explorationTab.facebookSpend"),
                        position: "insideBottomRight",
                        offset: -5,
                      }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name={t("explorationTab.sales")}
                      label={{
                        value: t("explorationTab.sales"),
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Legend />
                    <Scatter
                      name={t("explorationTab.scatterData")}
                      data={fbData}
                      fill="#8884d8"
                    />
                    {/* Trend Line */}
                    <Line
                      type="linear"
                      dataKey="y"
                      stroke="#ff0000"
                      dot={false}
                      name={t("explorationTab.trendLine")}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
                {/* Display R² */}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  R²: {fbTrend.rSquared.toFixed(4)}
                </Typography>
              </Box>
            ) : (
              <Typography sx={{ mt: 2 }}>
                {t("explorationTab.noFacebookChart")}
              </Typography>
            )}
          </Grid>

          {/* TV Spend */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              {t("explorationTab.tvVsSales")}
            </Typography>
            {tvData.length > 0 && tvTrendLine && tvTrend ? (
              <Box position="relative">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={tvTrendLine}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name={t("explorationTab.tvSpend")}
                      label={{
                        value: t("explorationTab.tvSpend"),
                        position: "insideBottomRight",
                        offset: -5,
                      }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name={t("explorationTab.sales")}
                      label={{
                        value: t("explorationTab.sales"),
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Legend />
                    <Scatter
                      name={t("explorationTab.scatterData")}
                      data={tvData}
                      fill="#82ca9d"
                    />
                    {/* Trend Line */}
                    <Line
                      type="linear"
                      dataKey="y"
                      stroke="#ff0000"
                      dot={false}
                      name={t("explorationTab.trendLine")}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
                {/* Display R² */}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  R²: {tvTrend.rSquared.toFixed(4)}
                </Typography>
              </Box>
            ) : (
              <Typography sx={{ mt: 2 }}>
                {t("explorationTab.noTvChart")}
              </Typography>
            )}
          </Grid>

          {/* Radio Spend */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              {t("explorationTab.radioVsSales")}
            </Typography>
            {radioData.length > 0 && radioTrendLine && radioTrend ? (
              <Box position="relative">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={radioTrendLine}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name={t("explorationTab.radioSpend")}
                      label={{
                        value: t("explorationTab.radioSpend"),
                        position: "insideBottomRight",
                        offset: -5,
                      }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name={t("explorationTab.sales")}
                      label={{
                        value: t("explorationTab.sales"),
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Legend />
                    <Scatter
                      name={t("explorationTab.scatterData")}
                      data={radioData}
                      fill="#ffc658"
                    />
                    {/* Trend Line */}
                    <Line
                      type="linear"
                      dataKey="y"
                      stroke="#ff0000"
                      dot={false}
                      name={t("explorationTab.trendLine")}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
                {/* Display R² */}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  R²: {radioTrend.rSquared.toFixed(4)}
                </Typography>
              </Box>
            ) : (
              <Typography sx={{ mt: 2 }}>
                {t("explorationTab.noRadioChart")}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
      <Typography variant="h5" gutterBottom>
        {t("explorationTab.tableTitle")}
      </Typography>
      {warehouseData.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(warehouseData[0]).map((key) => (
                <TableCell key={key}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouseData.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((value, idx) => (
                  <TableCell key={idx}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography sx={{ mt: 2 }}>
          {t("explorationTab.noData")}
        </Typography>
      )}

    
    </Box>
  );
};

export default ExplorationTab;
