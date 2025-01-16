// src/components/nodes/FilterNode.tsx
import React, { useState, useEffect, useContext } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import Modal from '../Modal';
import { DataContext } from '../../context/DataContext';
import '../../styles/Nodes.scss'; // Upewnij się, że ścieżka jest poprawna

type FilterNodeData = {
  onDelete: (id: string) => void;
  type?: "filter";
};

const FilterNode: React.FC<NodeProps<FilterNodeData>> = ({ id, data }) => {
  const { tableData, setTableData, columns } = useContext(DataContext)!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [condition, setCondition] = useState<string>('equals');
  const [value, setValue] = useState<string>('');
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    if (selectedColumn && value && data.input) {
      performFilter(data.input, selectedColumn, condition, value);
    }
  }, [data.input, selectedColumn, condition, value]);

  const performFilter = (inputData: any[], column: string, condition: string, value: string) => {
    let filtered = inputData;

    switch (condition) {
      case 'equals':
        filtered = inputData.filter(item => item[column] === value);
        break;
      case 'contains':
        filtered = inputData.filter(item => item[column]?.toString().includes(value));
        break;
      case 'greater_than':
        filtered = inputData.filter(item => parseFloat(item[column]) > parseFloat(value));
        break;
      case 'less_than':
        filtered = inputData.filter(item => parseFloat(item[column]) < parseFloat(value));
        break;
      default:
        break;
    }

    setFilteredData(filtered);
    setTableData(filtered);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Handle type="target" position={Position.Left} id="input" />
      <Handle type="source" position={Position.Right} id="output" />
      <div className="node filter-node">
        <div className="node-title">Filtrowanie Danych</div>
        <div className="node-buttons">
          <button onClick={() => data.onDelete(id)} className="node-button delete-button">
            Usuń
          </button>
          <button onClick={openModal} className="node-button config-button">
            Konfiguruj
          </button>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>Konfiguracja Filtra</h2>
          <div className="form-group">
            <label>Kolumna:</label>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="form-select"
            >
              <option value="">-- Wybierz kolumnę --</option>
              {columns.map((col) => (
                <option key={col.field} value={col.field}>{col.headerName}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Warunek:</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="form-select"
            >
              <option value="equals">Równa się</option>
              <option value="contains">Zawiera</option>
              <option value="greater_than">Większe niż</option>
              <option value="less_than">Mniejsze niż</option>
            </select>
          </div>
          <div className="form-group">
            <label>Wartość:</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="form-input"
            />
          </div>
          <button onClick={closeModal} className="submit-button">Zastosuj</button>
        </Modal>
      </div>
    </>
  );
};

export default FilterNode;
