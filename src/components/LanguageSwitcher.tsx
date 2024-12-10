// src/components/LanguageSwitcher.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import '../styles/LanguageSwitcher.scss'; // Importujemy plik SCSS

interface OptionType {
  value: string;
  label: string;
  flag: string;
}

const options: OptionType[] = [
  { value: 'pl', label: 'Polski', flag: '🇵🇱' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleChange = (selectedOption: OptionType | null) => {
    if (selectedOption) {
      i18n.changeLanguage(selectedOption.value);
    }
  };

  const currentLanguage = options.find(option => option.value === (i18n.language || 'en'));

  return (
    <div className="language-switcher">
      <Select
        value={currentLanguage}
        onChange={handleChange}
        options={options}
        isSearchable={false}
        className="language-select"
        classNamePrefix="react-select"
        formatOptionLabel={(option: OptionType) => (
          <div className="option">
            <span className="flag">{option.flag}</span>
            <span className="label">{option.label}</span>
          </div>
        )}
      />
    </div>
  );
};

export default LanguageSwitcher;
