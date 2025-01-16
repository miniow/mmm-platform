import React from 'react';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className="about-section">
  <h2>{t('aboutTitle')}</h2>
  <p className="footer-info">
        {t('PBSystemInfo')}
      </p>
</section>
  );
};

export default About;