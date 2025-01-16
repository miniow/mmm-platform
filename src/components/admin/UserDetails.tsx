// src/components/admin/UserDetails.tsx
import React, { useEffect, useState } from 'react';
import api from '../../api';
import '../../styles/AdminPanel.scss';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';

interface UserDetailsProps {
  userId: string;
  onEdit: () => void;
  onBack: () => void;
}

interface UserDetailsData {
  id: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  roles: string[];
}

const UserDetails: React.FC<UserDetailsProps> = ({ userId, onEdit, onBack }) => {
  const [user, setUser] = useState<UserDetailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/admin/users/${userId}`);
      setUser(response.data);
    } catch (err: any) {
      console.error('Błąd podczas pobierania danych użytkownika:', err);
      setError(err.response?.data?.message || 'Nie udało się pobrać danych użytkownika.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className="user-details-container">
      <div className="user-details-header">
        <button onClick={onBack} className="back-button">
          <FaArrowLeft /> Wróć
        </button>
        <h3>Szczegóły Użytkownika</h3>
      </div>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Ładowanie...</div>
      ) : user ? (
        <div className="user-details-card">
          <div className="user-info">
            <div className="user-field">
              <span className="field-label">ID:</span>
              <span className="field-value">{user.id}</span>
            </div>
            <div className="user-field">
              <span className="field-label">Nazwa:</span>
              <span className="field-value">{user.userName}</span>
            </div>
            <div className="user-field">
              <span className="field-label">Email:</span>
              <span className="field-value">{user.email}</span>
            </div>
            <div className="user-field">
              <span className="field-label">Potwierdzony Email:</span>
              <span className="field-value">{user.emailConfirmed ? 'Tak' : 'Nie'}</span>
            </div>
            <div className="user-field">
              <span className="field-label">Role:</span>
              <span className="field-value">{user.roles.join(', ')}</span>
            </div>
          </div>
          <div className="user-actions">
            <button onClick={onEdit} className="edit-button">
              <FaEdit /> Edytuj Użytkownika
            </button>
          </div>
        </div>
      ) : (
        <div className="no-data">Brak danych użytkownika.</div>
      )}
    </div>
  );
};

export default UserDetails;
