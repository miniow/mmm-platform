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
import { useTranslation } from "react-i18next";

interface TrainingTabProps {
  modelId: string;
  availableColumns: string[];
  modelDetails: ModelResult;
  onModelTrained: () => void; // Dodany callback
}

const TrainingTab: React.FC<TrainingTabProps> = ({
  modelId,
  availableColumns,
  modelDetails,
  onModelTrained, // Odbiór callbacku
}) => {
  const { t } = useTranslation();

  const [targetColumn, setTargetColumn] = React.useState<string>(
    modelDetails.target_column || ""
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const isTrained = !!modelDetails.target_column;

  const handleTrainModel = async () => {
    if (!targetColumn) {
      setError(t("trainingTab.errorNoTargetColumn") || "");
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
        throw new Error(errorData.detail || t("trainingTab.errorTrainFail"));
      }

      const data: ModelResult = await response.json();
      console.log("Received trained modelDetails:", data);
      setSuccessMessage(t("trainingTab.successTrain"));
      onModelTrained(); // Wywołanie callbacku
    } catch (err: any) {
      console.error("Failed to train model:", err);
      setError(err.message || t("trainingTab.errorTrainFail"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        {t("trainingTab.title")}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        {isTrained
          ? t("trainingTab.alreadyTrained")
          : t("trainingTab.chooseTargetInstruction")}
      </Typography>

      {/* Formularz do trenowania modelu */}
      {!isTrained && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
          <FormControl fullWidth>
            <InputLabel id="target-column-label">
              {t("trainingTab.targetColumnLabel")}
            </InputLabel>
            <Select
              labelId="target-column-label"
              id="target-column-select"
              value={targetColumn}
              label={t("trainingTab.targetColumnLabel")}
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
            {loading ? <CircularProgress size={24} /> : t("trainingTab.trainButton")}
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
          {t("trainingTab.modelDetailsTitle")}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          {t("trainingTab.modelType")}: {modelDetails.model_type}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          {t("trainingTab.targetColumn")}: {modelDetails.target_column || "N/A"}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          {t("trainingTab.coefficientsLabel")}:
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table size="small" aria-label="coefficients table">
            <TableHead>
              <TableRow>
                <TableCell>{t("trainingTab.features")}</TableCell>
                <TableCell align="right">{t("trainingTab.value")}</TableCell>
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
                    {t("trainingTab.noCoefficients")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="subtitle1" gutterBottom>
          {t("trainingTab.interceptLabel")}:{" "}
          {typeof modelDetails.intercept === "number" ? modelDetails.intercept.toFixed(4) : "N/A"}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {t("trainingTab.r2ScoreLabel")}:{" "}
          {typeof modelDetails.score === "number" ? modelDetails.score.toFixed(4) : "N/A"}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {t("trainingTab.mseLabel")}:{" "}
          {typeof modelDetails.mse === "number" ? modelDetails.mse.toFixed(4) : "N/A"}
        </Typography>

        {modelDetails.model_type === "adstock" && modelDetails.adstock_params && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              {t("trainingTab.adstockParams")}
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="adstock parameters table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t("trainingTab.features")}</TableCell>
                    <TableCell align="right">Alpha</TableCell>
                    <TableCell align="right">Beta</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modelDetails.adstock_params &&
                  Object.keys(modelDetails.adstock_params).length > 0 ? (
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
                        {t("trainingTab.noAdstockParams")}
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
