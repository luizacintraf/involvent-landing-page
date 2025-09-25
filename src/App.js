import React from 'react';
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
import TrialClass from './components/TrialClass';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { FreeWeekProvider } from './contexts/FreeWeekContext';

function App() {
  const scrollToTrial = () => {
    const trialSection = document.getElementById('trial-class');
    if (trialSection) {
      trialSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <FreeWeekProvider>
      <div className="App">
        <Header />
        <main>
          <Hero onTrialClick={scrollToTrial} />
          <Benefits onTrialClick={scrollToTrial} />
          <About onTrialClick={scrollToTrial} />
          <Classes onTrialClick={scrollToTrial} />
          <Teachers onTrialClick={scrollToTrial} />
          <Testimonials onTrialClick={scrollToTrial} />
          <Plans onTrialClick={scrollToTrial} />
          <FAQ onTrialClick={scrollToTrial} />
          <Contact onTrialClick={scrollToTrial} />
          <TrialClass />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </FreeWeekProvider>
  );
}

export default App;