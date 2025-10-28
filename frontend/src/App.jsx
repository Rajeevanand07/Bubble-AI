import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav';
import Sidebar from './components/Sidebar';
import AppRouter from './router/AppRouter';

const App = () => {
  const location = useLocation();
  const showSidebar = location.pathname === '/';

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="animated-shape shape1"></div>
      <div className="animated-shape shape2"></div>
      <div className="animated-shape shape3"></div>
      <div className="relative z-10 flex">
        {showSidebar && <Sidebar />}
        <div className="flex flex-col w-full">
          <Nav />
          <AppRouter />
        </div>
      </div>
    </div>
  );
};


export default App;