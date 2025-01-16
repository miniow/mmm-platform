// src/components/admin/UserEdit.tsx
import React, { useEffect, useState } from 'react';
import api from '../../api';
import '../../styles/AdminPanel.scss';

interface UserEditProps {
  userId: string;
  onBack: () => void;
}

const UserEdit: React.FC<UserEditProps> = ({ userId, onBack }) => {
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/admin/users/${userId}`);
      setUser(response.data);
      setRoles(response.data.roles);
    } catch (err: any) {
      console.error('Błąd podczas pobierania danych użytkownika:', err);
      setError(err.response?.data?.message || 'Nie udało się pobrać danych użytkownika.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRoles = async () => {
    try {
      const response = await api.get('/api/admin/roles');
      setAvailableRoles(response.data);
    } catch (err: any) {
      console.error('Błąd podczas pobierania dostępnych ról:', err);
      setError('Nie udało się pobrać dostępnych ról.');
    }
  };

  useEffect(() => {
    fetchUser();
    fetchAvailableRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleRoleChange = (role: string) => {
    if (roles.includes(role)) {
      setRoles(roles.filter(r => r !== role));
    } else {
      setRoles([...roles, role]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/api/admin/users/${userId}/roles`, roles);
      onBack(); // Powrót do szczegółów użytkownika po aktualizacji
    } catch (err: any) {
      console.error('Błąd podczas aktualizacji ról:', err);
      setError(err.response?.data?.message || 'Nie udało się zaktualizować ról użytkownika.');
    }
  };

  return (
    <div className="user-edit">
      <h3>Edytuj Użytkownika</h3>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Ładowanie...</p>
      ) : user ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nazwa:</label>
            <input type="text" value={user.userName} disabled />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={user.email} disabled />
          </div>
          <div className="form-group">
            <label>Role:</label>
            <div className="roles-list">
              {availableRoles.map(role => (
                <div key={role} className="role-item">
                  <input
                    type="checkbox"
                    id={role}
                    checked={roles.includes(role)}
                    onChange={() => handleRoleChange(role)}
                  />
                  <label htmlFor={role}>{role}</label>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="form-button">
            Aktualizuj Role
          </button>
          <button type="button" className="form-button back" onClick={onBack}>
            Wróć
          </button>
        </form>
      ) : (
        <p>Brak danych użytkownika.</p>
      )}
    </div>
  );
};

export default UserEdit;
