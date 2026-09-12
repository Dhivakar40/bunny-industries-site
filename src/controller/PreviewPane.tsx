import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Clients from '../components/Clients';
import Certifications from '../components/Certifications';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

// Renders the ACTUAL site components, reading the SAME in-memory content
// state the controller is editing (same ContentProvider ancestor).
// This is why it updates on every keystroke with zero extra wiring —
// no iframe, no postMessage, no localStorage, nothing local at all.
export default function PreviewPane() {
  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'auto', background: '#0F1115',
      // transform creates a new stacking context, making this div the containing
      // block for any position:fixed descendants (e.g. the Navbar). Without this,
      // position:fixed would escape and overlap the controller's own top bar.
      transform: 'translateZ(0)',
      position: 'relative',
    }}>
      <div className="app-main">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Services />
          <Portfolio />
          <Clients />
          <Certifications />
          <Contact />
          <Footer />
        </main>
      </div>
    </div>
  );
}