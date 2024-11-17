import React from 'react';
import { useTranslation } from 'react-i18next';


const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
  
    // Funkcja obsługująca zmianę języka
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedLanguage = event.target.value;
      i18n.changeLanguage(selectedLanguage);
    };
  
    // Pobranie aktualnego języka
    const currentLanguage = i18n.language || 'en';
  
    return (
        <select
          id="language-select"
          value={currentLanguage}
          onChange={handleChange}
          style={{
            padding: '5px 10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >flag
          <option value="pl">pl</option>
          <option value="en">en </option>
        </select>
    );
  };
  
  export default LanguageSwitcher;