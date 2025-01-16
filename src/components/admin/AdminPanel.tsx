// src/components/admin/AdminPanel.tsx
import React, { useState } from 'react';
import '../../styles/AdminPanel.scss'; 
import UserList from './UserList';
import UserDetails from './UserDetails';
import UserEdit from './UserEdit';

type AdminSection = 'users' | 'userDetails' | 'userEdit';

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('users');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleSectionChange = (section: AdminSection, userId?: string) => {
    setActiveSection(section);
    if (userId) {
      setSelectedUserId(userId);
    } else {
      setSelectedUserId(null);
    }
  };

  return (
    <div className="admin-panel">
      <aside className="admin-sidebar">
        <h2>Panel Admina</h2>
        <nav>
          <ul>
            <li>
              <button onClick={() => handleSectionChange('users')} className="sidebar-button">
                Użytkownicy
              </button>
            </li>
            {/* Dodaj inne sekcje admina tutaj */}
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        {activeSection === 'users' && (
          <UserList onSelectUser={(id) => handleSectionChange('userDetails', id)} />
        )}
        {activeSection === 'userDetails' && selectedUserId && (
          <UserDetails 
            userId={selectedUserId} 
            onEdit={() => handleSectionChange('userEdit', selectedUserId)} 
            onBack={() => handleSectionChange('users')} 
          />
        )}
        {activeSection === 'userEdit' && selectedUserId && (
          <UserEdit 
            userId={selectedUserId} 
            onBack={() => handleSectionChange('userDetails', selectedUserId)} 
          />
        )}
        {/* Dodaj inne sekcje admina tutaj */}
      </main>
    </div>
  );
};

export default AdminPanel;
