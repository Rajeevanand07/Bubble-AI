import React from 'react';
import AppRouter from './router/AppRouter';
import './App.css';
import Nav from './pages/Nav';

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="animated-shape shape1"></div>
      <div className="animated-shape shape2"></div>
      <div className="animated-shape shape3"></div>
      <div className="relative z-10">
        <Nav />
        <AppRouter />
      </div>
    </div>
  );
}

export default App;