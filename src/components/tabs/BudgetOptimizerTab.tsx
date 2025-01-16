import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Grid,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const channelColors: { [key: string]: string } = {
  FB: "#8884d8",
  TV: "#82ca9d",
  Radio: "#ffc658",
};

interface BudgetOptimizerTabProps {
  modelId: string;
}

interface BudgetAllocationResponse {
  channel_names: string[];
  budget_allocation: { [channel: string]: number }[];
  predicted_sales: number[];
}

const BudgetOptimizerTab: React.FC<BudgetOptimizerTabProps> = ({ modelId }) => {
  const [totalBudget, setTotalBudget] = useState<number>(300);
  const [weeks, setWeeks] = useState<number>(3);

  const [channelNames, setChannelNames] = useState<string[]>([]);
  const [allocation, setAllocation] = useState<{ [channel: string]: number }[] | null>(null);
  const [sales, setSales] = useState<number[] | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAllocation(null);
    setSales(null);
    setChannelNames([]);

    try {
      const url = `http://127.0.0.1:8000/plan_budget/${modelId}?total_budget=${totalBudget}&weeks=${weeks}`;
      const response = await axios.post<BudgetAllocationResponse>(url, null, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      setChannelNames(data.channel_names);
      setAllocation(data.budget_allocation);
      setSales(data.predicted_sales);
    } catch (err: any) {
      console.error(err);
      if (err.response) {
        setError(
          err.response.data.detail ||
            "Wystąpił błąd podczas planowania budżetu."
        );
      } else {
        setError("Wystąpił nieoczekiwany błąd.");
      }
    } finally {
      setLoading(false);
    }
  };

  const prepareBarChartData = () => {
    if (!allocation || !channelNames.length) return [];
    return allocation.map((weekAllocation, weekIndex) => {
      const weekData: { week: string; [key: string]: number } = {
        week: `Tydzień ${weekIndex + 1}`,
      };
      channelNames.forEach((channel) => {
        weekData[channel] = weekAllocation[channel] || 0;
      });
      return weekData;
    });
  };

  const prepareLineChartData = () => {
    if (!sales) return [];
    return sales.map((sale, index) => ({
      week: `Tydzień ${index + 1}`,
      sales: sale,
    }));
  };

  const renderBarChart = () => {
    const data = prepareBarChartData();
    if (data.length === 0) return null;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          {channelNames.map((channel, index) => (
            <Bar key={index} dataKey={channel} fill={channelColors[channel] || "#8884d8"} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderLineChart = () => {
    const data = prepareLineChartData();
    if (data.length === 0) return null;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Optymalizator Budżetu
      </Typography>

      {/* Formularz */}
      <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Całkowity Budżet"
              type="number"
              fullWidth
              required
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              inputProps={{ min: 0, step: "0.01" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Liczba Tygodni"
              type="number"
              fullWidth
              required
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              inputProps={{ min: 1, step: "1" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : "Plan Budget"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Wyświetlanie błędów */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: 4 }}>
          {error}
        </Alert>
      )}

      {/* Dashboard */}
      <Grid container spacing={4}>
        {/* Wykres alokacji budżetu */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Alokacja Budżetu
              </Typography>
              {renderBarChart()}
            </CardContent>
          </Card>
        </Grid>

        {/* Wykres przewidywanej sprzedaży */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Przewidywana Sprzedaż
              </Typography>
              {renderLineChart()}
            </CardContent>
          </Card>
        </Grid>

        {/* Tabela alokacji budżetu */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tabela Alokacji Budżetu
              </Typography>
              {allocation && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tydzień</TableCell>
                        {channelNames.map((channel, index) => (
                          <TableCell key={index} align="right">
                            {channel}
                          </TableCell>
                        ))}
                        <TableCell align="right">Łączny Budżet</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allocation.map((weekAllocation, weekIndex) => {
                        const totalWeekBudget = channelNames.reduce(
                          (sum, channel) => sum + (weekAllocation[channel] || 0),
                          0
                        );
                        return (
                          <TableRow key={weekIndex}>
                            <TableCell>Tydzień {weekIndex + 1}</TableCell>
                            {channelNames.map((channel, channelIndex) => (
                              <TableCell key={channelIndex} align="right">
                                {(weekAllocation[channel] || 0).toFixed(2)}
                              </TableCell>
                            ))}
                            <TableCell align="right">
                              {totalWeekBudget.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tabela przewidywanej sprzedaży */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Przewidywana Sprzedaż (Tabela)
              </Typography>
              {sales && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tydzień</TableCell>
                        <TableCell align="right">Sprzedaż</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sales.map((sale, index) => (
                        <TableRow key={index}>
                          <TableCell>Tydzień {index + 1}</TableCell>
                          <TableCell align="right">{sale.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BudgetOptimizerTab;
