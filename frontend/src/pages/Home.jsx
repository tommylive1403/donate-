import React, { useState, useEffect } from 'react';
import { Target, Heart, Share2, Loader2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    fetchFundraisingData();
  }, []);

  const fetchFundraisingData = async () => {
    try {
      const response = await axios.get(`${API}/fundraising`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching fundraising data:', error);
      setLoading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('uk-UA').format(amount);
  };

  if (loading) {
    return (
      <div className="military-landing loading-screen">
        <Loader2 className="loading-spinner" />
        <p>Завантаження...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="military-landing error-screen">
        <p>Помилка завантаження даних</p>
      </div>
    );
  }

  const progressPercent = (data.totalRaised / data.goalAmount) * 100;

  return (
    <div className="military-landing">
      {/* Animated Drones Background */}
      <div className="drones-container">
        <div className="drone drone-mavic"></div>
        <div className="drone drone-fpv"></div>
        <div className="drone drone-recon"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <img 
              src="https://customer-assets.emergentagent.com/job_combat-aid/artifacts/tbu1558m_%D0%91%D0%B5%D0%B7%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%28400%20x%201000%20%D0%BC%D0%BC%29%20%28%D0%92%D1%96%D0%B4%D0%B5%D0%BE%20%D0%BD%D0%B0%20Facebook%29_20260115_140001_0000.png" 
              alt="Логотип підрозділу" 
              className="unit-logo"
            />
            <img 
              src="https://customer-assets.emergentagent.com/job_combat-aid/artifacts/9eftrlt0_%D0%9D%D0%BE%D0%B2%D0%B8%D0%B9_%D1%88%D0%B5%D0%B2%D1%80%D0%BE%D0%BD_406%20%283%29.png" 
              alt="Шеврон" 
              className="unit-badge"
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <Target className="inline-icon" />
            Підтримай захисників України
          </h1>
          <p className="hero-subtitle">
            Збір коштів на критичне обладнання для підрозділу
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        {/* Progress Section */}
        <section className="progress-section">
          <div className="progress-card">
            <div className="progress-header">
              <h2 className="section-title">Прогрес збору</h2>
              <div className="donor-count">
                <Heart className="heart-icon" />
                <span>{data.donorCount} донорів</span>
              </div>
            </div>
            
            <div className="amount-display">
              <div className="current-amount">
                <span className="amount-value">{formatAmount(data.totalRaised)}</span>
                <span className="currency">₴</span>
              </div>
              <div className="goal-amount">
                Мета: {formatAmount(data.goalAmount)} ₴
              </div>
            </div>

            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progressPercent}%` }}>
                <div className="progress-shine"></div>
              </div>
              <span className="progress-percent">{progressPercent.toFixed(1)}%</span>
            </div>
          </div>
        </section>

        {/* Donation Methods */}
        <section className="donation-section">
          <h2 className="section-title">Способи допомоги</h2>
          
          <div className="donation-grid">
            {/* QR Code Card */}
            <div className="donation-card qr-card">
              <h3 className="card-title">Швидкий донат</h3>
              <div className="qr-wrapper">
                <QRCode 
                  value={data.monobank.link}
                  size={180}
                  level="H"
                  className="qr-code"
                />
              </div>
              <p className="qr-hint">Скануй QR-код для швидкої оплати</p>
            </div>

            {/* Monobank Card */}
            <div className="donation-card">
              <h3 className="card-title">Monobank</h3>
              <div className="payment-details">
                <div className="detail-item">
                  <label>Посилання</label>
                  <div className="detail-value clickable" onClick={() => window.open(data.monobank.link, '_blank')}>
                    <span className="link-text">Перейти до банки</span>
                    <Share2 className="icon" />
                  </div>
                </div>
                <div className="detail-item">
                  <label>Номер картки</label>
                  <div className="detail-value clickable" onClick={() => copyToClipboard(data.monobank.cardNumber, 'card')}>
                    <span className="mono-font">{data.monobank.cardNumber}</span>
                    <span className="copy-badge">{copiedField === 'card' ? '✓' : 'Копіювати'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <label>IBAN</label>
                  <div className="detail-value clickable" onClick={() => copyToClipboard(data.monobank.iban, 'iban')}>
                    <span className="mono-font">{data.monobank.iban}</span>
                    <span className="copy-badge">{copiedField === 'iban' ? '✓' : 'Копіювати'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Crypto Card */}
            <div className="donation-card">
              <h3 className="card-title">Криптовалюта</h3>
              <div className="payment-details">
                <div className="detail-item">
                  <label>USDT (TRC-20)</label>
                  <div className="detail-value clickable" onClick={() => copyToClipboard(data.crypto.usdt_trc20, 'crypto')}>
                    <span className="mono-font crypto-address">{data.crypto.usdt_trc20}</span>
                    <span className="copy-badge">{copiedField === 'crypto' ? '✓' : 'Копіювати'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="social-section">
          <h2 className="section-title">Слідкуй за нами</h2>
          <div className="social-links">
            <a href={data.social.instagram} target="_blank" rel="noopener noreferrer" className="social-link instagram">
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>
            <a href={data.social.facebook} target="_blank" rel="noopener noreferrer" className="social-link facebook">
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">Разом до перемоги! 🇺🇦</p>
          <p className="footer-subtext">Кожна гривня наближає нашу перемогу</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
