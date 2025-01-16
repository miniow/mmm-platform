// src/components/WorkspaceCard.tsx
import React from "react";
import { FaTrashAlt, FaStar } from 'react-icons/fa'; 
import '../styles/WorkspaceCard.scss';
import { useNavigate } from "react-router-dom";

interface WorkspaceCardProps {
    id: string;
    name: string;
    models: number;
    date: string;
    isFavorite: boolean;
    onRemove: () => void;
    onAddToFavorite: () => void;
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ id, name, models, date, isFavorite, onRemove, onAddToFavorite }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/workspace/${id}`);
    };

    return (
        <div className="workspace-card" onClick={handleCardClick}>
            <div className="workspace-card-header" onClick={(e) => e.stopPropagation()}>
                <div className="workspace-card-title">{name}</div>
                <div className="workspace-card-menu">
                    <button onClick={onRemove} title="Usuń workspace">
                        <FaTrashAlt />
                    </button>
                    <button 
                        className={`workspace-card-favorite ${isFavorite ? 'favorite' : ''}`} 
                        onClick={onAddToFavorite}
                        title={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                    >
                        <FaStar />
                    </button>
                </div>
            </div>
            <div className="workspace-card-footer">
                <div>Created</div>
                <div>{date}</div>
            </div>
            <div className="workspace-card-models">
                <div>{models} Modele</div>
            </div>
        </div>
    );
};

export default WorkspaceCard;
