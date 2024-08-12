import React from "react";
import '../styles/WorkspaceCard.scss';

interface WorkspaceCardProps {
    name: string;
    models: number;
    date: string;
    onRemove: () => void;
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ name, models, date, onRemove }) => {
    return (
        <div className="workspace-card">
            <div className="workspace-card-header">
                <div className="workspace-card-title">{name}</div>
                <div className="workspace-card-menu">
                    <button onClick={onRemove}>🗑️</button>
                </div>
            </div>
            <div className="workspace-card-body">
                <div>private workspace</div>
                <div>Models: {models}</div>
            </div>
            <div className="workspace-card-footer">
                <div>{date}</div>
                <div className="workspace-card-actions">
                    <span className="workspace-card-refresh">🔄</span>
                    <span className="workspace-card-favorite">⭐</span>
                </div>
            </div>
        </div>
    );
};

export default WorkspaceCard;