// src/pages/nodes/DataModifierNode.tsx
import React, { useState, useContext } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { DataContext } from '../../context/DataContext';
import Modal from '../Modal';

type DataModifierNodeData = {
  onDelete: (id: string) => void;
  type?: "modifier";
};

const DataModifierNode: React.FC<NodeProps<DataModifierNodeData>> = ({ id, data }) => {
  const { tableData, setTableData, columns } = useContext(DataContext)!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [operation, setOperation] = useState<string>('+');
  const [value, setValue] = useState<number>(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleApplyChanges = () => {
    if (!selectedColumn) {
      alert('Wybierz kolumnę do modyfikacji');
      return;
    }

    // Zmodyfikuj dane w wybranej kolumnie zgodnie z operacją
    const updatedData = tableData.map(row => {
      const currentVal = parseFloat(row[selectedColumn]) || 0;
      let newVal = currentVal;
      switch (operation) {
        case '+':
          newVal = currentVal + value;
          break;
        case '-':
          newVal = currentVal - value;
          break;
        case '*':
          newVal = currentVal * value;
          break;
        case '/':
          newVal = value !== 0 ? currentVal / value : currentVal;
          break;
      }
      return { ...row, [selectedColumn]: newVal };
    });

    setTableData(updatedData);
    closeModal();
  };

  return (
    <>
      <Handle type="target" position={Position.Left} id="in" />
      <Handle type="source" position={Position.Right} id="out" />
      <div className="node filter-node">
        <div className="node-title">Modyfikowanie Danych</div>
        <div className="node-buttons">
        <button onClick={() => data.onDelete(id)} className="node-button delete-button">
          Usuń
        </button>
        <button onClick={openModal} className="node-button config-button">
        Konfiguruj
        </button>
        </div>
        

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>Modyfikuj Kolumnę</h2>
          <div style={{ marginBottom: '10px' }}>
            <label>Kolumna:</label>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              style={selectStyle}
            >
              <option value="">-- Wybierz kolumnę --</option>
              {columns.map((col) => (
                <option key={col.field} value={col.field}>{col.field}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Operacja:</label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              style={selectStyle}
            >
              <option value="+">Dodaj</option>
              <option value="-">Odejmij</option>
              <option value="*">Pomnóż</option>
              <option value="/">Podziel</option>
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Wartość:</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              style={inputStyle}
            />
          </div>

          <button onClick={handleApplyChanges} style={actionButtonStyle}>Zastosuj</button>
        </Modal>
      </div>
    </>
  );
};

const actionButtonStyle: React.CSSProperties = {
  padding: '5px 10px',
  background: '#2196F3',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const selectStyle: React.CSSProperties = {
  marginLeft: '10px',
  padding: '5px',
};

const inputStyle: React.CSSProperties = {
  marginLeft: '10px',
  padding: '5px',
  width: '80px',
};

export default DataModifierNode;
