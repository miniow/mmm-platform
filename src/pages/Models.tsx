// src/pages/Models.tsx
import React, { useMemo, useState, useEffect } from 'react';
import LineChartComponent from '../components/charts/LineChartComponent';
import ScatterPlotWithTrendline from '../components/charts/ScatterPlotWithTrendline';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Typography,
  Stack,
  Container,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { FaInfo } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import {
  TrainingData,
  ModelResult,
  PredictionRequest,
  PredictionResponse,
  ModelType,
} from '../types';
import { useParams } from 'react-router-dom'; // Import useParams

// Definicje interfejsów
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Komponent TabPanel dla obsługi zakładek
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`models-tabpanel-${index}`}
      aria-labelledby={`models-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

// Funkcja pomocnicza do a11y props
function a11yProps(index: number) {
  return {
    id: `models-tab-${index}`,
    'aria-controls': `models-tabpanel-${index}`,
  };
}

// Komponent główny Models
const Models: React.FC = () => {
  const { t } = useTranslation();
  const { modelId } = useParams<{ modelId: string }>(); // Pobieranie modelId z URL
  const [tabValue, setTabValue] = useState(0);

  // Stany do obsługi trenowania
  const [training, setTraining] = useState(false);
  const [trainingSuccess, setTrainingSuccess] = useState(false);
  const [trainingError, setTrainingError] = useState<string | null>(null);

  // Stan przechowujący wynik wytrenowanego modelu
  const [modelResult, setModelResult] = useState<ModelResult | null>(null);

  // Stan przechowujący wyniki predykcji i MSE
  const [predictionData, setPredictionData] = useState<{
    actual: number[];
    predicted: number[];
    mean_squared_error: number;
  } | null>(null);

  // Stan dla typu modelu
  const [modelType, setModelType] = useState<ModelType>("regular");

  // Stan dla listy modeli
  const [models, setModels] = useState<ModelResult[]>([]);

  // Stan dla wybranego modelu
  const [selectedModel, setSelectedModel] = useState<ModelResult | null>(null);

  // Stany do przechowywania danych eksploracji
  const [explorationData, setExplorationData] = useState<any[]>([]);
  const [explorationLoading, setExplorationLoading] = useState<boolean>(true);
  const [explorationError, setExplorationError] = useState<string | null>(null);

  // Przygotowanie danych z eksploracji do wykresów i tabel
  const tableData = useMemo(() => {
    return explorationData.map((row: any, index: number) => ({
      id: index + 1,
      FB: Number(row.FB) || 0,
      TV: Number(row.TV) || 0,
      Radio: Number(row.Radio) || 0,
      Sales: Number(row.Sales) || 0,
    }));
  }, [explorationData]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'FB', headerName: 'Facebook Spend', width: 130 },
    { field: 'TV', headerName: 'TV Spend', width: 130 },
    { field: 'Radio', headerName: 'Radio Spend', width: 130 },
    { field: 'Sales', headerName: 'Sales', width: 100 },
  ];

  // Przygotowanie danych dla wykresu sprzedaży
  const salesData = useMemo(() => {
    const data = tableData
      .map((row) => ({
        sample: row.id,
        sprzedaz: row.Sales,
      }))
      .filter((data) => !isNaN(data.sprzedaz));
    return data;
  }, [tableData]);

  // Przygotowanie danych dla wykresu wydatków
  const spendsData = useMemo(() => {
    return tableData.map((row) => ({
      sample: row.id,
      FB: row.FB,
      TV: row.TV,
      Radio: row.Radio,
    }));
  }, [tableData]);

  // Przygotowanie danych dla Scatter Plots
  const scatterData = useMemo(() => {
    return ['FB', 'TV', 'Radio'].map((variable) => ({
      variable,
      data: tableData
        .map((row) => ({
          x: row[variable],
          y: row['Sales'],
        }))
        .filter((d) => !isNaN(d.x) && !isNaN(d.y)),
    }));
  }, [tableData]);

  // Przygotowanie kolumn dla DataGrid
  const dataGridColumns: GridColDef[] = useMemo(() => {
    return columns.map((col) => ({
      field: col.field,
      headerName: col.headerName,
      width: col.width || 150,
      flex: 1,
    }));
  }, [columns]);

  // Przygotowanie kolumn dla DataGrid modeli
  const modelGridColumns: GridColDef[] = useMemo(() => {
    return [
      { field: 'model_id', headerName: 'Model ID', width: 250 },
      { field: 'model_type', headerName: 'Typ Modelu', width: 150 },
      { field: 'score', headerName: 'R² Score', width: 130 },
      { field: 'mse', headerName: 'MSE', width: 130 },
      {
        field: 'actions',
        headerName: 'Akcje',
        width: 250,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleSelectModel(params.row as ModelResult)}
            >
              Wybierz
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleRemoveModel(params.row.model_id)}
            >
              Usuń
            </Button>
          </Stack>
        ),
      },
    ];
  }, []);

  // Przygotowanie danych dla wykresu predykcji
  const predictionChartData = useMemo(() => {
    if (!predictionData) return [];
    return tableData.map((row, index) => ({
      sample: row.id,
      actual: predictionData.actual[index],
      predicted: predictionData.predicted[index],
    }));
  }, [tableData, predictionData]);

  // Obsługa zmiany zakładki
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Obsługa zmiany typu modelu
  const handleModelTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModelType(event.target.value as ModelType);
  };

  // Funkcja do inicjacji trenowania
  const handleTrainModel = async () => {
    setTraining(true);
    setTrainingError(null);
    setTrainingSuccess(false);
    setModelResult(null); // Resetowanie poprzedniego modelu
    setPredictionData(null); // Resetowanie poprzednich predykcji

    try {
      // Przygotowanie danych X i y
      const X = tableData.map((row) => [
        Number(row['FB']) || 0,
        Number(row['TV']) || 0,
        Number(row['Radio']) || 0,
      ]);
      const y = tableData.map((row) => Number(row['Sales']) || 0);

      if (!modelId) {
        throw new Error('Brak modelId w URL');
      }

      // Najpierw pobierz model, aby uzyskać workspace_id
      const modelResponse = await fetch(`http://127.0.0.1:8000/models/${modelId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!modelResponse.ok) {
        const errorData = await modelResponse.json();
        throw new Error(errorData.detail || 'Błąd podczas pobierania modelu');
      }

      const modelData: ModelResult = await modelResponse.json();
      const workspace_id = modelData.workspace_id;

      const trainingData: TrainingData = {
        workspace_id,
        X,
        y,
        model_type: modelType, // Dodane pole
        adstock_params: modelType === "adstock" ? [
          { feature: "FB", alpha: 0.5, beta: 0.5 },
          { feature: "TV", alpha: 0.5, beta: 0.5 },
          { feature: "Radio", alpha: 0.5, beta: 0.5 },
        ] : undefined,
      };

      const response = await fetch('http://127.0.0.1:8000/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trainingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Błąd podczas trenowania modelu');
      }

      const result: ModelResult = await response.json();
      console.log('Model wytrenowany:', result);

      setModelResult(result);
      setTrainingSuccess(true);
      fetchModels(); // Pobierz zaktualizowaną listę modeli
    } catch (error: any) {
      setTrainingError(error.message);
    } finally {
      setTraining(false);
    }
  };

  // Funkcja do usuwania modelu
  const handleRemoveModel = async (modelIdToRemove: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/models/${modelIdToRemove}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Błąd podczas usuwania modelu');
      }

      setModels(prevModels => prevModels.filter(model => model.model_id !== modelIdToRemove));
      setTrainingSuccess(true);
    } catch (error: any) {
      setTrainingError(error.message);
    }
  };

  // Funkcja do wyboru modelu z listy
  const handleSelectModel = (model: ModelResult) => {
    setSelectedModel(model);
    setModelResult(model); // Aktualizuj modelResult, aby pokazać wyniki tego modelu
    setPredictionData(null); // Resetuj predykcje
  };

  // Funkcja do wykonywania predykcji
  const handlePredict = async () => {
    if (!modelResult) {
      setTrainingError('Najpierw wytrenuj model.');
      return;
    }

    try {
      // Przygotowanie danych X do predykcji
      const X_new = tableData.map((row) => [
        Number(row['FB']) || 0,
        Number(row['TV']) || 0,
        Number(row['Radio']) || 0,
      ]);

      // Przygotowanie rzeczywistych wartości sprzedaży
      const y_actual = y;

      const predictionRequest: PredictionRequest = {
        X: X_new,
        y_actual: y_actual,
      };

      const response = await fetch(`http://127.0.0.1:8000/predict/${modelResult.model_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictionRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Błąd podczas wykonywania predykcji');
      }

      const predictionResponse: PredictionResponse = await response.json();
      console.log('Predykcje:', predictionResponse);

      setPredictionData({
        actual: y, // rzeczywiste wartości sprzedaży
        predicted: predictionResponse.predictions, // przewidywane wartości sprzedaży
        mean_squared_error: predictionResponse.mean_squared_error, // obliczony MSE
      });
    } catch (error: any) {
      setTrainingError(error.message);
    }
  };

  // Rzeczywiste wartości sprzedaży (y) z danych eksploracji
  const y = useMemo(() => {
    return tableData.map((row) => Number(row['Sales']) || 0);
  }, [tableData]);

  // Funkcja do pobrania modeli z backendu
  const fetchModels = async () => {
    if (!modelId) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/models/${modelId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Błąd podczas pobierania modeli');
      }

      const fetchedModel: ModelResult = await response.json();
      console.log('Model:', fetchedModel);
      setModels([fetchedModel]); // Zakładam, że pobierasz jeden model na podstawie modelId
      setModelResult(fetchedModel); // Ustawienie aktualnego modelu
    } catch (error: any) {
      setTrainingError(error.message);
    }
  };

  // Funkcja do pobrania danych eksploracji z hurtowni danych
  const fetchExplorationData = async () => {
    if (!modelId) return;
    setExplorationLoading(true);
    setExplorationError(null);
    try {
      // Najpierw pobierz model, aby uzyskać workspace_id
      const modelResponse = await fetch(`http://127.0.0.1:8000/models/${modelId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!modelResponse.ok) {
        const errorData = await modelResponse.json();
        throw new Error(errorData.detail || 'Błąd podczas pobierania modelu');
      }

      const modelData: ModelResult = await modelResponse.json();
      const workspace_id = modelData.workspace_id;

      // Teraz pobierz dane eksploracji
      const response = await fetch(`http://127.0.0.1:8000/getDataFromWarehouse?workspace_id=${workspace_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Dodaj nagłówki autoryzacyjne, jeśli są wymagane
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Błąd podczas pobierania danych eksploracji');
      }

      const data = await response.json();
      console.log('Dane eksploracji:', data);
      setExplorationData(data);
    } catch (error: any) {
      setExplorationError(error.message);
    } finally {
      setExplorationLoading(false);
    }
  };

  // Wywołanie fetchModels i fetchExplorationData przy montowaniu komponentu
  useEffect(() => {
    if (modelId) {
      fetchModels();
      fetchExplorationData();
    }
  }, [modelId]);

  return (
    <Container maxWidth="lg" sx={modelsContainerStyle}>
      <Typography variant="h4" gutterBottom>
        {t('Eksploracja danych Marketing Mix Modeling')}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="models tabs">
          <Tab label="Exploracja" {...a11yProps(0)} />
          <Tab label="Trenowanie" {...a11yProps(1)} />
          <Tab label="Predykcja" {...a11yProps(2)} />
          <Tab label="Symulator" {...a11yProps(3)} />
        </Tabs>
      </Box>

      {/* Zakładka Exploration */}
      <TabPanel value={tabValue} index={0}>
        {explorationLoading ? (
          <CircularProgress />
        ) : explorationError ? (
          <Typography color="error">{explorationError}</Typography>
        ) : (
          <Stack spacing={5}>
            {/* Sekcja Surowe Dane */}
            <Box sx={sectionStyle}>
              <Typography variant="h5" gutterBottom>
                Dane
              </Typography>
              <Box sx={{ width: '100%', height: 400 }}>
                <DataGrid
                  rows={tableData}
                  columns={dataGridColumns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 20, 30]}
                  checkboxSelection
                />
              </Box>
            </Box>

            {/* Sekcja Wykresów Sprzedaży */}
            <Box sx={sectionStyle}>
              <Typography variant="h5" gutterBottom>
                Wydatki i sprzedaż
              </Typography>
              <Box sx={{ width: '100%', height: 400 }}>
                <LineChartComponent
                  data={salesData}
                  xKey="sample"
                  yKey="sprzedaz"
                  title="Sprzedaż w kolejnych tygodniach"
                  xLabel="Nr próbki"
                  yLabel="Sprzedaż"
                />
              </Box>
              <Box sx={{ width: '100%', height: 400, mt: 4 }}>
                <LineChartComponent
                  data={spendsData}
                  xKey="sample"
                  lines={[
                    { key: 'FB', color: 'blue', label: 'FB Spend' },
                    { key: 'TV', color: 'green', label: 'TV Spend' },
                    { key: 'Radio', color: 'red', label: 'Radio Spend' },
                  ]}
                  title="Wydatki w kolejnych tygodniach"
                  xLabel="Nr próbki"
                  yLabel="Wydatki"
                />
              </Box>
            </Box>

            {/* Sekcja wykresów punktowych z liniami trendu */}
            <Box sx={sectionStyle}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Typography variant="h5" gutterBottom>
                  Malejące zwroty
                </Typography>
                <Tooltip title="Malejące zwroty oznaczają, że dalsze inwestycje przynoszą coraz mniejsze zyski." arrow>
                  <IconButton size="small" sx={{ padding: 1 }}>
                    <FaInfo fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack spacing={4}>
                {scatterData.map((plot) => (
                  <Box key={plot.variable} sx={{ width: '100%' }}>
                    <ScatterPlotWithTrendline
                      data={plot.data}
                      title={plot.variable}
                      xLabel={plot.variable}
                      yLabel="Sales"
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        )}
      </TabPanel>

      {/* Zakładka Training */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h5" gutterBottom>
          Training Section
        </Typography>
        <Box sx={sectionStyle}>
          <Typography variant="body1" gutterBottom>
            Tutaj możesz trenować modele Marketing Mix Modeling. Wybierz typ modelu poniżej i kliknij przycisk, aby rozpocząć trenowanie.
          </Typography>

          {/* Dodanie wyboru typu modelu */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Wybierz typ modelu:
            </Typography>
            <Stack direction="row" spacing={2}>
              <label>
                <input
                  type="radio"
                  value="regular"
                  checked={modelType === "regular"}
                  onChange={handleModelTypeChange}
                />
                Zwykła Regresja
              </label>
              <label>
                <input
                  type="radio"
                  value="adstock"
                  checked={modelType === "adstock"}
                  onChange={handleModelTypeChange}
                />
                Regresja z Adstock
              </label>
            </Stack>
          </Box>

          {/* Przycisk do trenowania modelu */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleTrainModel}
            disabled={training}
            sx={{ mt: 2 }}
          >
            {training ? <CircularProgress size={24} /> : 'Trenuj Model'}
          </Button>

          {/* Obsługa komunikatów */}
          <Snackbar
            open={trainingSuccess}
            autoHideDuration={6000}
            onClose={() => setTrainingSuccess(false)}
          >
            <Alert onClose={() => setTrainingSuccess(false)} severity="success" sx={{ width: '100%' }}>
              Model został pomyślnie wytrenowany!
            </Alert>
          </Snackbar>
          <Snackbar
            open={!!trainingError}
            autoHideDuration={6000}
            onClose={() => setTrainingError(null)}
          >
            <Alert onClose={() => setTrainingError(null)} severity="error" sx={{ width: '100%' }}>
              {trainingError}
            </Alert>
          </Snackbar>

          {/* Sekcja wyświetlania wyników modelu */}
          {modelResult && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Wynik Modelu
              </Typography>
              <Typography variant="body1">
                <strong>Model ID:</strong> {modelResult.model_id}
              </Typography>
              <Typography variant="body1">
                <strong>Typ Modelu:</strong> {modelResult.model_type === "regular" ? "Zwykła Regresja" : "Regresja z Adstock"}
              </Typography>
              <Typography variant="body1">
                <strong>R² Score:</strong> {modelResult.score.toFixed(3)}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>MSE:</strong> {modelResult.mse?.toFixed(3) || "N/A"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Współczynniki:</strong>
              </Typography>
              <Box sx={{ mt: 1, ml: 2 }}>
                <Typography variant="body2">FB: {modelResult.coefficients.FB}</Typography>
                <Typography variant="body2">TV: {modelResult.coefficients.TV}</Typography>
                <Typography variant="body2">Radio: {modelResult.coefficients.Radio}</Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Wyraz wolny (Intercept):</strong> {modelResult.intercept}
              </Typography>
              {/* Przycisk do wykonywania predykcji */}
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePredict}
                disabled={training}
                sx={{ mt: 3 }}
              >
                Wykonaj Predykcję
              </Button>
            </Box>
          )}

          {/* Lista Wytrenowanych Modeli */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Wytrenowane Modele
            </Typography>
            {models.length === 0 ? (
              <Typography variant="body2">Brak wytrenowanych modeli.</Typography>
            ) : (
              <DataGrid
                rows={models.map((model, index) => ({ id: index + 1, ...model }))}
                columns={modelGridColumns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                autoHeight
              />
            )}
          </Box>
        </Box>
      </TabPanel>

      {/* Zakładka Prediction */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h5" gutterBottom>
          Prediction Section
        </Typography>
        <Box sx={sectionStyle}>
          <Typography variant="body1" gutterBottom>
            Tutaj możesz wykonać predykcje na podstawie wybranego modelu.
          </Typography>
          {/* Przycisk do wykonywania predykcji */}
          <Button
            variant="contained"
            color="primary"
            onClick={handlePredict}
            disabled={training || !modelResult}
            sx={{ mt: 2 }}
          >
            {training ? <CircularProgress size={24} /> : 'Wykonaj Predykcję'}
          </Button>
          {/* Obsługa komunikatów */}
          <Snackbar
            open={!!trainingError}
            autoHideDuration={6000}
            onClose={() => setTrainingError(null)}
          >
            <Alert onClose={() => setTrainingError(null)} severity="error" sx={{ width: '100%' }}>
              {trainingError}
            </Alert>
          </Snackbar>

          {/* Sekcja wyświetlania wyników predykcji */}
          {predictionData && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Wyniki Predykcji
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Błąd Średniokwadratowy (MSE):</strong> {predictionData.mean_squared_error.toFixed(3)}
              </Typography>
              <Box sx={{ height: 400, mt: 2 }}>
                <LineChartComponent
                  data={predictionChartData}
                  xKey="sample"
                  lines={[
                    { key: 'actual', color: '#8884d8', label: 'Rzeczywiste' },
                    { key: 'predicted', color: '#82ca9d', label: 'Przewidywane' },
                  ]}
                  title="Rzeczywiste vs Przewidywane Sprzedaże"
                  xLabel="Nr próbki"
                  yLabel="Sprzedaż"
                />
              </Box>
            </Box>
          )}
        </Box>
      </TabPanel>

      {/* Zakładka Planowanie */}
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h5" gutterBottom>
          Symulator
        </Typography>
        <Box sx={sectionStyle}>
          <Typography variant="h6" gutterBottom>
            Tutaj możesz przeanalizować scenariusze What if
          </Typography>
          {/* Możesz dodać formularz lub narzędzia do planowania budżetu */}
        </Box>
      </TabPanel>
    </Container>
  );
};

// Styles dla strony Models
const modelsContainerStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#f5f5f5',
  minHeight: '100vh',
};

// Ogólny styl dla sekcji
const sectionStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

export default Models;
