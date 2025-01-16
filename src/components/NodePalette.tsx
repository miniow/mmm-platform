// src/components/NodePalette.tsx
import React from 'react';
import '../styles/Nodes.scss'; // Importowanie stylów
import { 
  FaFileCsv, 
  FaCogs, 
  FaDatabase, 
  FaFilter, 
  FaLayerGroup, 
  FaProjectDiagram, 
  FaSave 
} from 'react-icons/fa';
import { MdMergeType } from 'react-icons/md';

interface NodePaletteProps {
  onAddNode: (type: string) => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  return (
    <div className="node-palette">
      
      {/* Sekcja Źródła */}
      <div className="palette-section">
        <h3 className="section-title">Źródła</h3>
        <div className="node-item" onClick={() => onAddNode('fileSource')}>
          <FaFileCsv className="node-icon" />
          <span>CSV Source</span>
        </div>
        {/* Dodaj inne źródła tutaj */}
      </div>
      
      {/* Sekcja Operacje */}
      <div className="palette-section">
        <h3 className="section-title">Operacje</h3>
        <div className="node-item" onClick={() => onAddNode('dataModifier')}>
          <FaCogs className="node-icon" />
          <span>Data Modifier</span>
        </div>
        {/* <div className="node-item" onClick={() => onAddNode('merge')}>
          <MdMergeType className="node-icon" />
          <span>Merge</span>
        </div>
        <div className="node-item" onClick={() => onAddNode('append')}>
          <FaDatabase className="node-icon" />
          <span>Append</span>
        </div> */}
        <div className="node-item" onClick={() => onAddNode('filter')}>
          <FaFilter className="node-icon" />
          <span>Filter</span>
        </div>
        {/* <div className="node-item" onClick={() => onAddNode('group')}>
          <FaProjectDiagram className="node-icon" />
          <span>Group</span>
        </div> */}
      </div>
      
      {/* Sekcja Docelowe */}
      <div className="palette-section">
        <h3 className="section-title">Docelowe</h3>
        <div className="node-item" onClick={() => onAddNode('finalNode')}>
          <FaSave className="node-icon" />
          <span>Final Node</span>
        </div>
        {/* Dodaj inne docelowe węzły tutaj */}
      </div>
      
    </div>
  );
};

export default NodePalette;
