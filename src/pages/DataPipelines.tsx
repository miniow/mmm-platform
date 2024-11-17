// src/components/DataPipeline.tsx
import React, { useState, useEffect } from 'react';
import { DataPipeline as DataPipelineType } from '../types';
import { Link } from 'react-router-dom';
import './../styles/DataPipelines.scss'; // Opcjonalnie dodaj stylizację

const DataPipeline: React.FC = () => {
  const [dataPipelines, setDataPipelines] = useState<DataPipelineType[]>(() => {
    const saved = localStorage.getItem('dataPipelines');
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState<{ name: string }>({ name: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('dataPipelines', JSON.stringify(dataPipelines));
  }, [dataPipelines]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    if (!form.name.trim()) return; // Walidacja: nie dodawaj pustych nazw
    const newPipeline: DataPipelineType = {
        id: Date.now(),
        name: form.name,
        createdDateTime: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        datasources: []
    };
    setDataPipelines([...dataPipelines, newPipeline]);
    setForm({ name: '' });
  };

  const handleUpdate = () => {
    if (editingId === null || !form.name.trim()) return;
    setDataPipelines(dataPipelines.map(dp => 
      dp.id === editingId 
        ? { ...dp, name: form.name, lastModified: new Date().toISOString() }
        : dp
    ));
    setEditingId(null);
    setForm({ name: '' });
  };

  const handleEdit = (dp: DataPipelineType) => {
    setEditingId(dp.id);
    setForm({ name: dp.name });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten DataPipeline?')) {
      setDataPipelines(dataPipelines.filter(dp => dp.id !== id));
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
      {dataPipelines.length > 0 ? (
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
                <td>{new Date(dp.createdDateTime).toLocaleString()}</td>
                <td>{new Date(dp.lastModified).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleEdit(dp)}>Edytuj</button>
                  <button onClick={() => handleDelete(dp.id)}>Usuń</button>
                    <Link to={`/datapipelines/${dp.id}`}>Szczegóły</Link>

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
