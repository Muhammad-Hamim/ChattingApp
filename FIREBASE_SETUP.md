# Firebase Setup Guide

This guide will help you set up Firebase for your Chatting App with Authentication and Firestore.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "chatting-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase console, go to **Authentication** from the left sidebar
2. Click on **Get started**
3. Go to the **Sign-in method** tab
4. Click on **Email/Password**
5. Enable the first option: "Email/Password"
6. Click **Save**

## Step 3: Create Firestore Database

1. In your Firebase console, go to **Firestore Database** from the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (you can update security rules later)
4. Select a location for your database (choose the closest to your users)
5. Click **Done**

## Step 4: Set up Security Rules

Replace the default Firestore rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Add more rules for messages and conversations as needed
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.participants;
    }

    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 5: Get Firebase Configuration

1. In your Firebase console, click on the **gear icon** (Settings) in the left sidebar
2. Click on **Project settings**
3. Scroll down to the **Your apps** section
4. Click on **Web app** icon (</>) to add a web app
5. Enter an app nickname (e.g., "chatting-app-web")
6. Click **Register app**
7. Copy the configuration object

## Step 6: Configure Environment Variables

Update your `.env` file with the Firebase configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef...

# API Configuration
VITE_API_URL=http://localhost:5000/api/v1
VITE_NODE_ENV=development
```

## Step 7: Test the Configuration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

3. Try to register a new user:

   - Fill out the registration form
   - Check your email for verification
   - Check Firebase console under Authentication > Users

4. Try to login with the registered user

## Firebase Features Used

### Authentication

- **Email/Password Authentication**: Users can register and login with email and password
- **Email Verification**: New users receive email verification
- **Auth State Management**: Real-time authentication state changes
- **Error Handling**: User-friendly error messages for auth errors

### Firestore Database

- **User Documents**: Store user profile information
- **Real-time Updates**: Listen to auth state changes
- **Security Rules**: Protect user data with proper access controls

## Authentication Flow

### Registration Flow

1. User fills registration form
2. `createUserWithEmailAndPassword()` creates Firebase Auth user
3. `updateProfile()` sets the display name
4. `sendEmailVerification()` sends verification email
5. User document is created in Firestore with `setDoc()`
6. User is automatically logged in

### Login Flow

1. User enters email and password
2. `signInWithEmailAndPassword()` authenticates user
3. Last login timestamp is updated in Firestore with `updateDoc()`
4. User is redirected to dashboard

### Logout Flow

1. User clicks logout button
2. `signOut()` logs out the user from Firebase
3. Auth state is cleared from Redux store
4. User is redirected to login page

## Security Best Practices

1. **Environment Variables**: Never commit Firebase config to version control
2. **Security Rules**: Implement proper Firestore security rules
3. **Email Verification**: Encourage users to verify their email
4. **Strong Passwords**: Implement password complexity requirements
5. **Error Handling**: Don't expose sensitive error information

## Troubleshooting

### Common Issues

1. **Configuration Error**

   ```
   Firebase: Error (auth/configuration-not-found)
   ```

   - Check that all environment variables are set correctly
   - Verify Firebase project is configured properly

2. **Permission Denied**

   ```
   FirebaseError: Missing or insufficient permissions
   ```

   - Check Firestore security rules
   - Ensure user is authenticated before accessing data

3. **Email Not Sent**

   - Check Firebase console for authentication settings
   - Verify email/password provider is enabled
   - Check spam folder for verification emails

4. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that TypeScript types are correct
   - Verify all imports are properly structured

## Next Steps

1. **Email Templates**: Customize email verification templates in Firebase console
2. **Password Reset**: Implement password reset functionality
3. **Social Login**: Add Google, Facebook, or other social providers
4. **Security**: Update security rules based on your app requirements
5. **Analytics**: Set up Firebase Analytics for user insights

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Best Practices](https://firebase.google.com/docs/guides)
