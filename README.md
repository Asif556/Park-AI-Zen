# 🚗 Park-AI-Zen

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-purple.svg)](https://vitejs.dev/)

An intelligent AI-powered parking management system that revolutionizes the parking experience with real-time slot monitoring, AI-driven insights, occupancy predictions, and an interactive 3D visualization interface.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [Components Overview](#components-overview)
- [Authentication](#authentication)
- [Theming](#theming)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🎯 Core Features

- **Real-Time Parking Management**: Monitor parking slot availability in real-time
- **AI-Powered Vehicle Detection**: Automatic vehicle classification using ML models
- **Smart Camera Integration**: Capture and process vehicle images for automated check-in
- **3D Parking Visualization**: Interactive 3D parking lot view using Spline
- **Occupancy Prediction**: AI-based predictions for future parking availability
- **Dynamic Pricing**: Automatic fare calculation based on duration and vehicle type
- **Payment Integration**: Multiple payment methods (Cash, Card, UPI, Wallet)

### 👤 User Features

- **Easy Check-In/Check-Out**: Simple interface for parking session management
- **Vehicle Registration**: Capture vehicle details with camera or manual entry
- **Payment Processing**: Seamless payment experience with success animations
- **Session Tracking**: Real-time tracking of parking duration and charges
- **AI Chatbot Assistant**: Interactive 3D Spline chatbot for user assistance

### 👨‍💼 Admin Features

- **Admin Dashboard**: Comprehensive overview of parking operations
- **Analytics Dashboard**: Detailed insights with charts and statistics
- **Session Management**: View and manage all active and completed parking sessions
- **Revenue Tracking**: Monitor daily, weekly, and monthly revenue
- **Occupancy Analytics**: Visual charts for parking trends and patterns
- **Prediction Controls**: Adjust AI prediction parameters
- **Protected Routes**: Secure admin access with authentication

### 🤖 AI Features

- **AI Insights Chat**: Conversational interface for parking analytics
- **Occupancy Prediction**: Forecast parking availability using time-series analysis
- **Vehicle Classification**: Automatic vehicle type detection (Sedan, SUV, Bike, Truck, Van)
- **Smart Recommendations**: AI-driven suggestions for parking optimization

## 🛠 Tech Stack

### Frontend Framework
- **React 18.3.1** - Modern UI library
- **TypeScript 5.6.2** - Type-safe development
- **Vite 6.0.1** - Lightning-fast build tool

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Beautiful icon set
- **Recharts** - Composable charting library

### State Management & Data Fetching
- **TanStack Query (React Query) 5.83.0** - Powerful data synchronization
- **React Context API** - Global state management
- **React Hook Form 7.54.2** - Performant form management
- **Zod 3.24.1** - TypeScript-first schema validation

### Routing & Navigation
- **React Router DOM 7.2.0** - Client-side routing

### 3D & Visualization
- **Spline React 4.1.0** - Interactive 3D experiences
- **Spline Runtime 1.10.86** - 3D scene runtime

### HTTP & API
- **Axios 1.12.2** - Promise-based HTTP client

### Utilities
- **date-fns 3.6.0** - Modern date utility library
- **clsx & class-variance-authority** - Conditional className utilities
- **sonner** - Beautiful toast notifications

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS & Autoprefixer** - CSS processing
- **Vite React SWC** - Fast refresh and builds

## 📁 Project Structure

```
park-ai-zen/
├── public/                      # Static assets
│   └── robots.txt
├── src/
│   ├── components/              # React components
│   │   ├── ui/                  # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   └── ...              # 40+ UI components
│   │   ├── AdminPanel.tsx       # Admin dashboard
│   │   ├── AIInsights.tsx       # AI analytics view
│   │   ├── AIInsightsChat.tsx   # AI chat interface
│   │   ├── CameraCapture.tsx    # Vehicle image capture
│   │   ├── CarDetailsForm.tsx   # Vehicle details form
│   │   ├── FloatingChatbot.tsx  # Floating chatbot button
│   │   ├── Header.tsx           # Main navigation header
│   │   ├── OccupancyPredictionChart.tsx  # Prediction charts
│   │   ├── ParkingLot3D.tsx     # 3D parking visualization
│   │   ├── ParkingSessionSkeleton.tsx    # Loading skeleton
│   │   ├── PaymentSuccessAnimation.tsx   # Payment UI
│   │   ├── PredictionCard.tsx   # Prediction display
│   │   ├── PredictionControlPanel.tsx    # Prediction settings
│   │   ├── ProtectedRoute.tsx   # Route authentication
│   │   ├── SlotMap.tsx          # Parking slot map
│   │   ├── SplineChatbotAvatar.tsx       # 3D chatbot
│   │   ├── SplineLoader.tsx     # 3D loading component
│   │   └── UserPanel.tsx        # User interface
│   ├── contexts/                # React Context providers
│   │   ├── PredictionSettingsContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   ├── use-parking-prediction.ts
│   │   └── use-toast.ts
│   ├── lib/                     # Utility libraries
│   │   ├── api.ts               # API client
│   │   ├── auth.ts              # Authentication logic
│   │   └── utils.ts             # Helper functions
│   ├── pages/                   # Page components
│   │   ├── AdminLogin.tsx       # Admin login page
│   │   ├── AdminView.tsx        # Admin view page
│   │   ├── AnalyticsDashboard.tsx  # Analytics page
│   │   ├── Index.tsx            # Home page
│   │   └── NotFound.tsx         # 404 page
│   ├── types/                   # TypeScript type definitions
│   │   └── parking.ts
│   ├── App.tsx                  # Main App component
│   ├── App.css                  # App styles
│   ├── index.css                # Global styles
│   ├── main.tsx                 # App entry point
│   └── vite-env.d.ts           # Vite type declarations
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── components.json              # Shadcn config
├── eslint.config.js            # ESLint configuration
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.app.json           # App TypeScript config
├── tsconfig.node.json          # Node TypeScript config
├── vite.config.ts              # Vite configuration
└── README.md                    # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher) or **bun** (v1.0.0 or higher)
- **Git** (for version control)


## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Asif556/Park-AI-Zen.git
cd park-ai-zen
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

Using bun:
```bash
bun install


### 4. Start Development Server

Using npm:
```bash
npm run dev
```

Using yarn:
```bash
yarn dev
```

Using bun:
```bash
bun dev
```

## ⚙️ Configuration



## 📖 Usage

### User Flow

1. **Access the System**: Navigate to the home page
2. **View Available Slots**: Check real-time parking availability
3. **Park Vehicle**: 
   - Use camera to capture vehicle image
   - Fill in vehicle details (or auto-filled by AI)
   - Confirm check-in
4. **Exit Parking**:
   - Enter vehicle number
   - View calculated charges
   - Complete payment
   - Receive confirmation

### Admin Flow

1. **Login**: Navigate to `/login` and enter admin credentials
2. **Dashboard**: View all active sessions and statistics
3. **Analytics**: Access detailed charts and insights
4. **AI Controls**: Adjust prediction parameters
5. **Session Management**: Monitor and manage parking sessions


## 🧩 Components Overview

### Core Components

- **AdminPanel**: Complete admin dashboard with session management
- **UserPanel**: User interface for parking operations
- **SlotMap**: Visual parking slot map display
- **Header**: Navigation and panel switching

### AI Components

- **AIInsights**: AI-powered analytics dashboard
- **AIInsightsChat**: Conversational AI interface
- **OccupancyPredictionChart**: Visualization of predictions
- **PredictionControlPanel**: Settings for prediction algorithms

### Vehicle Components

- **CameraCapture**: Camera integration for vehicle images
- **CarDetailsForm**: Form for vehicle information
- **ParkingSessionSkeleton**: Loading state for sessions

### 3D Components

- **ParkingLot3D**: Interactive 3D parking visualization
- **SplineChatbotAvatar**: 3D animated chatbot
- **SplineLoader**: 3D loading animations

### UI Components

Located in `src/components/ui/`, includes 40+ components:
- Form elements (Button, Input, Select, Checkbox, etc.)
- Layout components (Card, Dialog, Sheet, Tabs, etc.)
- Feedback components (Toast, Alert, Progress, etc.)
- Navigation components (Menu, Breadcrumb, Pagination, etc.)

## 🔐 Authentication

### Admin Authentication

The system uses session-based authentication:

1. Admin login via `/login` route
2. Credentials validated against backend
3. Session stored in localStorage
4. Protected routes check authentication status
5. Automatic redirect for unauthorized access


## 🗺️ Roadmap

- [ ] Mobile application (React Native)
- [ ] Real-time notifications via WebSocket
- [ ] Advanced analytics with ML models
- [ ] Multi-location support
- [ ] Reservation system
- [ ] Integration with payment gateways
- [ ] QR code-based parking
- [ ] License plate recognition

---

**Made with ❤️ by the Park-AI-Zen Team**
