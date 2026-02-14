# Z'IONIC ARC - Architecture Studio Website

A modern, responsive architecture studio website built with React, Vite, and Firebase.

## 🚀 Features

- Modern React 18 with React Router for navigation
- Vite for fast development and optimized builds
- Tailwind CSS for styling
- Firebase integration for backend services (Firestore, Storage, Auth)
- GSAP animations for smooth interactions
- Responsive design with mobile-first approach
- Admin dashboard for content management
- Lazy loading for optimal performance

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account (for backend features)

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Zionicarc-Website-main
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Get your Firebase configuration from Project Settings > General > Your apps
   - Copy `.env.example` to `.env`
   - Fill in your Firebase credentials in `.env`:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

4. Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5173/`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 📁 Project Structure

```
Zionicarc-Website-main/
├── src/
│   ├── components/      # React components
│   ├── context/         # Context providers (SiteContext)
│   ├── lib/            # Firebase configuration
│   ├── pages/          # Page components
│   ├── styles/         # Global styles
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Main CSS with Tailwind directives
├── public/             # Static assets
├── .env                # Environment variables (not in git)
├── .env.example        # Example environment file
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── postcss.config.js   # PostCSS configuration
```

## 🔥 Firebase Setup

This project uses Firebase for:
- **Firestore**: Store site settings and content
- **Storage**: Upload and manage images
- **Auth**: Admin authentication
- **Analytics**: Track user engagement

### Setting up Firebase:

1. Create a Firebase project
2. Enable Firestore Database
3. Enable Storage
4. Enable Authentication (if using admin features)
5. Set up security rules for Firestore and Storage
6. Add your Firebase config to `.env`

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- Custom CSS in `src/index.css` for specialized components
- Global styles in `src/styles/global.css`
- Responsive design with mobile breakpoints

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Build

```bash
npm run build
```

The `dist` folder will contain the production-ready files.

## ⚠️ Important Notes

- **Never commit `.env`** - It contains sensitive Firebase credentials
- The site works with default settings even without Firebase (for development)
- Firebase errors in console are normal if credentials aren't configured
- Make sure to restart the dev server after changing `.env`

## 📝 License

All rights reserved - Z'IONIC ARC Architecture Studio

## 🤝 Contributing

This is a private project for Z'IONIC ARC. Please contact the team before contributing.

## 📧 Support

For issues or questions, contact the development team.
