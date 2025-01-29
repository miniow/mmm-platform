// src/components/tabs/PredictionTab.tsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Button,
  CardContent,
  Card,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { PredictionResponse } from "../../types";
import { useTranslation } from "react-i18next"; // ← import i18n hook

interface PredictionTabProps {
  modelId: string;
}

const PredictionTab: React.FC<PredictionTabProps> = ({ modelId }) => {
  const { t } = useTranslation(); // ← używamy hooka tłumaczeń

  const [predictions, setPredictions] = useState<number[]>([]);
  const [actual, setActual] = useState<number[]>([]);
  const [target, setTarget] = useState<string>("");
  const [mse, setMse] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Funkcja do wykonywania predykcji
  const executePrediction = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setPredictions([]);
    setActual([]);
    setMse(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/predict/${modelId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || t("predictionTab.predictionError"));
      }

      const data: PredictionResponse = await response.json();
      console.log("Received PredictionResponse:", data);

      setPredictions(data.predictions);
      setActual(data.actual);
      setTarget(data.target);
      setMse(data.mean_squared_error);
      setSuccessMessage(t("predictionTab.predictionSuccess"));
    } catch (err: any) {
      console.error("Prediction error:", err);
      setError(err.message || t("predictionTab.predictionError"));
    } finally {
      setLoading(false);
    }
  };

  const lineChartData = predictions.map((pred, index) => ({
    sample: index + 1,
    actual: actual[index],
    predicted: pred,
  }));

  const pieChartData = [
    { name: t("predictionTab.errorLabel"), value: mse || 0 },
    {
      name: t("predictionTab.accuracyLabel"),
      value: 100 - (mse || 0),
    },
  ];

  const COLORS = ["#FF8042", "#00C49F"];

  return (
    <>
      <Typography variant="h5" gutterBottom>
        {t("predictionTab.title")}
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={executePrediction}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            t("predictionTab.executeButton")
          )}
        </Button>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {mse !== null && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                {t("predictionTab.accuracyErrorTitle")}
              </Typography>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6">
                {t("predictionTab.actualVsPredictedTitle")}
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={lineChartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="sample"
                    label={{
                      value: t("predictionTab.weekLabel"),
                      position: "insideBottomRight",
                      offset: -2,
                      style: { fontSize: 18 },
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    label={{
                      value: t("predictionTab.valueLabel"),
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 18 },
                    }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#8884d8"
                    name={`${t("predictionTab.actual")} ${target}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#82ca9d"
                    name={`${t("predictionTab.predicted")} ${target}`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      )}

      {predictions.length > 0 && actual.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            {t("predictionTab.predictionResults")}
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            {t("predictionTab.targetColumn")}: {target}
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small" aria-label="predictions table">
              <TableHead>
                <TableRow>
                  <TableCell>{t("predictionTab.sample")}</TableCell>
                  <TableCell align="right">
                    {t("predictionTab.actual")} {target}
                  </TableCell>
                  <TableCell align="right">
                    {t("predictionTab.predicted")} {target}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {predictions.map((pred, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="right">
                      {actual[index].toFixed(4)}
                    </TableCell>
                    <TableCell align="right">{pred.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="subtitle1" gutterBottom>
            {t("predictionTab.mseLabel")}{" "}
            {mse !== null ? mse.toFixed(4) : "N/A"}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default PredictionTab;
