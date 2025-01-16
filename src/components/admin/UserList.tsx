// src/components/admin/UserList.tsx
import React, { useEffect, useState } from 'react';
import api from '../../api';
import { FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';
import '../../styles/AdminPanel.scss';

interface User {
  id: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
}

interface UserListProps {
  onSelectUser: (id: string) => void;
}

const UserList: React.FC<UserListProps> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
    } catch (err: any) {
      console.error('Błąd podczas pobierania użytkowników:', err);
      setError(err.response?.data?.message || 'Nie udało się pobrać użytkowników.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err: any) {
      console.error('Błąd podczas usuwania użytkownika:', err);
      setError(err.response?.data?.message || 'Nie udało się usunąć użytkownika.');
    }
  };

  return (
    <div className="user-list">
      <h3>Lista Użytkowników</h3>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Ładowanie...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nazwa</th>
              <th>Email</th>
              <th>Potwierdzony Email</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td data-label="ID">{user.id}</td>
                <td data-label="Nazwa">{user.userName}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Potwierdzony Email">{user.emailConfirmed ? 'Tak' : 'Nie'}</td>
                <td data-label="Akcje" className="actions">
                  <button className="action-button details" onClick={() => onSelectUser(user.id)}>
                    <FaInfoCircle /> Szczegóły
                  </button>
                  <button className="action-button edit" onClick={() => onSelectUser(user.id)}>
                    <FaEdit /> Edytuj
                  </button>
                  <button className="action-button delete" onClick={() => handleDelete(user.id)}>
                    <FaTrash /> Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
