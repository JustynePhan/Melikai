import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCfZtzc2wpT9k5caiybN_jaj6ubrczFm2c",
  authDomain: "melikai.firebaseapp.com",
  projectId: "melikai",
  storageBucket: "melikai.firebasestorage.app",
  messagingSenderId: "493501083094",
  appId: "1:493501083094:web:eccb59ee6db06a01070877",
  measurementId: "G-85J57P3VQV"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ]
};
