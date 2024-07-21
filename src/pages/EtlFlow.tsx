import React, { useCallback, useState } from 'react';
import { ReactFlow, applyEdgeChanges, applyNodeChanges, Background, Controls, addEdge } from 'reactflow';
import { faDatabase, faFile } from '@fortawesome/free-solid-svg-icons';
import 'reactflow/dist/style.css';

const initialNodes = [
    {
        id: '1',
        data: { label: 'Hello' },
        position: { x: 0, y: 0 },
        type: 'input'
    },
    {
        id: '2',
        data: { label: 'World' },
        position: { x: 100, y: 100 },
    },
];

const initialEdges = [
];

const DataSourceNode = ({ data }) => {
    const [icon, setIcon] = useState(data.type === 'file' ? <faFile /> : <faDatabase />);

    const toggleType = () => {
        const newType = data.type === 'file' ? 'database' : 'file';
        setIcon(newType === 'file' ? <FaFile /> : <FaDatabase />);
        data.type = newType;  // Update the type in the data object
    };

    return (
        <div style={{ padding: 10, border: '1px solid #777', borderRadius: 5 }}>
            <div style={{ fontSize: 20 }}>{icon}</div>
            <button onClick={toggleType} style={{ marginTop: 10 }}>
                Toggle Type
            </button>
        </div>
    );
}
const nodeTypes = {
    custom: DataSourceNode,
};
function EtlFlow() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [],
    );
    const addNode = () => {
        const newNode = {
            id: (nodes.length + 1).toString(),
            data: { label: 'New Node', type: 'input' },
            position: { x: Math.random() * 250, y: Math.random() * 250 },
            type: 'custom'
        };
        setNodes((nds) => nds.concat(newNode));
    };

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <ReactFlow nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
            >
                <Background />
                <Controls />
            </ReactFlow>
            <button
                onClick={addNode}
                style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                    zIndex: 1,
                }}
            >
                Add Node
            </button>
        </div>
    );
}

export default EtlFlow;