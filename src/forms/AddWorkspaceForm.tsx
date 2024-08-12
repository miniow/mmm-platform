import React, { useState } from 'react';
import '../styles/AddWorkspaceForm.scss'

interface AddWorkspaceFormProps {
    onAddWorkspace: (name: string, models: number, date: string) => void;
}

const AddWorkspaceForm: React.FC<AddWorkspaceFormProps> = ({ onAddWorkspace }) => {
    const [name, setName] = useState('');
    const [models, setModels] = useState(0);
    const [date, setDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddWorkspace(name, models, date);
        setName('');
        setModels(0);
        setDate('');
    };

    return (
        <form className="add-workspace-form" onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Models:</label>
                <input type="number" value={models} onChange={(e) => setModels(Number(e.target.value))} required />
            </div>
            <div>
                <label>Date:</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <button type="submit">Add Workspace</button>
        </form>
    );
};

export default AddWorkspaceForm;