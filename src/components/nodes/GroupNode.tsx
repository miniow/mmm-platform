// src/components/nodes/GroupNode.tsx
import React, { useState, useEffect, useContext } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import Modal from '../Modal';
import '../../styles/Nodes.scss'; // Upewnij się, że ścieżka jest poprawna
import { DataContext } from '../../context/DataContext';

type GroupNodeData = {
  onDelete: (id: string) => void;
  type?: "group";
};

const GroupNode: React.FC<NodeProps<GroupNodeData>> = ({ id, data }) => {
  const { tableData, setTableData, columns } = useContext(DataContext)!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupColumns, setGroupColumns] = useState<string[]>([]);
  const [aggregations, setAggregations] = useState<{ [key: string]: string }>({});
  const [groupedData, setGroupedData] = useState<any[]>([]);

  useEffect(() => {
    if (groupColumns.length > 0 && data.input) {
      performGrouping(data.input, groupColumns, aggregations);
    }
  }, [data.input, groupColumns, aggregations]);

  const performGrouping = (inputData: any[], groupCols: string[], aggs: { [key: string]: string }) => {
    const grouped = inputData.reduce((acc, item) => {
      const key = groupCols.map(col => item[col]).join(' | ');
      if (!acc[key]) {
        acc[key] = { ...item };
        groupCols.forEach(col => delete acc[key][col]);
        // Initialize aggregation fields
        Object.keys(aggs).forEach(col => {
          acc[key][col] = 0;
        });
      }
      Object.keys(aggs).forEach(col => {
        switch (aggs[col]) {
          case 'sum':
            acc[key][col] += Number(item[col]) || 0;
            break;
          case 'average':
            acc[key][col] += Number(item[col]) || 0;
            acc[key][`${col}_count`] = (acc[key][`${col}_count`] || 0) + 1;
            break;
          case 'count':
            acc[key][col] = (acc[key][col] || 0) + 1;
            break;
          default:
            break;
        }
      });
      return acc;
    }, {} as { [key: string]: any });

    const result = Object.values(grouped).map(group => {
      Object.keys(aggregations).forEach(col => {
        if (aggregations[col] === 'average' && group[`${col}_count`]) {
          group[col] = group[col] / group[`${col}_count`];
          delete group[`${col}_count`];
        }
      });
      return group;
    });

    setGroupedData(result);
    setTableData(result);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setGroupColumns(selected);
  };

  const handleAggregationChange = (col: string, agg: string) => {
    setAggregations(prev => ({ ...prev, [col]: agg }));
  };

  return (
    <>
      <Handle type="target" position={Position.Left} id="input" />
      <Handle type="source" position={Position.Right} id="output" />
      <div className="node group-node">
        <div className="node-title">Group Data</div>
        <div className="node-buttons">
          <button onClick={() => data.onDelete(id)} className="node-button delete-button">
            Usuń
          </button>
          <button onClick={openModal} className="node-button config-button">
            Konfiguruj
          </button>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>Konfiguracja Grupowania</h2>
          <div className="form-group">
            <label>Kolumny Grupowania:</label>
            <select
              multiple
              value={groupColumns}
              onChange={handleGroupChange}
              className="form-select"
            >
              {columns.map((col) => (
                <option key={col.field} value={col.field}>{col.headerName}</option>
              ))}
            </select>
          </div>
          {groupColumns.length > 0 && (
            <div className="form-group">
              <label>Agregacje:</label>
              {columns.filter(col => !groupColumns.includes(col.field)).map((col) => (
                <div key={col.field} className="aggregation-row">
                  <span>{col.headerName}:</span>
                  <select
                    value={aggregations[col.field] || ''}
                    onChange={(e) => handleAggregationChange(col.field, e.target.value)}
                    className="aggregation-select"
                  >
                    <option value="">-- Wybierz --</option>
                    <option value="sum">Sum</option>
                    <option value="average">Average</option>
                    <option value="count">Count</option>
                  </select>
                </div>
              ))}
            </div>
          )}
          <button onClick={closeModal} className="submit-button">Zastosuj</button>
        </Modal>
      </div>
    </>
  );
};

export default GroupNode;
