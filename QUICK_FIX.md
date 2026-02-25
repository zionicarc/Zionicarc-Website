# 🚨 QUICK FIX: Firebase Login Error

## The Problem You're Seeing

```
Login Failed: Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
```

## ✅ The Solution (3 Minutes)

### Step 1: Open Firebase Console
👉 **Go to:** https://console.firebase.google.com/

### Step 2: Get Your Credentials
1. Select your Z'IONIC ARC project (or create one)
2. Click ⚙️ **Settings** (gear icon) → **Project settings**
3. Scroll to **"Your apps"** section
4. Click the **`</>`** web icon (if you haven't added a web app yet)
5. Copy the config values that look like this:

```javascript
{
  apiKey: "AIzaSyABC123...",           // ← Copy this
  authDomain: "yourproject.firebaseapp.com",  // ← Copy this
  projectId: "yourproject",             // ← Copy this
  storageBucket: "yourproject.appspot.com",  // ← Copy this
  messagingSenderId: "123456789",       // ← Copy this
  appId: "1:123:web:abc123",            // ← Copy this
  measurementId: "G-ABC123"             // ← Copy this
}
```

### Step 3: Update Your `.env` File

Open the `.env` file in your project root and **replace** these lines:

**BEFORE (placeholder values):**
```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

**AFTER (with YOUR actual values):**
```env
VITE_FIREBASE_API_KEY=AIzaSyABC123...
VITE_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=yourproject
VITE_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-ABC123
```

### Step 4: Enable Authentication in Firebase

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Enable **"Email/Password"** sign-in method
4. Click **"Users"** tab → **"Add user"**
5. Create an admin account:
   - Email: `admin@zionicarc.com` (or your email)
   - Password: (choose a strong password)

### Step 5: Restart Your Dev Server

**In your terminal where `npm run dev` is running:**

1. Press `Ctrl + C` to stop the server
2. Run: `npm run dev` to start it again
3. Wait for it to say "ready" with the localhost URL

### Step 6: Test Login

1. Go to: http://localhost:5173/admin
2. Enter your email and password
3. Click "Sign In"
4. ✅ You should be logged in!

---

## 📍 Where to Find Each File

- **`.env` file:** In your project root folder (same folder as `package.json`)
- **Firebase Console:** https://console.firebase.google.com/
- **Admin Dashboard:** http://localhost:5173/admin

---

## ❓ Still Having Issues?

### "Cannot read properties of undefined"
- Make sure you saved the `.env` file after editing
- Restart the dev server (Ctrl+C, then `npm run dev`)

### "Project not found" error
- Double-check the `VITE_FIREBASE_PROJECT_ID` matches exactly

### "User not found" when logging in
- Go to Firebase Console → Authentication → Users
- Make sure you created a user account

### Dev server not picking up changes
- **Stop the server:** Ctrl + C in terminal
- **Delete the .vite cache folder:** Delete `node_modules/.vite` folder
- **Restart:** `npm run dev`

---

## 🔐 Security Reminder

- ✅ The `.env` file is already in `.gitignore` - it won't be committed to Git
- ❌ **Never share your Firebase credentials publicly**
- ✅ Set up proper Firebase Security Rules before deploying to production

---

## 📁 File Locations Reference

```
Zionicarc-Website-main/
├── .env                    ← Edit THIS file with real credentials
├── .env.example            ← Template only, don't edit
├── FIREBASE_SETUP.md       ← Detailed setup guide
├── QUICK_FIX.md           ← This file (quick reference)
├── package.json
└── src/
    └── lib/
        └── firebase.js     ← Uses the .env values
```
