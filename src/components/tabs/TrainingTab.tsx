// src/components/tabs/TrainingTab.tsx

import React from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { ModelResult } from "../../types";

interface TrainingTabProps {
  modelId: string;
  availableColumns: string[];
  modelDetails: ModelResult;
}

const TrainingTab: React.FC<TrainingTabProps> = ({ modelId, availableColumns, modelDetails }) => {
  const [targetColumn, setTargetColumn] = React.useState<string>(modelDetails.target_column || "");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const isTrained = !!modelDetails.target_column;

  const handleTrainModel = async () => {
    if (!targetColumn) {
      setError("Proszę wybrać kolumnę docelową.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/train_model/${modelId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ target_column: targetColumn }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Nie udało się wytrenować modelu.");
      }

      const data: ModelResult = await response.json();
      console.log("Received trained modelDetails:", data); // Logowanie danych
      setSuccessMessage("Model został pomyślnie wytrenowany.");
      // Możesz zaktualizować parent komponent poprzez callback lub inne mechanizmy
    } catch (err: any) {
      console.error("Failed to train model:", err);
      setError(err.message || "Nie udało się wytrenować modelu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Trenowanie Modelu
      </Typography>
      <Typography sx={{ mb: 2 }}>
        {isTrained
          ? "Model został już wytrenowany. Szczegóły poniżej."
          : "Wybierz kolumnę, którą chcesz przewidzieć, a następnie kliknij 'Trenuj Model'."}
      </Typography>

      {/* Formularz do trenowania modelu */}
      {!isTrained && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
          <FormControl fullWidth>
            <InputLabel id="target-column-label">Kolumna docelowa</InputLabel>
            <Select
              labelId="target-column-label"
              id="target-column-select"
              value={targetColumn}
              label="Kolumna docelowa"
              onChange={(e) => setTargetColumn(e.target.value as string)}
            >
              {availableColumns.map((col) => (
                <MenuItem key={col} value={col}>
                  {col}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleTrainModel}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Trenuj Model"}
          </Button>
        </Box>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Wyświetlanie szczegółów modelu po wytrenowaniu */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Szczegóły Modelu
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Typ Modelu: {modelDetails.model_type}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Kolumna Docelowa: {modelDetails.target_column || "N/A"}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Współczynniki:
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table size="small" aria-label="coefficients table">
            <TableHead>
              <TableRow>
                <TableCell>Cechy</TableCell>
                <TableCell align="right">Wartość</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {modelDetails.coefficients && Object.keys(modelDetails.coefficients).length > 0 ? (
                Object.entries(modelDetails.coefficients).map(([feature, value]) => (
                  <TableRow key={feature}>
                    <TableCell component="th" scope="row">
                      {feature}
                    </TableCell>
                    <TableCell align="right">
                      {typeof value === "number" ? value.toFixed(4) : "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    Brak współczynników.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="subtitle1" gutterBottom>
          Przechwytywanie (Intercept):{" "}
          {typeof modelDetails.intercept === "number" ? modelDetails.intercept.toFixed(4) : "N/A"}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Współczynnik determinacji (R² Score):{" "}
          {typeof modelDetails.score === "number" ? modelDetails.score.toFixed(4) : "N/A"}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Średni błąd kwadratowy (MSE):{" "}
          {typeof modelDetails.mse === "number" ? modelDetails.mse.toFixed(4) : "N/A"}
        </Typography>

        {modelDetails.model_type === "adstock" && modelDetails.adstock_params && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Parametry Adstock:
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="adstock parameters table">
                <TableHead>
                  <TableRow>
                    <TableCell>Cechy</TableCell>
                    <TableCell align="right">Alpha</TableCell>
                    <TableCell align="right">Beta</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modelDetails.adstock_params && Object.keys(modelDetails.adstock_params).length > 0 ? (
                    Object.entries(modelDetails.adstock_params).map(([feature, params]) => (
                      <TableRow key={feature}>
                        <TableCell component="th" scope="row">
                          {feature}
                        </TableCell>
                        <TableCell align="right">
                          {typeof params[0] === "number" ? params[0].toFixed(4) : "N/A"}
                        </TableCell>
                        <TableCell align="right">
                          {typeof params[1] === "number" ? params[1].toFixed(4) : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Brak parametrów Adstock.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </>
  );
};

export default TrainingTab;
