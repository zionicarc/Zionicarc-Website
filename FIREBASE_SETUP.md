# 🔥 Firebase Setup Guide

## The Problem

You're seeing this error:
```
Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
```

This means your `.env` file has placeholder values instead of real Firebase credentials.

---

## ✅ Solution: Get Your Firebase Credentials

### Step 1: Go to Firebase Console
1. Open your browser and go to: **https://console.firebase.google.com/**
2. Sign in with your Google account

### Step 2: Select or Create Your Project
- If you already have a Firebase project for Z'IONIC ARC, select it
- If not, click **"Add project"** and follow the setup wizard

### Step 3: Get Your Firebase Configuration

1. In your Firebase project, click the **⚙️ Settings (gear icon)** in the left sidebar
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. If you don't have a web app yet:
   - Click the **`</>`** (Web) icon to add a web app
   - Give it a nickname (e.g., "Z'IONIC ARC Website")
   - Click **"Register app"**
   - You can skip Firebase Hosting setup for now

5. You should now see a **"Firebase SDK snippet"** section
6. Select **"Config"** (not npm)
7. You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrs",
  authDomain: "zionicarc-12345.firebaseapp.com",
  projectId: "zionicarc-12345",
  storageBucket: "zionicarc-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-ABCDEF1234"
};
```

### Step 4: Copy Values to Your .env File

Open your `.env` file and replace the placeholder values with your actual values:

```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrs
VITE_FIREBASE_AUTH_DOMAIN=zionicarc-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=zionicarc-12345
VITE_FIREBASE_STORAGE_BUCKET=zionicarc-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234
```

**⚠️ IMPORTANT:** Use YOUR actual values, not the examples above!

### Step 5: Enable Required Firebase Services

In your Firebase Console, make sure these are enabled:

#### 1. **Firestore Database**
- Go to **Build** > **Firestore Database**
- Click **"Create database"**
- Start in **production mode** or **test mode** (test mode for development)
- Choose a location closest to your users

#### 2. **Storage**
- Go to **Build** > **Storage**
- Click **"Get started"**
- Accept the security rules
- Choose a location

#### 3. **Authentication** (for Admin Dashboard)
- Go to **Build** > **Authentication**
- Click **"Get started"**
- Enable **Email/Password** sign-in method
- Click on **"Email/Password"** > Enable > Save

#### 4. **Analytics** (Optional)
- Should be enabled by default
- Check in **Build** > **Analytics**

### Step 6: Restart Your Dev Server

After updating `.env`:

1. Stop the dev server (Ctrl + C in the terminal where `npm run dev` is running)
2. Start it again:
   ```bash
   npm run dev
   ```

3. The server will automatically reload the new environment variables

### Step 7: Test the Login

1. Open http://localhost:5173/
2. The Firebase error should be gone
3. Try accessing the admin dashboard at http://localhost:5173/admin

---

## 🔒 Security Notes

- **NEVER commit your `.env` file to Git** (it's already in `.gitignore`)
- **NEVER share your Firebase credentials publicly**
- The API key in Firebase web apps is safe to expose in client-side code (it's protected by Firebase Security Rules)
- Make sure to set up proper Firestore Security Rules in production

---

## 🔍 Troubleshooting

### Still seeing the error after updating .env?
1. Make sure you saved the `.env` file
2. Restart the dev server completely (stop and start again)
3. Clear your browser cache (Ctrl + Shift + R)
4. Check for typos in the `.env` values

### Can't find Firebase SDK snippet?
- Make sure you're in the right Firebase project
- Look under Project Settings > General > Your apps
- If no web app exists, click the `</>` icon to create one

### "Project not found" error?
- Double-check the `VITE_FIREBASE_PROJECT_ID` matches your Firebase project ID exactly

---

## 📧 Need Help?

If you're still having issues:
1. Check the browser console for detailed error messages
2. Verify all 7 environment variables are set correctly
3. Make sure Firestore and Authentication are enabled in Firebase Console
