// src/pages/Models.tsx
import React, { useContext, useMemo, useState } from 'react';
import { DataContext } from '../context/DataContext';
import LineChartComponent from '../components/charts/LineChartComponent';
import ScatterPlotWithTrendline from '../components/charts/ScatterPlotWithTrendline';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Stack, Container,Tooltip, IconButton, Tabs, Tab  } from '@mui/material';
import { FaInfo} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`models-tabpanel-${index}`}
      aria-labelledby={`models-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

function a11yProps(index: number) {
  return {
    id: `models-tab-${index}`,
    'aria-controls': `models-tabpanel-${index}`,
  };
}

const Models: React.FC = () => {
  const dataContext = useContext(DataContext);
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);

  if (!dataContext) {
    return <div>Ładowanie danych...</div>;
  }

  const { tableData, columns } = dataContext;

  if (tableData.length === 0) {
    return <div>Brak danych do wyświetlenia. Proszę zaimportować plik CSV.</div>;
  }

  // Logowanie pierwszego wiersza danych
  console.log('First row of tableData:', tableData[0]);
  console.log('Keys in first row:', Object.keys(tableData[0]));

  // Przygotowanie danych dla wykresu sprzedaży
  const salesData = useMemo(() => {
    const data = tableData
      .map((row, index) => ({
        sample: index + 1,
        sprzedaz: Number(row['Sales']) || 0, // Użycie klucza 'Sales'
      }))
      .filter((data) => !isNaN(data.sprzedaz));
    
    console.log('salesData:', data); // Dodane logowanie
    return data;
  }, [tableData]);

  // Przygotowanie danych dla wykresu wydatków
  const spendsData = useMemo(() => {
    return tableData.map((row, index) => ({
      sample: index + 1,
      FB: Number(row['FB']) || 0,
      TV: Number(row['TV']) || 0,
      Radio: Number(row['Radio']) || 0,
      Sales: Number(row['Sales']) || 0
    }));
  }, [tableData]);

  console.log('spendsData:', spendsData); // Poprawione logowanie

  // Sprawdzenie, czy sprzedaz zawiera wartości
  salesData.forEach((data, idx) => {
    if (isNaN(data.sprzedaz)) {
      console.warn(`Invalid sprzedaz value at index ${idx}:`, tableData[idx]);
    }
  });

  // Przygotowanie danych dla Scatter Plots
  const scatterData = useMemo(() => {
    return ['FB', 'TV', 'Radio'].map((variable) => ({
      variable,
      data: tableData
        .map((row) => ({
          x: Number(row[variable]), // Zmienna z tabeli (FB, TV, Radio)
          y: Number(row['Sales']),  // Sprzedaż
        }))
        .filter((d) => !isNaN(d.x) && !isNaN(d.y)), // Filtrowanie nieprawidłowych danych
    }));
  }, [tableData]);

  // Przygotowanie kolumn dla DataGrid
  const dataGridColumns: GridColDef[] = useMemo(() => {
    return columns.map((col) => ({
      field: col.field,
      headerName: col.headerName,
      width: 150,
      flex: 1,
    }));
  }, [columns]);

  // Obsługa zmiany zakładki
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={modelsContainerStyle}>
      <Typography variant="h4" gutterBottom>
        <p>{t('Eksploracja danych MarketingMixModleing')}</p>
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="models tabs">
          <Tab label="Exploracja" {...a11yProps(0)} />
          <Tab label="Trenowanie" {...a11yProps(1)} />
          <Tab label="Predykcja" {...a11yProps(2)} />
          <Tab label="Planowanie" {...a11yProps(3)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {/* Zakładka Exploration */}
        <Stack spacing={5}>
          {/* Sekcja Surowe Dane */}
          <Box sx={sectionStyle}>
            <Typography variant="h5" gutterBottom>
              Dane
            </Typography>
            <Box sx={{ width: '100%' }}>
              <DataGrid
                rows={tableData}
                columns={dataGridColumns}
              />
            </Box>
          </Box>

          {/* Sekcja Wykresów Sprzedaży */}
          <Box sx={sectionStyle}>
            <Typography variant="h5" gutterBottom>
              Wydatki i sprzedaż
            </Typography>
            <Box sx={{ width: '100%', height: 400 }}> {/* Dodana wysokość */}
              <LineChartComponent
                data={salesData}
                xKey="sample"
                yKey="sprzedaz"
                title="Sprzedaż w kolejnych tygodniach"
                xLabel="Nr próbki"
                yLabel="Sprzedaż"
              />
            </Box>
            <Box sx={{ width: '100%', height: 400 }}> {/* Dodana wysokość */}
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

          {/* Sekcja wykresów punktowych z liniami trendu dla malejących zwrotów */}
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
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Zakładka Training */}
        <Typography variant="h5" gutterBottom>
          Training Section
        </Typography>
        {/* Dodaj tutaj zawartość sekcji Training */}
        <Box sx={sectionStyle}>
          <Typography variant="body1">
            Tutaj możesz dodać zawartość dotyczącą treningu modeli.
          </Typography>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Zakładka Prediction */}
        <Typography variant="h5" gutterBottom>
          Prediction Section
        </Typography>
        {/* Dodaj tutaj zawartość sekcji Prediction */}
        <Box sx={sectionStyle}>
          <Typography variant="body1">
            Tutaj możesz dodać zawartość dotyczącą predykcji modeli.
          </Typography>
        </Box>
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {/* Zakładka Prediction */}
        <Typography variant="h5" gutterBottom>
          Prediction Section
        </Typography>
        {/* Dodaj tutaj zawartość sekcji Prediction */}
        <Box sx={sectionStyle}>
          <Typography variant="h6">
            Tutaj możesz dodać zawartość dotyczącą planowani budżetu.
          </Typography>
        </Box>
      </TabPanel>
    </Container>
  );
};

// Style dla strony Models
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