import React, { useState, useCallback } from 'react';
import ReactFlow, { addEdge, Background, Controls, MiniMap, Node, Connection, Edge, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import CustomInputNode from '../components/CustomInputNode';
import '../styles/EtlFlow.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const nodeTypes = { customInput: CustomInputNode };

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'customInput',
        position: { x: 250, y: 0 },
        data: { label: 'Custom Input Node' },
    },
];

const EtlFlow: React.FC = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), []);
    const onElementsRemove = useCallback((elementsToRemove) => setNodes((nds) => removeElements(elementsToRemove, nds)), []);

    const addInputNode = () => {
        const newNode = {
            id: (nodes.length + 1).toString(),
            type: 'customInput',
            position: { x: Math.random() * 250, y: Math.random() * 250 },
            data: { label: `Input Node ${nodes.length + 1}` },
        };
        setNodes((nds) => nds.concat(newNode));
    };

    return (
        <div className="etl-flow">
            <h1>ETLflow</h1>
            <button onClick={addInputNode} className="add-node-button">Add Input Node</button>
            <div className="flow-container">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onElementsRemove={onElementsRemove}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <MiniMap />
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
        </div>
    );
};

export default EtlFlow;