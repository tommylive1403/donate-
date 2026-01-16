import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    adminPassword: '',
    totalRaised: 0,
    goalAmount: 0,
    donorCount: 0,
    monobank: {
      link: '',
      cardNumber: '',
      iban: ''
    },
    crypto: {
      usdt_trc20: ''
    },
    social: {
      instagram: '',
      facebook: '',
      telegram: ''
    }
  });

  useEffect(() => {
    fetchCurrentData();
  }, []);

  const fetchCurrentData = async () => {
    try {
      const response = await axios.get(`${API}/fundraising`);
      setFormData(prev => ({
        ...prev,
        ...response.data,
        adminPassword: '' // Keep password empty
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Помилка завантаження даних' });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'adminPassword' ? value : parseFloat(value) || value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.adminPassword) {
      setMessage({ type: 'error', text: 'Введіть пароль адміна' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await axios.put(`${API}/fundraising`, formData);
      setMessage({ type: 'success', text: 'Дані успішно оновлено!' });
      setFormData(prev => ({ ...prev, adminPassword: '' }));
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error updating data:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Помилка оновлення даних' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page loading-screen">
        <Loader2 className="loading-spinner" />
        <p>Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <button className="back-button" onClick={() => navigate('/')}>
            <ArrowLeft className="icon" />
            Назад
          </button>
          <h1 className="admin-title">Адмін-панель</h1>
        </div>

        {message && (
          <div className={`message-box ${message.type}`}>
            {message.type === 'success' ? <CheckCircle className="message-icon" /> : <XCircle className="message-icon" />}
            <span>{message.text}</span>
          </div>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>
          {/* Authentication */}
          <div className="form-section">
            <h2 className="section-title">Авторизація</h2>
            <div className="form-group">
              <label>Пароль адміна *</label>
              <input
                type="password"
                name="adminPassword"
                value={formData.adminPassword}
                onChange={handleChange}
                placeholder="Введіть пароль"
                required
              />
            </div>
          </div>

          {/* Fundraising Progress */}
          <div className="form-section">
            <h2 className="section-title">Прогрес збору</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Зібрано (₴)</label>
                <input
                  type="number"
                  name="totalRaised"
                  value={formData.totalRaised}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Мета (₴)</label>
                <input
                  type="number"
                  name="goalAmount"
                  value={formData.goalAmount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Кількість донорів</label>
                <input
                  type="number"
                  name="donorCount"
                  value={formData.donorCount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Monobank Details */}
          <div className="form-section">
            <h2 className="section-title">Monobank</h2>
            <div className="form-group">
              <label>Посилання на банку</label>
              <input
                type="url"
                name="monobank.link"
                value={formData.monobank.link}
                onChange={handleChange}
                placeholder="https://send.monobank.ua/jar/..."
                required
              />
            </div>
            <div className="form-group">
              <label>Номер картки</label>
              <input
                type="text"
                name="monobank.cardNumber"
                value={formData.monobank.cardNumber}
                onChange={handleChange}
                placeholder="5375 4141 0123 4567"
                required
              />
            </div>
            <div className="form-group">
              <label>IBAN</label>
              <input
                type="text"
                name="monobank.iban"
                value={formData.monobank.iban}
                onChange={handleChange}
                placeholder="UA123456789012345678901234567"
                required
              />
            </div>
          </div>

          {/* Crypto Details */}
          <div className="form-section">
            <h2 className="section-title">Криптовалюта</h2>
            <div className="form-group">
              <label>USDT (TRC-20)</label>
              <input
                type="text"
                name="crypto.usdt_trc20"
                value={formData.crypto.usdt_trc20}
                onChange={handleChange}
                placeholder="TXqwertyuiopasdfghjklzxcvbnm123456"
                required
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="form-section">
            <h2 className="section-title">Соціальні мережі</h2>
            <div className="form-group">
              <label>Instagram</label>
              <input
                type="url"
                name="social.instagram"
                value={formData.social.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                required
              />
            </div>
            <div className="form-group">
              <label>Facebook</label>
              <input
                type="url"
                name="social.facebook"
                value={formData.social.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                required
              />
            </div>
            <div className="form-group">
              <label>Telegram</label>
              <input
                type="url"
                name="social.telegram"
                value={formData.social.telegram || ''}
                onChange={handleChange}
                placeholder="https://t.me/..."
              />
            </div>

          </div>

          <button type="submit" className="submit-button" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="icon spinning" />
                Збереження...
              </>
            ) : (
              <>
                <Save className="icon" />
                Зберегти зміни
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
