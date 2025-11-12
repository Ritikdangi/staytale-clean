

# 🏖️ StayTale - Travel & Tourism Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for travel and tourism management with admin panel, user authentication, package booking, and payment integration.

## 📸 Screenshots(old UI)
<img width="1891" height="912" alt="image" src="https://github.com/user-attachments/assets/7c9ac80e-965f-40d3-b5fb-fd3d77509b12" />

<img width="1886" height="913" alt="image" src="https://github.com/user-attachments/assets/a509c8cc-cd7e-4f45-b7a1-c9d5941448b6" />
<img width="1900" height="908" alt="image" src="https://github.com/user-attachments/assets/c890e2bf-4d61-44d2-8748-3436182f52b2" />
<img width="1900" height="916" alt="image" src="https://github.com/user-attachments/assets/f4e0a849-adc8-4886-ae48-a7f962ff2499" />
<img width="1899" height="921" alt="image" src="https://github.com/user-attachments/assets/45b0ed15-5db6-4f12-93a7-807e1a9a0ae1" />
<img width="1900" height="924" alt="image" src="https://github.com/user-attachments/assets/43e2f28e-123a-4a02-960d-ac0b57476327" />
<img width="1904" height="924" alt="image" src="https://github.com/user-attachments/assets/8517e81a-381b-48e5-aa7a-803c7f3f110c" />



## ✨ Features

### 🎯 User Features
- **User Authentication**: Sign up, login, and profile management
- **Package Browsing**: View and search travel packages
- **Package Booking**: Book travel packages with real-time availability
- **Payment Integration**: Secure payment processing with Braintree
- **Rating & Reviews**: Rate and review travel packages
- **Booking History**: View past and current bookings
- **Profile Management**: Update personal information and preferences

### 🔧 Admin Features
- **Dashboard**: Analytics and overview of bookings, users, and revenue
- **Package Management**: Add, edit, and delete travel packages
- **User Management**: View and manage all registered users
- **Booking Management**: Monitor and manage all bookings
- **Payment Tracking**: Track all payment transactions
- **Rating Reviews**: Moderate user reviews and ratings
- **Analytics**: View charts and statistics for business insights

### 🛠️ Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live booking status and availability
- **Image Upload**: Firebase storage for package images
- **Search & Filter**: Advanced search functionality
- **Pagination**: Efficient data loading
- **JWT Authentication**: Secure token-based authentication
- **Redux State Management**: Centralized state management

## 🚀 Tech Stack

### Frontend
- **React.js 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Firebase** - File storage and analytics
- **Braintree** - Payment processing
- **React Icons** - Icon library
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie handling
- **Dotenv** - Environment variables

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Firebase project
- Braintree account
- Git

## ⚙️ Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection
MONGO_URL=your_mongodb_atlas_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Braintree Payment Gateway
BRAINTREE_MERCHANT_ID=your_braintree_merchant_id
BRAINTREE_PUBLIC_KEY=your_braintree_public_key
BRAINTREE_PRIVATE_KEY=your_braintree_private_key

# Server Configuration
NODE_ENV_CUSTOM=development
ALLOWED_ORIGIN=http://localhost:5173
PORT=8000
```

### Frontend (.env)
Create a `.env` file in the `client` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Ritikdangi/StayTale.git
cd StayTale-clean
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file with your environment variables (see above).

### 3. Frontend Setup
```bash
cd client
npm install
```

Create `.env` file with your environment variables (see above).

### 4. Run the Application

#### Development Mode
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

#### Production Mode
```bash
# Backend
cd backend
npm start

# Frontend
cd client
npm run build
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/update` - Update user profile
- `GET /api/user/all` - Get all users (Admin)

### Packages
- `GET /api/package/all` - Get all packages
- `GET /api/package/:id` - Get package by ID
- `POST /api/package/create` - Create package (Admin)
- `PUT /api/package/update/:id` - Update package (Admin)
- `DELETE /api/package/delete/:id` - Delete package (Admin)

### Bookings
- `POST /api/booking/create` - Create booking
- `GET /api/booking/user` - Get user bookings
- `GET /api/booking/all` - Get all bookings (Admin)
- `PUT /api/booking/update/:id` - Update booking status (Admin)

### Ratings & Reviews
- `POST /api/rating/create` - Create rating
- `GET /api/rating/package/:id` - Get package ratings
- `GET /api/rating/all` - Get all ratings (Admin)

## 🚀 Deployment Guide

### Backend Deployment Options

#### 1. **Render** (Recommended - Free)
- Go to [render.com](https://render.com)
- Sign up with GitHub
- Click "New Web Service"
- Connect your GitHub repository
- Set build command: `npm install`
- Set start command: `npm start`
- Add environment variables in dashboard

#### 2. **Railway** (Free tier available)
- Go to [railway.app](https://railway.app)
- Sign up with GitHub
- Deploy from GitHub repo
- Set environment variables

#### 3. **Heroku** (Paid)
- Go to [heroku.com](https://heroku.com)
- Create new app
- Connect GitHub repository
- Set environment variables

### Frontend Deployment Options

#### 1. **Vercel** (Recommended - Free)
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub
- Import your repository
- Set environment variables
- Deploy automatically

#### 2. **Netlify** (Free)
- Go to [netlify.com](https://netlify.com)
- Sign up with GitHub
- Import your repository
- Set build command: `npm run build`
- Set publish directory: `dist`

### Environment Variables for Production

#### Backend Environment Variables (Set in deployment platform):
```env
MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
BRAINTREE_MERCHANT_ID=your_braintree_merchant_id
BRAINTREE_PUBLIC_KEY=your_braintree_public_key
BRAINTREE_PRIVATE_KEY=your_braintree_private_key
NODE_ENV_CUSTOM=production
ALLOWED_ORIGIN=https://your-frontend-domain.com
PORT=8000
```

#### Frontend Environment Variables (Set in deployment platform):
```env
VITE_API_URL=https://your-backend-domain.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 📁 Project Structure

```
StayTale/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Custom middlewares
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── index.js         # Server entry point
│   └── package.json
├── client/
│   ├── src/
│   │   ├── pages/       # React components
│   │   ├── redux/       # Redux store
│   │   ├── assets/      # Static assets
│   │   └── main.jsx     # App entry point
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## 👨‍💻 Author

**Ritik Dangi**
- GitHub: [@Ritikdangi](https://github.com/Ritikdangi)

## 🙏 Acknowledgments

- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- UI components from [Material-UI](https://mui.com/)

---

⭐ **Star this repository if you found it helpful!** 

