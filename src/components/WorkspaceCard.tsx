// src/components/WorkspaceCard.tsx
import React from "react";
import { FaTrashAlt, FaStar } from 'react-icons/fa'; 
import '../styles/WorkspaceCard.scss';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- Import hooka i18n
import { format, isValid } from "date-fns";

interface WorkspaceCardProps {
  id: string;
  name: string;
  date: string;
  isFavorite: boolean;
  onRemove: () => void;
  onAddToFavorite: () => void;
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  id,
  name,
  date,
  isFavorite,
  onRemove,
  onAddToFavorite
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // <-- używamy hooka

  // Kliknięcie w całą kartę przenosi do workspace
  const handleCardClick = () => {
    navigate(`/workspace/${id}`);
  };

  // Zatrzymujemy propagację eventu, gdy klikamy w przyciski usuwania/ulubionych,
  // aby nie otwierały workspace (handleCardClick).
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  const formatDate = (date: string | Date | null): string => {
    if (!date) return "Nieprawidłowa data";
  
    let parsedDate: Date;
  
    if (typeof date === "string") {
      // Jeżeli mamy zapis '2025-01-24 22:00:40.0653874'
      // to zamieniamy spację na 'T': '2025-01-24T22:00:40.0653874'
      if (!date.includes("T")) {
        date = date.replace(" ", "T");
      }
  
      parsedDate = new Date(date);
    } else {
      // Jeżeli już jest obiektem Date
      parsedDate = new Date(date);
    }
    if (!isValid(parsedDate)) return "Nieprawidłowa data";
  
    // Format 'yyyy-MM-dd HH:mm:ss' (date-fns)
    return format(parsedDate, "yyyy-MM-dd HH:mm:ss");
  };
  return (
    <div className="workspace-card" onClick={handleCardClick}>
      <div className="workspace-card-header" onClick={stopPropagation}>
        <div className="workspace-card-title">{name}</div>
        <div className="workspace-card-menu">
          <button 
            onClick={onRemove} 
            title={t('workspaceRemoveTitle')}
          >
            <FaTrashAlt />
          </button>
          <button
            className={`workspace-card-favorite ${isFavorite ? 'favorite' : ''}`}
            onClick={onAddToFavorite}
            title={
              isFavorite 
                ? t('workspaceRemoveFavoriteTitle')
                : t('workspaceAddFavoriteTitle')     
            }
          >
            <FaStar />
          </button>
        </div>
      </div>
      <div className="workspace-card-footer">
        <div>{t('workspaceCreatedLabel')}</div>
        <div>{formatDate(date)}</div>
      </div>
    </div>
  );
};

export default WorkspaceCard;
