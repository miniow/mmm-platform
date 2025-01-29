// src/pages/Workspaces.tsx
import React, { useEffect, useState, useCallback } from "react";
import WorkspaceCard from "../components/WorkspaceCard";
import AddWorkspaceForm from "../forms/AddWorkspaceForm";
import Modal from "../components/Modal";
import api from "../api";
import "../styles/Workspaces.scss";
import { Workspace } from "../types";
import { format, isValid, parse } from "date-fns";
import { useTranslation } from "react-i18next";

const Workspaces: React.FC = () => {
  const { t } = useTranslation();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funkcja pomocnicza do formatowania daty (korzysta z t)
  const formatDateLocal = (date: string | Date | null): string => {
    if (!date) return t('workspaceInvalidDate');

    let parsedDate: Date;
    if (typeof date === "string") {
      if (!date.includes("T")) {
        date = date.replace(" ", "T");
        console.log("Adjusted date with 'T':", date);
      }

      parsedDate = new Date(date);
    } else {
      parsedDate = new Date(date);
    }



    if (!isValid(parsedDate)) {
      console.log("Invalid date after parsing!");
      return t('workspaceInvalidDate');
    }

    const finalDate = format(parsedDate, "yyyy-MM-dd HH:mm:ss");
    return finalDate;
  };

  // Funkcja pomocnicza do sortowania workspace'ów
  const sortWorkspaces = (wsArray: Workspace[]): Workspace[] => {
    return wsArray.sort((a, b) => {
      if (a.isFavorite === b.isFavorite) return 0;
      return a.isFavorite ? -1 : 1;
    });
  };

  // Pobieranie workspace'ów
  const fetchWorkspaces = async () => {
    try {
      const response = await api.get<Workspace[]>("/api/Workspace");


      const fetchedWorkspaces = response.data.map((ws) => {
        return {
          ...ws,
          isFavorite: ws.isFavorite || false,
          date: formatDateLocal(ws.createdAt),
        };
      });

      setWorkspaces(sortWorkspaces(fetchedWorkspaces));
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
      setError(t('workspaceFetchError'));
    }
  };

  // Dodawanie workspace
  const addWorkspace = async (name: string, pipelineId?: string) => {
    if (!name.trim()) {
      setError(t('workspaceNameEmpty'));
      return;
    }
    try {
      console.log("Creating new workspace with:", { name, pipelineId });

      const response = await api.post("/api/Workspace", {
        name,
        pipelineId,
        userId: "currentUser"
      });

      console.log("New workspace response:", response.data);

      const newWorkspace = {
        ...response.data,
        models: 0,
        date: formatDateLocal(response.data.createdAt),
        isFavorite: false,
      };

      console.log("New workspace after formatting date:", newWorkspace);

      setWorkspaces((prevWorkspaces) =>
        sortWorkspaces([...prevWorkspaces, newWorkspace])
      );
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add workspace:", error);
      setError(t('workspaceAddError'));
    }
  };

  // Usuwanie workspace
  const removeWorkspace = useCallback(async (id: string) => {
    try {
      console.log("Removing workspace with ID:", id);
      await api.delete(`/api/Workspace/${id}`);

      setWorkspaces((prevWorkspaces) =>
        prevWorkspaces.filter((ws) => ws.id !== id)
      );
    } catch (error) {
      console.error("Failed to remove workspace:", error);
      setError(t('workspaceRemoveError'));
    }
  }, [t]);

  // Przełączanie ulubionych
  const toggleFavorite = useCallback(async (id: string) => {
    try {
      const workspace = workspaces.find((ws) => ws.id === id);
      if (!workspace) {
        console.error("Workspace not found for ID:", id);
        return;
      }

  

      const updatedWorkspace = { ...workspace, isFavorite: !workspace.isFavorite };
      await api.put(`/api/Workspace/${id}/favorite`, updatedWorkspace);

      setWorkspaces((prevWorkspaces) => {
        const updatedWorkspaces = prevWorkspaces.map((ws) =>
          ws.id === id ? { ...ws, isFavorite: updatedWorkspace.isFavorite } : ws
        );
        return sortWorkspaces(updatedWorkspaces);
      });
    } catch (error) {
      console.error("Failed to update favorite status:", error);
      setError(t('workspaceToggleFavoriteError'));
    }
  }, [workspaces, t]);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // Oddzielenie ulubionych i pozostałych workspace'ów
  const favoriteWorkspaces = workspaces.filter((ws) => ws.isFavorite);
  const otherWorkspaces = workspaces.filter((ws) => !ws.isFavorite);

  return (
    <div className="workspaces">
      {error && <div className="error">{error}</div>}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <AddWorkspaceForm onAddWorkspace={addWorkspace} />
      </Modal>

      <div className="workspace-grid">
        <button className="workspace-add" onClick={() => setShowForm(true)}>
          <div className="workspace-add-icon">+</div>
        </button>

        {/* Sekcja Ulubione */}
        {favoriteWorkspaces.length > 0 && (
          <div className="workspace-section">
            <h2>{t('workspaceFavoriteSectionTitle')}</h2>
            <div className="workspace-section-grid">
              {favoriteWorkspaces.map((workspace) => (
                <WorkspaceCard
                  key={workspace.id}
                  id={workspace.id}
                  name={workspace.name}
                  date={workspace.date}
                  isFavorite={workspace.isFavorite}
                  onRemove={() => removeWorkspace(workspace.id)}
                  onAddToFavorite={() => toggleFavorite(workspace.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sekcja Inne */}
        <div className="workspace-section">
          <h2>{t('workspaceOtherSectionTitle')}</h2>
          <div className="workspace-section-grid">
            {otherWorkspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                id={workspace.id}
                name={workspace.name}
                date={workspace.date}
                isFavorite={workspace.isFavorite}
                onRemove={() => removeWorkspace(workspace.id)}
                onAddToFavorite={() => toggleFavorite(workspace.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspaces;
