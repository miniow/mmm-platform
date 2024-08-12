import React, { useState } from 'react';
import ReactFlow, { ReactFlowProvider, addEdge, Controls, Background, MiniMap } from 'react-flow-renderer';
import 'reactflow/dist/style.css';
import CustomNode from '../components/CustomNode';
import '../styles/EtlFlow.scss';

const EtlFlow: React.FC = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    const onAddNode = () => {
        const newNode = {
            id: `${nodes.length}`,
            type: 'custom',
            position: { x: Math.random() * 500, y: Math.random() * 500 },
            data: { label: 'New Node', onRemove: () => onRemoveNode(`${nodes.length}`) },
        };
        setNodes([...nodes, newNode]);
    };

    const onRemoveNode = (id) => {
        setNodes(nodes.filter((node) => node.id !== id));
    };

    const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

    return (
        <ReactFlowProvider>
            <div className="etl-flow">
                <button onClick={onAddNode}>Add Source Node</button>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onConnect={onConnect}
                    nodeTypes={{ custom: CustomNode }}
                    style={{ width: '100%', height: '90vh' }}
                >
                    <Controls />
                    <Background />
                    <MiniMap />
                </ReactFlow>
            </div>
        </ReactFlowProvider>
    );
};

export default EtlFlow;