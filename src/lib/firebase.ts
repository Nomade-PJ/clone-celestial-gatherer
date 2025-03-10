
// Import the Firebase SDK components we need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXFuHbCQqwg5sZYcpHmxMvU9NdvJx-BLw",
  authDomain: "paulocell-sistema.firebaseapp.com",
  projectId: "paulocell-sistema",
  storageBucket: "paulocell-sistema.appspot.com",
  messagingSenderId: "1098765432",
  appId: "1:1098765432:web:abc123def456ghi789jkl"
  // Removed measurementId as it's not required for basic auth
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Create a Google Auth Provider instance
const googleProvider = new GoogleAuthProvider();
// Configure Google provider settings with all necessary parameters
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Adding these parameters to ensure proper OAuth flow - make sure access_type is a string
  access_type: 'offline',
  include_granted_scopes: true
});
// Add necessary scopes for the application
googleProvider.addScope('profile');
googleProvider.addScope('email');

export { auth, googleProvider };
