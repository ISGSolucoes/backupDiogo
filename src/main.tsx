
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import App from './App.tsx';
import './index.css';

console.log("🚀 Starting SourceXpress application...");

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
