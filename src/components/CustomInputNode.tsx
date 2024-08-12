import React, { useState } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "reactflow";
import '../styles/CustomNode.scss'
import Modal from "./Modal";
import FileUploadForm from '../forms/FileUploadForm';
import DatabaseForm from '../forms/DatabaseForm';
interface CustomInputNodeProps {
    isFinishNode: boolean,
}
const CustomInputNode: React.FC<NodeProps> = ({ id, data }) => {
    const [showFileModal, setShowFileModal] = useState(false);
    const [showDatabaseModal, setShowDatabaseModal] = useState(false);
    const [sourceSelected, setSourceSelected] = useState(false);
    const [showToolbar, setShowToolbar] = useState(false);
    const { setNodes } = useReactFlow();

    const removeNode = () => {
        setNodes((nds) => nds.filter((node) => node.id !== id));
    };

    const handleFileSelect = () => {
        setSourceSelected(true);
        setShowFileModal(true);
    };

    const handleDatabaseSelect = () => {
        setSourceSelected(true);
        setShowDatabaseModal(true);
    };

    const handleNodeClick = () => {
        if (!sourceSelected) {
            setShowToolbar(true);
        }
    };

    return (
        <div className="custom-input-node" onClick={handleNodeClick}>
            {showToolbar && !sourceSelected && (
                <div className="custom-input-toolbar">
                    <button onClick={handleFileSelect}>File</button>
                    <button onClick={handleDatabaseSelect}>Database</button>
                </div>
            )}
            <button className="custom-input-remove" onClick={removeNode}>✖</button>
            <Handle type="source" position={Position.Bottom} id="a" />
            <Modal isOpen={showFileModal} onClose={() => setShowFileModal(false)}>
                <FileUploadForm onClose={() => setShowFileModal(false)} />
            </Modal>
            <Modal isOpen={showDatabaseModal} onClose={() => setShowDatabaseModal(false)}>
                <DatabaseForm onClose={() => setShowDatabaseModal(false)} />
            </Modal>
        </div>
    );
};

export default CustomInputNode;