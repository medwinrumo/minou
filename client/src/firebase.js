// Configuration Firebase — projet minou-3850
import { initializeApp } from 'firebase/app';
import { getAuth }       from 'firebase/auth';
import { getFirestore }  from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "AIzaSyBk3Mt0Jz-sKoh8g9KEnMz7H-caNgMmfHQ",
  authDomain:        "minou-3850.firebaseapp.com",
  projectId:         "minou-3850",
  storageBucket:     "minou-3850.firebasestorage.app",
  messagingSenderId: "1057563213786",
  appId:             "1:1057563213786:web:47852a9151845b4ebc8ae3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
