import React, { useState } from 'react';
import './styles.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import About from './components/About';
import Classes from './components/Classes';
import Teachers from './components/Teachers';
import Testimonials from './components/Testimonials';
import Plans from './components/Plans';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import TrialClassForm from './components/TrialClassForm';

function App() {
  const [showTrialForm, setShowTrialForm] = useState(false);

  return (
    <div className="App">
      <Header />
      <main>
        <Hero onTrialClick={() => setShowTrialForm(true)} />
        <Benefits onTrialClick={() => setShowTrialForm(true)} />
        <About onTrialClick={() => setShowTrialForm(true)} />
        <Classes onTrialClick={() => setShowTrialForm(true)} />
        <Teachers />
        <Testimonials onTrialClick={() => setShowTrialForm(true)} />
        <Plans onTrialClick={() => setShowTrialForm(true)} />
        <FAQ />
        <Contact onTrialClick={() => setShowTrialForm(true)} />
      </main>
      <Footer />
      <ScrollToTop />
      <TrialClassForm 
        isOpen={showTrialForm} 
        onClose={() => setShowTrialForm(false)} 
      />
    </div>
  );
}

export default App;