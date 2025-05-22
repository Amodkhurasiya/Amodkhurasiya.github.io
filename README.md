# Trybee - Tribal Art E-commerce Platform

![Trybee Logo](public/images/logo.png)

## 📝 Project Overview

Trybee is a full-stack e-commerce platform focusing on tribal and handcrafted products. The application celebrates the art and craftsmanship of tribal communities by providing a marketplace for unique handmade products like clay pottery, terracotta items, traditional artwork, and handicrafts.

### 🎯 Key Features

- **User Authentication**: Secure registration and login system with JWT
- **Product Browsing**: Advanced filtering, sorting, and searching capabilities
- **Shopping Cart**: Real-time product addition, removal, and quantity management
- **Order Management**: Full order lifecycle from checkout to delivery
- **Admin Dashboard**: Complete control over products, orders, and users
- **Responsive Design**: Seamless experience across all device sizes
- **Contact System**: Email functionality for user inquiries and support
- **Rating System**: Product ratings and reviews from authenticated users

## 🏗️ Architecture

### Frontend (React/Vite)

```
src/
├── components/ - Reusable UI components
├── pages/ - Main application pages/views
├── redux/ - State management using Redux Toolkit
├── services/ - API service layer
├── App.jsx - Main application component
└── main.jsx - Application entry point
```

### Backend (Node.js/Express)

```
backend/
├── config/ - Configuration files
├── controllers/ - Request handlers
├── middleware/ - Custom middleware
├── models/ - Mongoose data models
├── routes/ - API route definitions
├── utils/ - Utility functions
└── server.js - Server entry point
```

## 🔄 Data Flow Diagram

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  React UI   │ ───> │  Redux      │ ───> │  API        │
│  Components │ <─── │  Store      │ <─── │  Services   │
└─────────────┘      └─────────────┘      └─────────────┘
                                                │
                                                │
                                                ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  MongoDB    │ <─── │  Mongoose   │ <─── │  Express    │
│  Database   │ ───> │  Models     │ ───> │  Routes     │
└─────────────┘      └─────────────┘      └─────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Navigation and routing
- **Axios** - HTTP client
- **Formik & Yup** - Form handling and validation
- **React Icons** - Icon library
- **Styled Components** - Component styling
- **Framer Motion** - Animations
- **Vite** - Build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email functionality
- **Multer** - File uploads
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Cors** - Cross-Origin Resource Sharing

## 📦 Installation

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas)
- npm or yarn

### Frontend Setup
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/trybee.git
   cd trybee
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start development server
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to backend directory
   ```bash
   cd backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/trybee
   JWT_SECRET=your_jwt_secret
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ADMIN_EMAIL=admin@trybee.com
   ```

4. Start the backend server
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Frontend Deployment
1. Build the project
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting provider (Netlify, Vercel, etc.)

### Backend Deployment
1. Deploy to a Node.js hosting service (Heroku, DigitalOcean, AWS, etc.)
2. Configure environment variables on your hosting platform
3. Set up MongoDB Atlas for production database

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID (admin)

### Contact
- `POST /api/contact` - Send contact form message

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test
```

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Special thanks to all tribal artisans whose work inspired this platform
- All open-source libraries and frameworks used in this project 