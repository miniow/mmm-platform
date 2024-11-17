// src/context/DataContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { Node, Edge } from '@xyflow/react';

interface DataContextProps {
  nodes: Node[];
  edges: Edge[];
  addNode: (node: Node) => void;
  updateNodes: (nodes: Node[]) => void;
  deleteNode: (nodeId: string) => void;
  addEdge: (edge: Edge) => void;
  updateEdges: (edges: Edge[]) => void;
}

export const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([{ id: 'e1-2', source: '1', target: '2' }]);

  const addNode = (node: Node) => setNodes(prev => [...prev, node]);
  const updateNodes = (newNodes: Node[]) => setNodes(newNodes);
  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setEdges(prev => prev.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
  };

  const addEdgeHandler = (edge: Edge) => setEdges(prev => [...prev, edge]);
  const updateEdgesHandler = (newEdges: Edge[]) => setEdges(newEdges);

  return (
    <DataContext.Provider value={{ nodes, edges, addNode, updateNodes, deleteNode, addEdge: addEdgeHandler, updateEdges: updateEdgesHandler }}>
      {children}
    </DataContext.Provider>
  );
};
