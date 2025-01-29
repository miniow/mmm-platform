// src/components/LanguageSwitcher.tsx
import React from 'react';
import Select, { SingleValue, ActionMeta } from 'react-select';
import { useTranslation } from 'react-i18next';
import '../styles/LanguageSwitcher.scss';

// Import plików graficznych
import plFlag from '../assets/flags/pl.png';
import enFlag from '../assets/flags/en.png';

interface OptionType {
  value: string;
  label: string;
  flag: string; // ścieżka do grafiki
}

const options: OptionType[] = [
  { value: 'pl', label: 'Polski', flag: plFlag },
  { value: 'en', label: 'English', flag: enFlag },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleChange = (
    selectedOption: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    if (selectedOption) {
      i18n.changeLanguage(selectedOption.value);
    }
  };

  const currentLanguage = options.find(
    (option) => option.value === (i18n.language || 'en')
  );

  // Dzięki formatOptionLabel możemy inaczej wyświetlać
  // wybraną wartość i inaczej listę rozwijaną.
  const formatOptionLabel = (
    option: OptionType,
    { context }: { context: 'menu' | 'value' }
  ) => {
    if (context === 'menu') {
      // W menu: flaga + nazwa języka
      return (
        <div className="option">
          <img src={option.flag} alt={`${option.label} flag`} className="flag-image" />

        </div>
      );
    } else {
      // Dla już wybranej wartości – np. samo kółko z flagą
      return (
        <div className="option-selected">
          <img src={option.flag} alt={`${option.label} flag`} className="flag-image" />
        </div>
      );
    }
  };

  return (
    <div className="language-switcher">
      <Select
        value={currentLanguage}
        onChange={handleChange}
        options={options}
        isSearchable={false}
        className="language-select"
        classNamePrefix="react-select"
        formatOptionLabel={formatOptionLabel}
      />
    </div>
  );
};

export default LanguageSwitcher;
