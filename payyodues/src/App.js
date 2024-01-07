import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css';
import Navbar from './components/NavBar/navbar'
import RemindDues from './components/RemindDues/remind';
import Home from './components/Home/home'
import StudyCarrels from './components/Academics/studycarrels';
import BudgetTracker from './components/Budget/budgetTracker';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/remind-dues" element={<RemindDues />}></Route>
          <Route path = '/study-carrels' element = {<StudyCarrels/>}></Route>
          <Route path = "/budget-tracker" element = {<BudgetTracker />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
