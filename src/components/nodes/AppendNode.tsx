// src/components/nodes/AppendNode.tsx
import React, { useState, useEffect, useContext } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import Modal from '../Modal';
import { DataContext } from '../../context/DataContext';
import '../../styles/Nodes.scss'; // Importowanie stylów

type AppendNodeData = {
  onDelete: (id: string) => void;
  type?: "append";
};

const AppendNode: React.FC<NodeProps<AppendNodeData>> = ({ id, data }) => {
  const { tableData, setTableData, columns } = useContext(DataContext)!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appendKey, setAppendKey] = useState<string>('');
  const [appendedData, setAppendedData] = useState<any[]>([]);

  useEffect(() => {
    if (appendKey && data.input1 && data.input2) {
      performAppend(data.input1, data.input2, appendKey);
    }
  }, [data.input1, data.input2, appendKey]);

  const performAppend = (data1: any[], data2: any[], key: string) => {
    const appended = [...data1, ...data2];
    setAppendedData(appended);
    setTableData(appended);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Handle type="target" position={Position.Left} id="input1" />
      <Handle type="target" position={Position.Left} id="input2" />
      <Handle type="source" position={Position.Right} id="output" />
      <div className="node append-node">
        <div className="node-title">Append Data</div>
        <div className="node-buttons">
          <button onClick={() => data.onDelete(id)} className="node-button delete-button">
            Usuń
          </button>
          <button onClick={openModal} className="node-button config-button">
            Konfiguruj
          </button>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>Konfiguracja Append</h2>
          <div className="form-group">
            <label>Klucz Doklejenia (opcjonalny):</label>
            <select
              value={appendKey}
              onChange={(e) => setAppendKey(e.target.value)}
              className="form-select"
            >
              <option value="">-- Bez klucza --</option>
              {columns.map((col) => (
                <option key={col.field} value={col.field}>{col.headerName}</option>
              ))}
            </select>
            <small>Jeśli wybierzesz klucz, dane będą doklejane na podstawie tej kolumny.</small>
          </div>
          <button onClick={closeModal} className="submit-button">Zastosuj</button>
        </Modal>
      </div>
    </>
  );
};

export default AppendNode;
