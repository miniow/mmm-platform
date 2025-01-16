// src/components/WorkspaceDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Modal,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import { FaTrashAlt, FaStar, FaPlus } from 'react-icons/fa';
import api from "../api";
import '../styles/WorkspaceDetails.scss';

// Import typów
import {TrainingData, PredictionResponse, ModelType, Workspace, ModelResult } from '../types';

// Formularz dodawania modelu
interface AddModelFormProps {
  onAddModel: (modelType: ModelType) => void;
  onClose: () => void;
}

const AddModelForm: React.FC<AddModelFormProps> = ({ onAddModel, onClose }) => {
  const [modelType, setModelType] = useState<ModelType>("regular");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModelType(event.target.value as ModelType);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddModel(modelType);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Wybierz Typ Modelu</FormLabel>
        <RadioGroup
          aria-label="model-type"
          name="model-type"
          value={modelType}
          onChange={handleChange}
        >
          <FormControlLabel value="regular" control={<Radio />} label="Zwykła Regresja" />
          <FormControlLabel value="adstock" control={<Radio />} label="Regresja z Adstock" />
        </RadioGroup>
      </FormControl>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} sx={{ mr: 1 }}>Anuluj</Button>
        <Button type="submit" variant="contained" color="primary">Dodaj Model</Button>
      </Box>
    </Box>
  );
};

const WorkspaceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [models, setModels] = useState<ModelResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModelForm, setShowAddModelForm] = useState<boolean>(false);
  const [addModelError, setAddModelError] = useState<string | null>(null);
  const [addModelSuccess, setAddModelSuccess] = useState<boolean>(false);

  // Fetch workspace details
  const fetchWorkspaceDetails = async () => {
    if (!id) return;
    try {
      const response = await api.get<Workspace>(`/api/Workspace/${id}`);
      const ws = response.data;
      ws.date = new Date(ws.createdAt).toLocaleDateString();
      setWorkspace(ws);
    } catch (error) {
      console.error("Failed to fetch workspace details:", error);
      setError("Nie udało się pobrać szczegółów workspace.");
    }
  };

  // Fetch models for this workspace
  const fetchModels = async () => {
    if (!id) return;
    try {
      const response = await api.get<ModelResult[]>(`http://127.0.0.1:8000/models/${id}`);
      setModels(response.data);
    } catch (error) {
      console.error("Failed to fetch models:", error);
      setError("Nie udało się pobrać modeli.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchWorkspaceDetails();
      await fetchModels();
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // Dodaj nowy model
  const addModel = async (modelType: ModelType) => {
    if (!id) return;
    try {
      const createModelData = {
        workspace_id: id,
        model_type: modelType
      };

      const response = await api.post<ModelResult>('http://localhost:8000/create_model', createModelData);
      setModels(prevModels => [...prevModels, response.data]);
      setAddModelSuccess(true);
      setShowAddModelForm(false);
    } catch (error: any) {
      console.error("Failed to add model:", error);
      setAddModelError(error.response?.data?.detail || "Nie udało się dodać modelu.");
    }
  };

  // Usuń model
  const removeModel = async (modelId: string) => {
    try {
      await api.delete(`/api/models/${modelId}`);
      setModels(prevModels => prevModels.filter(model => model.model_id !== modelId));
    } catch (error) {
      console.error("Failed to remove model:", error);
      setError("Nie udało się usunąć modelu.");
    }
  };

  // Obsługa dodawania do ulubionych (jeśli jest taka potrzeba)
  const toggleFavorite = async () => {
    if (!workspace) return;
    try {
      const updatedWorkspace = { ...workspace, isFavorite: !workspace.isFavorite };
      await api.put(`/api/Workspace/${id}/favorite`, updatedWorkspace);
      setWorkspace(updatedWorkspace);
    } catch (error) {
      console.error("Failed to update favorite status:", error);
      setError("Nie udało się zaktualizować statusu ulubionego.");
    }
  };

  // Kolumny dla DataGrid
  const modelColumns: GridColDef[] = [
    { field: 'model_id', headerName: 'Model ID', width: 250 },
    { field: 'model_type', headerName: 'Typ Modelu', width: 150 },
    { field: 'score', headerName: 'R² Score', width: 130 },
    { field: 'mse', headerName: 'MSE', width: 130 },
    {
      field: 'actions',
      headerName: 'Akcje',
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/models/${params.row.model_id}`)} // Zakładając, że masz stronę dla pojedynczego modelu
          >
            Szczegóły
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => removeModel(params.row.model_id)}
          >
            Usuń
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <div className="workspace-details">
      <Button onClick={() => navigate(-1)} variant="contained" sx={{ mb: 2 }}>
        Powrót
      </Button>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : workspace ? (
        <Box>
          <Typography variant="h4" gutterBottom>
            {workspace.name}
          </Typography>
          <Typography variant="body1">
            <strong>Data Utworzenia:</strong> {workspace.date}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Liczba Modeli:</strong> {models.length}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FaPlus />}
            onClick={() => setShowAddModelForm(true)}
            sx={{ mb: 2 }}
          >
            Dodaj Nowy Model
          </Button>

          {/* Lista modeli */}
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={models.map((model) => ({ id: model.model_id, ...model }))}
              columns={modelColumns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              autoHeight
            />
          </Box>

          {/* Formularz dodawania modelu */}
          <Modal
            open={showAddModelForm}
            onClose={() => setShowAddModelForm(false)}
            aria-labelledby="add-model-modal"
            aria-describedby="form-to-add-new-model"
          >
            <Box sx={{
              position: 'absolute' as 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}>
              <AddModelForm onAddModel={addModel} onClose={() => setShowAddModelForm(false)} />
            </Box>
          </Modal>

          {/* Komunikaty */}
          <Snackbar
            open={addModelSuccess}
            autoHideDuration={6000}
            onClose={() => setAddModelSuccess(false)}
          >
            <Alert onClose={() => setAddModelSuccess(false)} severity="success" sx={{ width: '100%' }}>
              Model został pomyślnie dodany!
            </Alert>
          </Snackbar>
          <Snackbar
            open={!!addModelError}
            autoHideDuration={6000}
            onClose={() => setAddModelError(null)}
          >
            <Alert onClose={() => setAddModelError(null)} severity="error" sx={{ width: '100%' }}>
              {addModelError}
            </Alert>
          </Snackbar>
        </Box>
      ) : (
        <Typography>Workspace nie został znaleziony.</Typography>
      )}
    </div>
  );
};

export default WorkspaceDetails;
