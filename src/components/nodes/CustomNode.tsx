import React, { useState, useCallback } from 'react';
import type { NodeProps } from '@xyflow/react';
import Modal from '../Modal';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

type FileSourceData = {
  fileName: string;
  filePath: string;
  onDelete: (id: string) => void;
};

const FileSourceNode: React.FC<NodeProps<FileSourceData>> = ({ id, data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result;
          if (typeof text === 'string') {
            parseCSV(text, ';'); // Używamy średnika jako separatora
          }
        };
        reader.readAsText(file);
      } else {
        alert('Proszę przeciągnąć plik CSV.');
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result;
          if (typeof text === 'string') {
            parseCSV(text, ';'); // Używamy średnika jako separatora
          }
        };
        reader.readAsText(file);
      } else {
        alert('Proszę wybrać plik CSV.');
      }
    }
  };

  const parseCSV = (csv: string, delimiter: string = ',') => {
    const lines = csv.split('\n').filter((line) => line.trim() !== '');
    if (lines.length === 0) {
      alert('Plik CSV jest pusty.');
      return;
    }

    const headers = lines[0].split(delimiter).map(header => header.trim());

    const parsedColumns: GridColDef[] = headers.map((header) => ({
      field: header,
      headerName: header,
      width: 150,
      flex: 1, // Umożliwia elastyczne dostosowanie szerokości kolumn
    }));

    const parsedRows = lines.slice(1).map((line, index) => {
      const values = line.split(delimiter);
      const row: any = { id: index + 1 }; // Unikalny ID dla każdego wiersza
      headers.forEach((header, i) => {
        row[header] = values[i]?.trim() || ''; // Przypisanie wartości do odpowiednich kolumn
      });
      return row;
    });

    setColumns(parsedColumns);
    setTableData(parsedRows);
  };

  return (
    <div style={nodeStyle}>
      <div style={infoContainerStyle}>
        <div><strong>Nazwa pliku:</strong> {data.fileName}</div>
        <div><strong>Ścieżka:</strong> {data.filePath}</div>
      </div>
      <div style={buttonsContainerStyle}>
        <button onClick={() => data.onDelete(id)} style={deleteButtonStyle}>
          Usuń
        </button>
        <button onClick={openModal} style={uploadButtonStyle}>
          Upload CSV
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div style={modalContentStyle}>
          <h2>Przeciągnij i upuść plik CSV</h2>
          <div
            style={{
              ...dropAreaStyle,
              borderColor: dragActive ? '#2196F3' : '#ccc',
              backgroundColor: dragActive ? '#f0f8ff' : '#fafafa',
            }}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              id={`file-input-${id}`}
              onChange={handleFileSelect}
            />
            <label htmlFor={`file-input-${id}`} style={fileInputLabelStyle}>
              Wybierz plik
            </label>
            {!tableData.length && (
              <p style={{ marginTop: '10px' }}>
                Przeciągnij plik CSV tutaj lub kliknij "Wybierz plik" aby uploadować.
              </p>
            )}
          </div>
          {tableData.length > 0 && (
            <div style={dataGridContainerStyle}>
              <DataGrid
                rows={tableData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                autoHeight
                disableSelectionOnClick
              />
              <button onClick={closeModal} style={closeButtonStyle}>
                Zamknij
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

// Aktualizowane Style dla Lepszej Layout i Responsywności
const nodeStyle: React.CSSProperties = {
  padding: '15px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#fff',
  position: 'relative',
  width: '250px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

const infoContainerStyle: React.CSSProperties = {
  marginBottom: '15px',
};

const buttonsContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '10px',
};

const deleteButtonStyle: React.CSSProperties = {
  padding: '8px 12px',
  background: '#f44336',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  flex: 1,
};

const uploadButtonStyle: React.CSSProperties = {
  padding: '8px 12px',
  background: '#2196F3',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  flex: 1,
};

const modalContentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  width: '100%',
};

const dropAreaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '150px',
  border: '2px dashed #ccc',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.3s, background-color 0.3s',
};

const fileInputLabelStyle: React.CSSProperties = {
  padding: '8px 16px',
  background: '#4CAF50',
  color: '#fff',
  borderRadius: '4px',
  cursor: 'pointer',
  textAlign: 'center',
};

const dataGridContainerStyle: React.CSSProperties = {
  marginTop: '20px',
  width: '100%',
  height: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const closeButtonStyle: React.CSSProperties = {
  padding: '8px 12px',
  background: '#f44336',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  alignSelf: 'flex-end',
};

export default FileSourceNode;
