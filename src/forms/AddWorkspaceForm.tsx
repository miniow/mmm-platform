// src/components/AddWorkspaceForm.tsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/AddWorkspaceForm.scss';

interface AddWorkspaceFormProps {
    onAddWorkspace: (name: string, dataPipelineId?: string) => void;
}

interface DataPipeline {
    id: string;
    name: string;
    userId: string;
}

const AddWorkspaceForm: React.FC<AddWorkspaceFormProps> = ({ onAddWorkspace }) => {
    const [name, setName] = useState('');
    const [pipelines, setPipelines] = useState<DataPipeline[]>([]);
    const [selectedPipeline, setSelectedPipeline] = useState<string>('');
    const [isCreatingPipeline, setIsCreatingPipeline] = useState<boolean>(false);
    const [newPipelineName, setNewPipelineName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchPipelines = async () => {
            try {
                const response = await api.get<DataPipeline[]>('/api/DataPipelines');
                console.log("Fetched pipelines from backend:", response.data); 
                setPipelines(response.data);
            } catch (err) {
                console.error("Failed to fetch data pipelines:", err);
                setError("Failed to load data pipelines.");
            }
        };
        fetchPipelines();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let pipelineId: string | undefined = selectedPipeline;

            if (isCreatingPipeline) {
                console.log("Creating new pipeline with name:", newPipelineName);
                // Tworzenie nowego DataPipeline
                const pipelineResponse = await api.post('/api/DataPipelines', { 
                    name: newPipelineName, 
                    userId: "currentUser" 
                });
                console.log("New pipeline returned from backend:", pipelineResponse.data);

                const newPipeline: DataPipeline = pipelineResponse.data;
                pipelineId = newPipeline.id;
            }

            console.log("Creating workspace with name:", name, "and pipelineId:", pipelineId);
            // Tworzenie nowego Workspace z powiązanym DataPipeline
            await onAddWorkspace(name, pipelineId);

            // Resetowanie formularza po sukcesie
            setName('');
            setSelectedPipeline('');
            setNewPipelineName('');
            setIsCreatingPipeline(false);

        } catch (err) {
            console.error("Failed to add workspace:", err);
            setError("Failed to add workspace. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="add-workspace-form" onSubmit={handleSubmit}>
            <h2>Add New Workspace</h2>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
                <label htmlFor="workspaceName">Workspace Name:</label>
                <input 
                    type="text" 
                    id="workspaceName" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    placeholder="Enter workspace name"
                />
            </div>

            <div className="form-group">
                <label>Data Pipeline:</label>
                <div className="radio-group">
                    <label>
                        <input 
                            type="radio" 
                            name="pipelineOption" 
                            value="select" 
                            checked={!isCreatingPipeline} 
                            onChange={() => setIsCreatingPipeline(false)} 
                        />
                        Select Existing Pipeline
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="pipelineOption" 
                            value="create" 
                            checked={isCreatingPipeline} 
                            onChange={() => setIsCreatingPipeline(true)} 
                        />
                        Create New Pipeline
                    </label>
                </div>

                {!isCreatingPipeline ? (
                    <div className="select-pipeline">
                        <select 
                            value={selectedPipeline} 
                            onChange={(e) => setSelectedPipeline(e.target.value)}
                            required
                        >
                            <option value="">-- Select Existing Pipeline --</option>
                            {pipelines.map(pipeline => (
                                <option key={pipeline.id} value={pipeline.id}>
                                    {pipeline.name}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="create-pipeline">
                        <input 
                            type="text" 
                            value={newPipelineName} 
                            onChange={(e) => setNewPipelineName(e.target.value)} 
                            required 
                            placeholder="Enter new pipeline name"
                        />
                    </div>
                )}
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Workspace'}
            </button>
        </form>
    );
};

export default AddWorkspaceForm;
