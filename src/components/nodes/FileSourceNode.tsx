// src/components/FileSourceNode.tsx
import React, { useState, useCallback, useContext } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import Modal from '../Modal';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DataContext } from '../../context/DataContext';
import '../../styles/Nodes.scss';
type FileSourceData = {
  fileName: string;
  filePath: string;
  type: "source";
  onDelete: (id: string) => void;
};

const FileSourceNode: React.FC<NodeProps<FileSourceData>> = (props) => {
  const { id, data, ...rest } = props; // Akceptuj wszystkie pozostałe propsy
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { tableData, setTableData, columns, setColumns } = useContext(DataContext)!;
  
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
            parseCSV(text, ';');
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
            parseCSV(text, ';'); 
          }
        };
        reader.readAsText(file);
      } else {
        alert('Proszę wybrać plik CSV.');
      }
    }
  };

  const parseCSV = (csv: string, delimiter: string = '\t') => {
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
      flex: 1,
    }));

    const parsedRows = lines.slice(1).map((line, index) => {
      const values = line.split(delimiter);
      const row: any = { id: index + 1 };
      headers.forEach((header, i) => {
        const value = values[i]?.trim().replace(',', '.') || '0';
        row[header] = parseFloat(value);
      });
      return row;
    });

    setColumns(parsedColumns);
    setTableData(parsedRows);
  };

  return (
    <>
      <Handle type="source" position={Position.Right} id="a" />
      <div className="node filter-node">
      <div className="node-title">Źródło CSV</div>
      <div className="node-buttons">
          <button onClick={() => data.onDelete(id)} className="node-button delete-button">
            Usuń
          </button>
          <button onClick={openModal} className="node-button config-button">
          Konfiguruj
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
    </>
  );
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
  height: '350px',
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
