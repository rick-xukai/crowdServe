import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyACG2ZVFeEIuPm7V3gL60oyZPPmVzxj3zs',
  authDomain: 'crowdserve-8185d.firebaseapp.com',
  projectId: 'crowdserve-8185d',
  storageBucket: 'crowdserve-8185d.appspot.com',
  messagingSenderId: '1086150898912',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
