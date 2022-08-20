import './App.css';
import React from 'react';
import { Routes, Route } from "react-router-dom";
import MainContent from './components/MainContent';
import DetailPage from './components/DetailPage';

function App() {
  
     return (
      <div className="App">
        <Routes>
          <Route path="/" element={<div>
            <h1>Seleziona un esercizio!</h1>
            <MainContent/>
            </div>} />
          <Route path="/esercizi/:idType:idEx" element={<DetailPage/>} />
        </Routes>
      </div>
    );
  }

  
export default App;
