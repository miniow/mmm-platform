import React, { useState } from 'react';
import '../styles/FileUploadForm.scss'

interface DatabaseFormProps {
    onClose: () => void;
}

const DatabaseForm: React.FC<DatabaseFormProps> = ({ onClose }) => {
    const [connectionString, setConnectionString] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

    const testConnection = () => {
        // Simulate a connection test
        setConnectionStatus('Connection successful');
    };

    return (
        <div className="database-form">
            <h2>Database Connection</h2>
            <div>
                <label>Connection String:</label>
                <input
                    type="text"
                    value={connectionString}
                    onChange={(e) => setConnectionString(e.target.value)}
                />
            </div>
            <button onClick={testConnection}>Test Connection</button>
            {connectionStatus && <p>{connectionStatus}</p>}
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default DatabaseForm;