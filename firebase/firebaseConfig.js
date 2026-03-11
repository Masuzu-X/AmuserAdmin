import { initializeApp, getApps, getApp } from 'firebase/app';
import { Platform } from 'react-native';

import {
  getAuth,
  initializeAuth,
  setPersistence,
  browserLocalPersistence,
  getReactNativePersistence,
} from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCSgjEoSloEwjZwAdfTTqh9LirUyIQ_1Vc',
  authDomain: 'amuser-21773.firebaseapp.com',
  projectId: 'amuser-21773',
  storageBucket: 'amuser-21773.appspot.com',
  messagingSenderId: '183422632328',
  appId: '1:183422632328:web:a37dc4f8d3b4cc5a76fa3d',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;

if (Platform.OS === 'web') {
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence).catch((e) => {
    console.log('setPersistence error:', e);
  });
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

const db = getFirestore(app);
const storage = getStorage(app); // ← initialized with the same app instance

export { app, auth, db, storage };
