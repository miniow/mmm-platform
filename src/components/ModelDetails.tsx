// src/pages/ModelDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import api from "../api";

import { ModelResult } from "../types";

import TabPanel from "../components/TabPanel";
import ExplorationTab from "../components/tabs/ExplorationTab";
import TrainingTab from "../components/tabs/TrainingTab";
import PredictionTab from "../components/tabs/PredictionTab";
import BudgetOptimizerTab from "./tabs/BudgetOptimizerTab";


const a11yProps = (index: number) => ({
  id: `tab-${index}`,
  "aria-controls": `tabpanel-${index}`,
});

const LoadingSpinner: React.FC = () => (
  <Box display="flex" justifyContent="center" mt={5}>
    <CircularProgress />
  </Box>
);

const ErrorSnackbar: React.FC<{ error: string; onClose: () => void }> = ({ error, onClose }) => (
  <Snackbar open={!!error} autoHideDuration={6000} onClose={onClose}>
    <Alert onClose={onClose} severity="error" sx={{ width: "100%" }}>
      {error}
    </Alert>
  </Snackbar>
);

const ModelDetails: React.FC = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<ModelResult | null>(null);
  const [warehouseData, setWarehouseData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Tab management
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Helper to get unique columns from warehouseData
  const getColumns = (data: any[]): string[] => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  // Fetch model details
  const fetchModelDetails = async () => {
    if (!modelId) {
      setError("Brak identyfikatora modelu w URL.");
      setLoading(false);
      return;
    }
    try {
      const response = await api.get<ModelResult>(`http://127.0.0.1:8000/model/${modelId}`);
      setModel(response.data);
      console.log("Model:", response.data); // Logowanie modelu
    } catch (err: any) {
      console.error("Failed to fetch model details:", err);
      setError(err.response?.data?.detail || "Nie udało się pobrać szczegółów modelu.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch warehouse data
  const fetchWarehouseData = async (workspaceId: string) => {
    try {
      const response = await api.get<any[]>(`api/datapipelines/getDataFromWarehouse`, {
        params: { workspaceId },
      });
      console.log("Dane z magazynu:", response.data); // Logowanie danych
      setWarehouseData(response.data);
    } catch (err: any) {
      console.error("Failed to fetch warehouse data:", err);
      setError(err.response?.data || "Nie udało się pobrać danych z magazynu.");
    }
  };

  useEffect(() => {
    fetchModelDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId]);

  useEffect(() => {
    if (model?.workspace_id) {
      fetchWarehouseData(model.workspace_id);
    }
  }, [model]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!model) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography>Model nie został znaleziony.</Typography>
      </Box>
    );
  }

  // Compute available columns
  const availableColumns = getColumns(warehouseData);

  // Exclude 'model_id', 'workspace_id', etc. if necessary
  const filteredColumns = availableColumns.filter(
    (col) => col !== "model_id" && col !== "workspace_id"
  );

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Button
        onClick={() => navigate(-1)}
        variant="contained"
        startIcon={<FaArrowLeft />}
        sx={{ mb: 2 }}
      >
        Powrót
      </Button>
      <Typography variant="h4" gutterBottom>
        Szczegóły Modelu
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        <strong>Model ID:</strong> {model.model_id}
      </Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        <strong>Workspace ID:</strong> {model.workspace_id}
      </Typography>

      {/* Tabs for content switching */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="model details tabs">
          <Tab label="Eksploracja" {...a11yProps(0)} />
          <Tab label="Trenowanie" {...a11yProps(1)} />
          <Tab label="Predykcja" {...a11yProps(2)} />
          <Tab label="Optymalizator" {...a11yProps(3)} />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <ExplorationTab
          warehouseData={warehouseData}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TrainingTab
          modelId={model.model_id}
          availableColumns={filteredColumns}
          modelDetails={model}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <PredictionTab
          modelId={model.model_id}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <BudgetOptimizerTab
         modelId={model.model_id}
         />
      </TabPanel>
      {/* Snackbar for error handling */}
      <ErrorSnackbar
        error={error || ""}
        onClose={() => setError(null)}
      />
    </Box>
  );
};

export default ModelDetails;
