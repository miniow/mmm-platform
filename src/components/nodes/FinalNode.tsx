// src/components/nodes/FinalNode.tsx
import React, { useContext, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { DataContext } from '../../context/DataContext';
import { DataGrid } from '@mui/x-data-grid';
import api from '../../api'; // Zakładamy, że tu masz instancję Axios
import Modal from '../Modal'; // Upewnij się, że masz komponent Modal
import '../../styles/Nodes.scss'; // Importowanie stylów

type FinalNodeData = {
  onDelete: (id: string) => void;
  pipelineId: string; // teraz pipelineId jest wymagane
};

const FinalNode: React.FC<NodeProps<FinalNodeData>> = ({ id, data }) => {
  const { tableData, columns } = useContext(DataContext)!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingToWarehouse, setSavingToWarehouse] = useState(false);

  const handleSaveToWarehouse = async () => {
    if (!data.pipelineId) {
      alert('Brak pipelineId - nie można zapisać do hurtowni danych.');
      return;
    }

    setSavingToWarehouse(true);
    try {
      const payload = {
        id: data.pipelineId,    // przekazujemy ID pipeline
        rows: tableData,
        columns: columns.map(c => c.field),
      };

      await api.post('/api/datapipelines/saveDataToWarehouse', payload);
      alert('Dane zostały zapisane w hurtowni danych.');
    } catch (error) {
      console.error('Błąd podczas zapisu do hurtowni:', error);
      alert('Błąd podczas zapisywania do hurtowni danych.');
    } finally {
      setSavingToWarehouse(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Handle type="target" position={Position.Left} id="in" />
      <div className="node final-node">
        <div className="node-title">Hurtownia danych</div>
        <div className="node-buttons">
        <button onClick={() => data.onDelete(id)} className="node-button delete-button">
          Usuń
        </button>
        <button onClick={openModal} className="node-button view-data-button">Konfiguruj</button>
        </div>
     

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h2>Podgląd Danych</h2>
          <div className="data-grid-container">
            <DataGrid
              rows={tableData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
            />
          </div>
          <button
            onClick={handleSaveToWarehouse}
            className="submit-button"
            disabled={savingToWarehouse}
          >
            {savingToWarehouse ? 'Zapisuję...' : 'Zapisz'}
          </button>
        </Modal>
      </div>
    </>
  );
};

export default FinalNode;
