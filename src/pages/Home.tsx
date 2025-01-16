// src/components/Home.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Home.scss'; // Ensure the CSS file exists

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>{t('homeTitle')}</h1>
        <p>{t('welcomeMessage')}</p>
        <button className="cta-button">{t('learnMore')}</button>
      </header>

      <section className="features-section">
        <h2>{t('features')}</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>{t('homeFeature1Title')}</h3>
            <p>{t('homeFeature1Description')}</p>
          </div>
          <div className="feature-item">
            <h3>{t('homeFeature2Title')}</h3>
            <p>{t('homeFeature2Description')}</p>
          </div>
          <div className="feature-item">
            <h3>{t('homeFeature3Title')}</h3>
            <p>{t('homeFeature3Description')}</p>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <h2>{t('benefits')}</h2>
        <ul>
          <li>{t('benefitsItem1')}</li>
          <li>{t('benefitsItem2')}</li>
          <li>{t('benefitsItem3')}</li>
          <li>{t('benefitsItem4')}</li>
        </ul>
      </section>

      <footer className="cta-footer">
        <h2>{t('startToday')}</h2>
        <button className="cta-button">{t('contactUs')}</button>
      </footer>
    </div>
  );
}

export default Home;
