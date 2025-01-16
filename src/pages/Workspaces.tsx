import React, { useEffect, useState, useCallback } from "react";
import WorkspaceCard from "../components/WorkspaceCard";
import AddWorkspaceForm from "../forms/AddWorkspaceForm";
import Modal from "../components/Modal";
import api from "../api";
import "../styles/Workspaces.scss";
import { Workspace } from "../types";
import { format, isValid, parse } from "date-fns";

// Funkcja pomocnicza do formatowania daty
const formatDate = (date: string | Date | null): string => {
    if (!date) return "Nieprawidłowa data";
    
    let parsedDate: Date;
    if (typeof date === "string") {
        // Przykład: jeśli data jest w formacie 'dd-MM-yyyy HH:mm:ss'
        parsedDate = parse(date, "dd-MM-yyyy HH:mm:ss", new Date());
    } else {
        parsedDate = new Date(date);
    }
    console.log(parsedDate);
    if (!isValid(parsedDate)) return "Nieprawidłowa data";
    return format(parsedDate, "yyyy-MM-dd HH:mm:ss");
};

// Funkcja pomocnicza do sortowania workspace'ów
const sortWorkspaces = (workspaces: Workspace[]): Workspace[] => {
    return workspaces.sort((a, b) => {
        if (a.isFavorite === b.isFavorite) return 0;
        return a.isFavorite ? -1 : 1;
    });
};

const Workspaces: React.FC = () => {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pobieranie workspace'ów
    const fetchWorkspaces = async () => {
        try {
            const response = await api.get<Workspace[]>("/api/Workspace");
            console.log("API Response:", response.data); // Dodaj ten wiersz
            const fetchedWorkspaces = response.data.map((ws) => ({
                ...ws,
                isFavorite: ws.isFavorite || false,
                date: formatDate(ws.createdAt),
            }));
            setWorkspaces(sortWorkspaces(fetchedWorkspaces));
        } catch (error) {
            console.error("Failed to fetch workspaces:", error);
            setError("Nie udało się pobrać danych.");
        }
    };
    // Dodawanie workspace
    const addWorkspace = async (name: string) => {
        if (!name.trim()) {
            setError("Nazwa workspace nie może być pusta.");
            return;
        }
        try {
            const response = await api.post("/api/Workspace", { name, userId: "currentUser" });
            const newWorkspace = {
                ...response.data,
                models: 0,
                date: formatDate(response.data.createdAt), // Formatowanie daty
                isFavorite: false,
            };
            setWorkspaces((prevWorkspaces) => sortWorkspaces([...prevWorkspaces, newWorkspace]));
            setShowForm(false);
        } catch (error) {
            console.error("Failed to add workspace:", error);
            setError("Nie udało się dodać workspace.");
        }
    };

    // Usuwanie workspace
    const removeWorkspace = useCallback(async (id: string) => {
        try {
            await api.delete(`/api/Workspace/${id}`);
            setWorkspaces((prevWorkspaces) => prevWorkspaces.filter((ws) => ws.id !== id));
        } catch (error) {
            console.error("Failed to remove workspace:", error);
            setError("Nie udało się usunąć workspace.");
        }
    }, []);

    // Przełączanie ulubionych
    const toggleFavorite = useCallback(async (id: string) => {
        try {
            const workspace = workspaces.find((ws) => ws.id === id);
            if (!workspace) {
                console.error("Workspace not found");
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
            setError("Nie udało się zaktualizować statusu ulubionych.");
        }
    }, [workspaces]);

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

                {favoriteWorkspaces.length > 0 && (
                    <div className="workspace-section">
                        <h2>Ulubione</h2>
                        <div className="workspace-section-grid">
                            {favoriteWorkspaces.map((workspace) => (
                                <WorkspaceCard
                                    key={workspace.id}
                                    id={workspace.id}
                                    name={workspace.name}
                                    models={workspace.models}
                                    date={workspace.date}
                                    isFavorite={workspace.isFavorite}
                                    onRemove={() => removeWorkspace(workspace.id)}
                                    onAddToFavorite={() => toggleFavorite(workspace.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="workspace-section">
                    <h2>Inne</h2>
                    <div className="workspace-section-grid">
                        {otherWorkspaces.map((workspace) => (
                            <WorkspaceCard
                                key={workspace.id}
                                id={workspace.id}
                                name={workspace.name}
                                models={workspace.models}
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
