// src/pages/DataFlow.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
  type NodeTypes,
  type EdgeTypes,
  type DefaultEdgeOptions,
  Background,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import FileSourceNode from '../components/nodes/CustomNode';


let id = 3; 

const initialNodes: Node[] = [
];

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const nodeTypes: NodeTypes = {
  fileSource: FileSourceNode,
};

const edgeTypes: EdgeTypes = {
  // Dodaj niestandardowe typy krawędzi tutaj, jeśli potrzebujesz
};

const onNodeDrag: OnNodeDrag = (_, node) => {
};

const DataFlow: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    },
    [setNodes, setEdges],
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

  const handleAddNode = useCallback(() => {
    const newNode: Node = {
      id: id.toString(),
      data: { label: `Node ${id}`, number: id, text: `Text ${id}`, onDelete: handleDeleteNode },
      position: { x: Math.random() * 250, y: Math.random() * 250 },
      type: 'fileSource', 
    };
    setNodes((nds) => [...nds, newNode]);
    id += 1;
  }, [handleDeleteNode]);

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={handleAddNode} style={addButtonStyle}>
        Dodaj Węzeł
      </button>
      <div style={{ width: '80%', height: '80vh', border: '1px solid #ccc', marginTop: '10px' }}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDrag={onNodeDrag}
          fitView
          fitViewOptions={fitViewOptions}
          defaultEdgeOptions={defaultEdgeOptions}
        >
          <Background />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};

const addButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default DataFlow;
