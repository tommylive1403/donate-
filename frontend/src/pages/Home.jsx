import React, { useState, useEffect } from 'react';
import { Heart, Share2, Loader2 } from 'lucide-react';
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
      </div>);

  }

  if (!data) {
    return (
      <div className="military-landing error-screen">
        <p>Помилка завантаження даних</p>
      </div>);

  }

  const progressPercent = data.totalRaised / data.goalAmount * 100;

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
              className="unit-logo" />

            <img
              src="https://customer-assets.emergentagent.com/job_combat-aid/artifacts/9eftrlt0_%D0%9D%D0%BE%D0%B2%D0%B8%D0%B9_%D1%88%D0%B5%D0%B2%D1%80%D0%BE%D0%BD_406%20%283%29.png"
              alt="Шеврон"
              className="unit-badge" />

          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <svg className="marine-anchor-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C10.89 2 10 2.89 10 4C10 4.74 10.4 5.38 11 5.73V7H10C9.45 7 9 7.45 9 8C9 8.55 9.45 9 10 9H11V10.82C8.16 11.4 6 13.92 6 17V20C6 20.55 6.45 21 7 21H8C8.55 21 9 20.55 9 20V18H10V20C10 20.55 10.45 21 11 21H13C13.55 21 14 20.55 14 20V18H15V20C15 20.55 15.45 21 16 21H17C17.55 21 18 20.55 18 20V17C18 13.92 15.84 11.4 13 10.82V9H14C14.55 9 15 8.55 15 8C15 7.45 14.55 7 14 7H13V5.73C13.6 5.38 14 4.74 14 4C14 2.89 13.11 2 12 2M12 4C12.28 4 12.5 4.22 12.5 4.5C12.5 4.78 12.28 5 12 5C11.72 5 11.5 4.78 11.5 4.5C11.5 4.22 11.72 4 12 4M12 12C14.21 12 16 13.79 16 16V16H8V16C8 13.79 9.79 12 12 12Z" />
            </svg>
            "Т-700 Логіст"
          </h1>
          <p className="hero-subtitle">Збір на бойовий важкий наземний роботизований комплекс "Т-700 Логіст" на потребу 406 ОАБр

          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        {/* Progress Section */}
        <section className="progress-section">
          <div className="progress-card">
            <div className="progress-header">
              <h2 className="section-title !font-semibold !text-center">Прогрес збору</h2>
              <div className="donor-count">
                <Heart className="heart-icon" />
                <span>{data.donorCount} донорів</span>
              </div>
            </div>
            
            <div className="amount-display">
              <div className="current-amount">
                <span className="amount-value !font-bold !text-7xl !text-center !text-[#FFFFFF]">{formatAmount(data.totalRaised)}</span>
                <span className="currency">₴</span>
              </div>
              <div className="goal-amount !font-semibold !text-lg">
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
          <h2 className=""></h2>
          
          <div className="donation-grid">
            {/* QR Code Card */}
            <div className="donation-card qr-card">
              <h3 className=""></h3>
              <div className="qr-wrapper">
                <img
                  src="/images/qr-code.png"
                  alt="QR-код для донату"
                  className="qr-code-image !my-[-88px] !rounded-[-1px]" />

              </div>
              <p className="qr-hint">Скануй QR-код для швидкої оплати</p>
            </div>

            {/* Monobank Card */}
            <div className="donation-card">
              <h3 className=""></h3>
              <div className="payment-details">
                <div className="detail-item">
                  <label className="!font-semibold !text-lg !text-center !text-[#FFFFFF]">Посилання</label>
                  <a
                    href={data.monobank.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bank-link-button">

                    <svg className="bank-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2 9V15H4V22H6V15H8V22H10V15H12V9H2M13 9V22H15V16H17V22H19V16H21V9H13M22 3H2V7H22V3Z" />
                    </svg>
                    <span className="bank-link-text !font-medium !text-3xl">Перейти до банки</span>
                    <Share2 className="arrow-icon" />
                  </a>
                </div>
                <div className="detail-item">
                  <label className="!font-semibold !text-lg !text-center !text-[#FFFFFF]">Номер картки</label>
                  <div className="detail-value clickable" onClick={() => copyToClipboard(data.monobank.cardNumber, 'card')}>
                    <span className="mono-font">{data.monobank.cardNumber}</span>
                    <span className="copy-badge !font-semibold !text-sm !text-right !text-[#FFFFFF]">{copiedField === 'card' ? '✓' : 'Копіювати'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <label className="!font-medium !text-lg !text-center !text-[#FFFFFF]">IBAN</label>
                  <div className="detail-value clickable" onClick={() => copyToClipboard(data.monobank.iban, 'iban')}>
                    <span className="mono-font">{data.monobank.iban}</span>
                    <span className="copy-badge !font-semibold !text-sm !text-right !text-[#FFFFFF]">{copiedField === 'iban' ? '✓' : 'Копіювати'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Crypto Card */}
            <div className="donation-card">
              <h3 className="card-title !font-semibold !text-xl !text-center !text-[#FFFFFF]">Крипто</h3>
              <div className="payment-details">
                <div className="detail-item">
                  <label className="!font-medium !text-base !text-left !text-[#FFFFFF]">USDT (TRC-20)</label>
                  <div className="detail-value clickable" onClick={() => copyToClipboard(data.crypto.usdt_trc20, 'crypto')}>
                    <span className="mono-font crypto-address">{data.crypto.usdt_trc20}</span>
                    <span className="copy-badge !font-semibold !text-sm !text-right !text-[#FFFFFF]">{copiedField === 'crypto' ? '✓' : 'Копіювати'}</span>
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
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram
            </a>
            <a href={data.social.facebook} target="_blank" rel="noopener noreferrer" className="social-link facebook">
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </a>
            {data.social.telegram && (
              <a href={data.social.telegram} target="_blank" rel="noopener noreferrer" className="social-link telegram">
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                Telegram
              </a>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <img 
            src="/images/footer-logo.png" 
            alt="Собаки Шукаки" 
            className="footer-logo"
          />
        </div>
      </footer>
    </div>);

};

export default Home;