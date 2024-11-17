import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Home.scss'; // Upewnij się, że masz odpowiedni plik CSS

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
            <h3>Analiza Danych</h3>
            <p>Przetwarzaj i analizuj duże zbiory danych marketingowych w czasie rzeczywistym.</p>
          </div>
          <div className="feature-item">
            <h3>Prognozowanie</h3>
            <p>Prognozuj przyszłe wyniki kampanii marketingowych na podstawie historycznych danych.</p>
          </div>
          <div className="feature-item">
            <h3>Optymalizacja Budżetu</h3>
            <p>Optymalizuj alokację budżetu marketingowego dla maksymalnej efektywności.</p>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <h2>{t('benefits')}</h2>
        <ul>
          <li>Precyzyjne modele predykcyjne</li>
          <li>Intuicyjny interfejs użytkownika</li>
          <li>Wsparcie ekspertów</li>
          <li>Integracja z popularnymi narzędziami marketingowymi</li>
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