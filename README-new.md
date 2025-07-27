# Chatting App

A modern, responsive chat application built with React, TypeScript, Firebase Authentication, and Redux Toolkit. Features secure user authentication, real-time messaging capabilities, and a clean, intuitive user interface.

## Features

- 🔐 **Firebase Authentication**

  - User registration with email verification
  - Secure login/logout
  - Password validation and security
  - Real-time auth state management

- 🎨 **Modern UI/UX**

  - Responsive design that works on all devices
  - Clean, minimal interface
  - Loading states and error handling
  - Success feedback and notifications

- 🚀 **State Management**

  - Redux Toolkit for efficient state management
  - RTK Query for server state and caching
  - Proper TypeScript integration

- 🛡️ **Security & Validation**
  - Client-side form validation
  - Firebase security rules
  - Protected routes
  - Error handling and user feedback

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **State Management**: Redux Toolkit, RTK Query
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, Alert)
│   └── AuthGuard.tsx   # Route protection component
├── config/             # Configuration files
│   └── firebase.ts     # Firebase configuration
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── LoginPage.tsx   # Login form
│   ├── RegisterPage.tsx # Registration form
│   └── DashboardPage.tsx # Protected dashboard
├── redux/              # Redux store and slices
│   ├── api/           # API configuration
│   ├── auth/          # Authentication slice and API
│   └── store.ts       # Store configuration
├── services/           # Service layer
│   └── authService.ts  # Firebase auth service
├── types/              # TypeScript type definitions
│   └── auth.ts        # Authentication types
└── lib/               # Utility functions
    └── utils.ts       # Common utilities
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Authentication with Email/Password provider
4. Create a Firestore database
5. Get your Firebase configuration from Project Settings

### 3. Environment Configuration

1. Fill in your Firebase configuration in `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Firestore Security Rules

Add these security rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Authentication Flow

1. **Registration**:

   - User fills out registration form with validation
   - Firebase creates user account
   - Email verification is sent
   - User data is stored in Firestore
   - Automatic login after registration

2. **Login**:

   - User enters email and password
   - Firebase authenticates user
   - Last login timestamp is updated
   - User is redirected to dashboard

3. **Route Protection**:
   - AuthGuard component protects routes
   - Automatic redirects based on auth state
   - Loading states during auth checks

### UI Components

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation with helpful messages
- **Success States**: Confirmation of successful operations

## Troubleshooting

### Common Issues

1. **Firebase Configuration Error**

   - Ensure all environment variables are set correctly
   - Check Firebase project settings
   - Verify authentication providers are enabled

2. **Build Errors**

   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript errors in the console
   - Verify all imports are correct

3. **Authentication Issues**
   - Check Firebase console for user creation
   - Verify Firestore rules allow user document creation
   - Check browser console for detailed error messages

## License

This project is licensed under the MIT License.
