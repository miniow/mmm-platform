import React, { useState } from "react";
import WorkspaceCard from "../components/WorkspaceCard";
import AddWorkspaceForm from "../forms/AddWorkspaceForm";
import Modal from "../components/Modal";
import '../styles/Workspaces.scss'

interface Workspace {
    name: string;
    models: number;
    date: string;
}

const Workspaces: React.FC = () => {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([
        { name: 'Name', models: 0, date: '20 Jul 2024' },
        { name: 'Name', models: 0, date: '20 Jul 2024' },
        { name: 'Name', models: 0, date: '20 Jul 2024' },
        { name: 'Name', models: 0, date: '20 Jul 2024' },
        { name: 'Name', models: 0, date: '20 Jul 2024' },
    ]);

    const [showForm, setShowForm] = useState(false);

    const addWorkspace = (name: string, models: number, date: string) => {
        setWorkspaces([...workspaces, { name, models, date }]);
        setShowForm(false);
    };

    const removeWorkspace = (index: number) => {
        setWorkspaces(workspaces.filter((_, i) => i !== index));
    };

    return (
        <div className="workspaces">
            <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
                <AddWorkspaceForm onAddWorkspace={addWorkspace} />
            </Modal>
            <div className="workspace-grid">
                <button className="workspace-add" onClick={() => setShowForm(true)}>
                    <div className="workspace-add-icon">+</div>
                </button>
                {workspaces.map((workspace, index) => (
                    <WorkspaceCard
                        key={index}
                        name={workspace.name}
                        models={workspace.models}
                        date={workspace.date}
                        onRemove={() => removeWorkspace(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Workspaces;