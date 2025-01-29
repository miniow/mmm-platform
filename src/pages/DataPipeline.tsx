// src/components/DataPipeline.tsx
import React, { useState, useEffect } from 'react';
import { DataPipeline as DataPipelineType } from '../types';
import { Link } from 'react-router-dom';
import api from '../api';
import './../styles/DataPipeline.scss'; // Opcjonalnie dodaj stylizację
import { format } from 'date-fns';
import { FaEdit, FaInfoCircle, FaTrash } from 'react-icons/fa';

const DataPipeline: React.FC = () => {
  const [dataPipelines, setDataPipelines] = useState<DataPipelineType[]>([]);
  const [form, setForm] = useState<{ name: string }>({ name: '' });
  const [editingId, setEditingId] = useState<string | null>(null); // Zmieniono na string
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Pobieranie Data Pipelines z API
  const fetchDataPipelines = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<DataPipelineType[]>('/api/DataPipelines');
      setDataPipelines(response.data);
    } catch (err) {
      console.error('Błąd podczas pobierania Data Pipelines:', err);
      setError('Nie udało się pobrać Data Pipelines.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataPipelines();
    console.log(dataPipelines);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleCreate = async () => {
    if (!form.name.trim()) return; 
    try {
      const newPipeline: Omit<DataPipelineType, 'id'> = {
        name: form.name,
        createdDateTime: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        datasources: [],
        flowData: { nodes: [], edges: [] },
      };
      const response = await api.post<DataPipelineType>('/api/DataPipelines', newPipeline);
      setDataPipelines([...dataPipelines, response.data]);
      setForm({ name: '' });
    } catch (err) {
      console.error('Błąd podczas tworzenia Data Pipeline:', err);
      setError('Nie udało się dodać Data Pipeline.');
    }
  };

  const handleUpdate = async () => {
    if (editingId === null || !form.name.trim()) return;
    try {
      const updatedPipeline = {
        name: form.name,
        lastModified: new Date().toISOString(),
      };
      const response = await api.put<DataPipelineType>(`/api/DataPipelines/${editingId}`, updatedPipeline);
      setDataPipelines(
        dataPipelines.map(dp => (dp.id === editingId ? response.data : dp))
      );
      setEditingId(null);
      setForm({ name: '' });
    } catch (err) {
      console.error('Błąd podczas aktualizacji Data Pipeline:', err);
      setError('Nie udało się zaktualizować Data Pipeline.');
    }
  };

  const handleEdit = (dp: DataPipelineType) => {
    setEditingId(dp.id);
    setForm({ name: dp.name });
  };


  const handleDelete = async (id: string) => { 

      try {
        await api.delete(`/api/DataPipelines/${id}`);
        setDataPipelines(dataPipelines.filter(dp => dp.id !== id));
      } catch (err) {
        console.error('Błąd podczas usuwania Data Pipeline:', err);
        setError('Nie udało się usunąć Data Pipeline.');
      }
  };

  return (
    <div className="data-pipeline">
      <h2>Data Pipelines</h2>
      <div className="form">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nazwa Pipeline"
        />
        {editingId === null ? (
          <button onClick={handleCreate}>Dodaj</button>
        ) : (
          <button onClick={handleUpdate}>Aktualizuj</button>
        )}
      </div>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Ładowanie...</p>
      ) : dataPipelines.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nazwa</th>
              <th>Utworzono</th>
              <th>Ostatnia modyfikacja</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {dataPipelines.map(dp => (
              <tr key={dp.id}>
                <td>{dp.id}</td>
                <td>{dp.name}</td>
                <td>{dp.createdDateTime ? format(new Date(dp.createdDateTime), 'yyyy-MM-dd HH:mm:ss') : 'Brak danych'}</td>
                <td>{new Date(dp.lastExecutedAt).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'medium' })}</td>

                <td data-label="Akcje" className="actions">
                  <button className="edit" onClick={() => handleEdit(dp)}>
                    <FaEdit /> Edytuj
                  </button>
                  <button className="delete" onClick={() => handleDelete(dp.id)}>
                    <FaTrash /> Usuń
                  </button>
                  <Link to={`/datapipelines/${dp.id}`} className="details">
                    <FaInfoCircle /> Szczegóły
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Brak Data Pipelines. Dodaj nowy.</p>
      )}
    </div>
  );
};

export default DataPipeline;
