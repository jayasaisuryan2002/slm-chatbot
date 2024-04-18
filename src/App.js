import React from'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Bot from './pages/bot';

import Navbar from './components/Navbar';


function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
           <Route path='/bot' element={<Bot />} />
        </Routes>
      </BrowserRouter>
      
    </>
  );
}

export default App;