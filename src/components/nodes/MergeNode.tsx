// src/components/nodes/MergeNode.tsx
import React, { useState, useEffect, useContext } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import Modal from '../Modal';
import '../../styles/Nodes.scss';
import { DataContext } from '../../context/DataContext';

type MergeNodeData = {
  onDelete: (id: string) => void;
  type?: "merge";
};

const MergeNode: React.FC<NodeProps<MergeNodeData>> = ({ id, data }) => {
  const { tableData, setTableData, columns } = useContext(DataContext)!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mergeKey, setMergeKey] = useState<string>('');
  const [mergedData, setMergedData] = useState<any[]>([]);

  useEffect(() => {
    if (mergeKey && data.input1 && data.input2) {
      performMerge(data.input1, data.input2, mergeKey);
    }
  }, [data.input1, data.input2, mergeKey]);

  const performMerge = (data1: any[], data2: any[], key: string) => {
    const merged = data1.map(item1 => {
      const matchingItem = data2.find(item2 => item2[key] === item1[key]);
      return { ...item1, ...matchingItem };
    });
    setMergedData(merged);
    setTableData(merged);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Handle type="target" position={Position.Left} id="input1" />
      <Handle type="target" position={Position.Left} id="input2" />
      <Handle type="source" position={Position.Right} id="output" />
      <div className="node merge-node">
        <div className="node-title">Merge Data</div>
        <div className="node-buttons">
          <button onClick={() => data.onDelete(id)} className="node-button delete-button">
            Usuń
          </button>
          <button onClick={openModal} className="node-button config-button">
            Konfiguruj
          </button>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>Konfiguracja Merge</h2>
          <div className="form-group">
            <label>Klucz Łączenia:</label>
            <select
              value={mergeKey}
              onChange={(e) => setMergeKey(e.target.value)}
              className="form-select"
            >
              <option value="">-- Wybierz kolumnę --</option>
              {columns.map((col) => (
                <option key={col.field} value={col.field}>{col.headerName}</option>
              ))}
            </select>
          </div>
          <button onClick={closeModal} className="submit-button">Zastosuj</button>
        </Modal>
      </div>
    </>
  );
};

export default MergeNode;
