# API Contracts - Благодійний лендінг

## Мета
Створити backend для управління даними благодійного збору з простою адмін панеллю.

## Frontend Mock Data (mockData.js)
```javascript
{
  totalRaised: 125000,        // Зібрана сума
  goalAmount: 500000,         // Мета збору
  donorCount: 347,            // Кількість донорів
  monobank: {
    link: "https://send.monobank.ua/jar/4g2vud36xP",
    cardNumber: "5375 4141 0123 4567",
    iban: "UA123456789012345678901234567"
  },
  crypto: {
    usdt_trc20: "TXqwertyuiopasdfghjklzxcvbnm123456"
  },
  social: {
    instagram: "https://instagram.com/unit406",
    facebook: "https://facebook.com/unit406"
  }
}
```

## Backend API Endpoints

### 1. Отримати дані збору (Public)
**GET** `/api/fundraising`

**Response:**
```json
{
  "totalRaised": 125000,
  "goalAmount": 500000,
  "donorCount": 347,
  "monobank": {
    "link": "https://send.monobank.ua/jar/4g2vud36xP",
    "cardNumber": "5375 4141 0123 4567",
    "iban": "UA123456789012345678901234567"
  },
  "crypto": {
    "usdt_trc20": "TXqwertyuiopasdfghjklzxcvbnm123456"
  },
  "social": {
    "instagram": "https://instagram.com/unit406",
    "facebook": "https://facebook.com/unit406"
  },
  "updatedAt": "2026-01-15T12:00:00Z"
}
```

### 2. Оновити дані збору (Admin)
**PUT** `/api/fundraising`

**Request Body:**
```json
{
  "adminPassword": "secure_password",  // Простий пароль для авторизації
  "totalRaised": 150000,
  "goalAmount": 500000,
  "donorCount": 400,
  "monobank": {
    "link": "https://send.monobank.ua/jar/4g2vud36xP",
    "cardNumber": "5375 4141 0123 4567",
    "iban": "UA123456789012345678901234567"
  },
  "crypto": {
    "usdt_trc20": "TXqwertyuiopasdfghjklzxcvbnm123456"
  },
  "social": {
    "instagram": "https://instagram.com/unit406",
    "facebook": "https://facebook.com/unit406"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Дані успішно оновлено",
  "data": { /* updated data */ }
}
```

## Database Schema (MongoDB)

### Collection: `fundraising_data`
```javascript
{
  _id: ObjectId,
  totalRaised: Number,
  goalAmount: Number,
  donorCount: Number,
  monobank: {
    link: String,
    cardNumber: String,
    iban: String
  },
  crypto: {
    usdt_trc20: String
  },
  social: {
    instagram: String,
    facebook: String
  },
  updatedAt: Date,
  createdAt: Date
}
```

### Collection: `admin_config`
```javascript
{
  _id: ObjectId,
  passwordHash: String,  // bcrypt hash пароля адміна
  createdAt: Date
}
```

## Frontend Integration

### Файли для зміни:
1. **src/pages/Home.jsx**
   - Замінити `mockDonationData` на API fetch
   - Додати `useEffect` для завантаження даних з `/api/fundraising`
   - Видалити import `mockData.js`

2. **Додати новий файл: src/pages/Admin.jsx**
   - Форма для оновлення даних
   - Поля: totalRaised, goalAmount, donorCount, всі платіжні деталі
   - Password field для авторизації
   - Submit button для PUT `/api/fundraising`

3. **Оновити src/App.js**
   - Додати route `/admin` для Admin компонента

## Реалізація Backend

### Файли:
1. **backend/server.py**
   - Додати моделі Pydantic для FundraisingData
   - Створити endpoints GET/PUT `/api/fundraising`
   - Авторізація через простий пароль (bcrypt)
   - Ініціалізація DB з початковими даними

2. **backend/.env**
   - Додати `ADMIN_PASSWORD_HASH` (bcrypt hash)

## Безпека
- Admin password зберігається як bcrypt hash
- Валідація всіх input полів
- Rate limiting на PUT endpoint
- CORS налаштовано

## Тестування
1. Backend: curl тести для GET/PUT endpoints
2. Frontend: Перевірка завантаження даних, admin форма
