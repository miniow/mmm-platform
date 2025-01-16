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
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { PredictionResponse } from "../../types";

interface PredictionTabProps {
  modelId: string;
}

const PredictionTab: React.FC<PredictionTabProps> = ({ modelId }) => {
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
        body: JSON.stringify({}), // Wysyłamy pusty obiekt, ponieważ model_id jest w ścieżce
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Nie udało się wykonać predykcji.");
      }

      const data: PredictionResponse = await response.json();
      console.log("Received PredictionResponse:", data);

      setPredictions(data.predictions);
      setActual(data.actual);
      setTarget(data.target);
      setMse(data.mean_squared_error);
      setSuccessMessage("Predykcja została wykonana pomyślnie.");
    } catch (err: any) {
      console.error("Prediction error:", err);
      setError(err.message || "Nie udało się wykonać predykcji.");
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
    { name: "błąd", value: mse || 0 },
    { name: "dokładność", value: 100 - (mse || 0) },
  ];

  const COLORS = ["#FF8042", "#00C49F"];

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Predykcja
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={executePrediction}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Wykonaj Predykcję"}
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
              <Typography variant="h6">Dokładność i Błąd Modelu</Typography>
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
              <Typography variant="h6">Porównanie Wartości Rzeczywistych i Przewidywanych</Typography>
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
      value: "Tydzień",
      position: "insideBottomRight",
      offset: -2,
      style: { fontSize: 18 }, // Increase font size here
    }}
    tick={{ fontSize: 12 }} // Adjust font size for tick labels
  />
                  <YAxis
                    label={{
                      value: "Wartość",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 18 },
                    }}
                    tick={{ fontSize: 12 }} // Adjust font size for tick labels
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#8884d8"
                    
                    name={`Rzeczywiste ${target}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#82ca9d"
                    name={`Przewidywane ${target}`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Wyświetlanie wyników predykcji */}
      {predictions.length > 0 && actual.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Wyniki Predykcji
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Kolumna Docelowa: {target}
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small" aria-label="predictions table">
              <TableHead>
                <TableRow>
                  <TableCell>Próbka</TableCell>
                  <TableCell align="right">Rzeczywiste {target}</TableCell>
                  <TableCell align="right">Przewidywane {target}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {predictions.map((pred, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="right">{actual[index].toFixed(4)}</TableCell>
                    <TableCell align="right">{pred.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="subtitle1" gutterBottom>
            Średni błąd kwadratowy (MSE): {mse !== null ? mse.toFixed(4) : "N/A"}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default PredictionTab;