import './App.css';
import React from 'react';
import { Routes, Route } from "react-router-dom";
import MainContent from './components/MainContent';
import DetailPage from './components/DetailPage';
import CreateNewAllenamento from './pages/CreateNewAllenamento';

function App() {
  
     return (
      <div  className="App-style">
        <Routes>
          <Route path="/" element={
          <div>
            <MainContent/>
          </div>
          } />
          <Route path="/nuovoAllenamento" element={<CreateNewAllenamento />}/>
          <Route path="/esercizi/:idType:idEx" element={<DetailPage/>} />
        </Routes>
      </div>
    );
  }

  
export default App;
