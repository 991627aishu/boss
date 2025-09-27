import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import SectionPage from './components/SectionPage';
import NfaAutomationForm from './components/NfaAutomationForm';
import NfaLandingPage from './components/NfaLandingPage';
import NfaHistoryPage from './components/NfaHistoryPage';
// import SectionLanding from './components/SectionLanding'; // Uncomment if you actually have this file

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Home Page */}
          <Route path="/home" element={<HomePage />} />

          {/* Section Page */}
          <Route path="/section/:sectionId" element={<SectionPage />} />

          {/* Note for Approval Landing Page */}
          <Route path="/nfa-landing" element={<NfaLandingPage />} />

          {/* NFA History Page */}
          <Route path="/nfa-history" element={<NfaHistoryPage />} />

          {/* Note for Approval → NFA Form */}
          <Route path="/nfa-form" element={<NfaAutomationForm />} />

          {/* If you really need SectionLanding, keep it. Otherwise, remove */}
          {/* <Route path="/section" element={<SectionLanding />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
