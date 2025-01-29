// src/pages/DataFlow.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  FitViewOptions,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  NodeTypes,
  EdgeTypes,
  DefaultEdgeOptions,
  Background,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import FileSourceNode from './nodes/FileSourceNode';
import FinalNode from './nodes/FinalNode'; 
import DataModifierNode from './nodes/DataModifierNode';
import FilterNode from './nodes/FilterNode';
import NodePalette from '../components/NodePalette'; // Importowanie NodePalette
import api from '../api'; 
import { AddDataFlowDto, DataPipeline, FlowData } from '../types';
import { useParams } from 'react-router-dom';
import '../styles/Nodes.scss'; // Importowanie stylów

interface DataFlowProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const nodeTypes: NodeTypes = {
  fileSource: FileSourceNode,
  dataModifier: DataModifierNode,
  finalNode: FinalNode,
  filter: FilterNode,

};

const edgeTypes: EdgeTypes = {};

const DataFlow: React.FC<DataFlowProps> = ({ initialNodes = [], initialEdges = [] }) => {
  const { id: pipelineId } = useParams<{ id: string }>();

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Zarządzanie unikalnymi ID za pomocą useRef
  const idCounterRef = React.useRef<number>(initialNodes.length + 1);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [],
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    },
    [],
  );

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onDelete: handleDeleteNode,
        },
      })),
    );
  }, [handleDeleteNode]);

  const handleAddNode = useCallback((type: string) => {
    const newNode: Node = {
      id: idCounterRef.current.toString(),
      data: { label: `${type} ${idCounterRef.current}`, onDelete: handleDeleteNode, pipelineId },
      position: { x: Math.random() * 250 + 250, y: Math.random() * 250 },
      type: type as keyof NodeTypes,
    };
    setNodes((nds) => [...nds, newNode]);
    idCounterRef.current += 1;
  }, [handleDeleteNode, pipelineId]);

  const serializeFlowData = (nodes: Node[], edges: Edge[]): string => {
    const flowData: FlowData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        data: node.data,
        position: node.position,
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
      })),
    };
    return JSON.stringify(flowData);
  };

  const deserializeFlowData = (flowData: FlowData): { nodes: Node[]; edges: Edge[] } => {
    const nodes: Node[] = flowData.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      data: node.data,
      position: node.position,
    }));
  
    const edges: Edge[] = flowData.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type || 'default', 
    }));
  
    return { nodes, edges };
  };

  useEffect(() => {
    const fetchFlowData = async () => {
      try {
        if (!pipelineId || pipelineId === 'undefined') {
          throw new Error('Invalid pipelineId');
        }
  
        const response = await api.get(`/api/datapipelines/${pipelineId}/flow`);
        console.log('Response data:', response.data);
        console.log('response.data typeof:', typeof response.data);
        console.log('response.data.nodes:', response.data.nodes);
        console.log('response.data.edges:', response.data.edges);
        // Bez parsowania, bo dane są już obiektem
        const { nodes, edges } = deserializeFlowData(response.data);
  
        setNodes(nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            onDelete: handleDeleteNode,
          },
        })));
  
        setEdges(edges);
        idCounterRef.current = nodes.length + 1; // Aktualizacja idCounter na podstawie pobranych węzłów
      } catch (error) {
        console.error('Error fetching flow data:', error);
        setError('Failed to load DataFlow.');
      }
    };
  
    fetchFlowData();
  }, [pipelineId, handleDeleteNode]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      console.log('Pipeline ID:', pipelineId); 
      if (!pipelineId || pipelineId === 'undefined') {
        throw new Error('Invalid pipelineId');
      }

      const dataFlowJson = serializeFlowData(nodes, edges);
      const dto: AddDataFlowDto = { id: pipelineId, dataFlowJson };
      const response = await api.post<DataPipeline>('/api/datapipelines/dataflow', dto);
      console.log('Flow został zaktualizowany pomyślnie:', response.data);
      alert('Flow został zapisany pomyślnie.');
    } catch (error: any) {
      console.error('Error saving DataFlow:', error);
      setError('Failed to save DataFlow.');
      alert('Failed to save DataFlow.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="data-flow-container">
      <NodePalette onAddNode={handleAddNode} />
      <div className="flow-wrapper">
        <div className="flow-controls">
          <button onClick={handleSave} className="save-button" disabled={saving}>
            {saving ? 'Zapisuję...' : 'Zapisz'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
        <div className="react-flow-wrapper">
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            edges={edges}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            fitViewOptions={fitViewOptions}
            defaultEdgeOptions={defaultEdgeOptions}
          >
            <Background />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default DataFlow;
