import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Login from "./components/Account/Login";
import Signup from "./components/Account/Signup";
import Info from './components/Navbar/Info';
import MainContent from './components/MainContent/MainContent';
import { SnackbarProvider } from 'notistack';

const App = () => {
  const [user, setUser] = useState(null);
  const [showMainContent, setShowMainContent] = useState(true);

  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<MainContent />} />
          <Route 
            path='/login' 
            element={<Login setShowMainContent={setShowMainContent} />} 
          />
          <Route path='/info' element={<Info />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
