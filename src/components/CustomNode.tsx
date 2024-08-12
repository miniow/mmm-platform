import React, { useState } from 'react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';

const CustomNode: React.FC<NodeProps> = ({ data }) => {
    const [nodeState, setNodeState] = useState('new'); // initial state
    const [showMenu, setShowMenu] = useState(false); // state for context menu

    const handleStateChange = (newState) => {
        setNodeState(newState);
        setShowMenu(false); // hide menu after selection
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu); // toggle menu visibility
    };

    return (
        <div className={`custom-node ${nodeState}`}>
            <Handle type="target" position={Position.Top} />
            <div>
                {nodeState === 'new' && (
                    <>
                        <button onClick={toggleMenu}>Select Source</button>
                        {showMenu && (
                            <div className="context-menu">
                                <button onClick={() => handleStateChange('file')}>File</button>
                                <button onClick={() => handleStateChange('database')}>Database</button>
                            </div>
                        )}
                    </>
                )}
                {nodeState === 'file' && (
                    <div>
                        <span>File Source Selected</span>
                        <button onClick={() => handleStateChange('configured')}>Configure</button>
                    </div>
                )}
                {nodeState === 'database' && (
                    <div>
                        <span>Database Source Selected</span>
                        <button onClick={() => handleStateChange('configured')}>Configure</button>
                    </div>
                )}
                {nodeState === 'configured' && (
                    <div>
                        <span>Configured Node</span>
                    </div>
                )}
                <button onClick={data.onRemove}>Remove Node</button>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default CustomNode;