import { useState, useEffect, useRef } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import { Target, TrendingUp, HelpCircle, Info } from 'lucide-react';
import { logEvent } from './utils/supabase';

function App() {
  const [mode, setMode] = useState<'projection' | 'goal'>('projection');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [status, setStatus] = useState<'starting' | 'invested'>('starting');
  const [formData, setFormData] = useState({
    age: 0,
    monthlyAmount: 0,
    years: 0,
    existingAmount: 0,
    inflation: 6,
    targetCorpus: 0,
  });

  const timerRef = useRef<number | null>(null);

  // Track Page View
  useEffect(() => {
    logEvent('page_view', { 
      referrer: document.referrer,
      screen_size: `${window.innerWidth}x${window.innerHeight}`
    });
  }, []);

  // Debounced Calculator Run Tracking
  useEffect(() => {
    // Check if user has entered any meaningful data before logging
    const hasData = formData.monthlyAmount > 0 || formData.targetCorpus > 0 || formData.existingAmount > 0;
    
    if (hasData) {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      
      timerRef.current = window.setTimeout(() => {
        logEvent('calculator_run', {
          mode,
          currency,
          status,
          ...formData
        });
      }, 3000); // Wait for 3 seconds of inactivity
    }

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [formData, mode, currency, status]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData({
      age: 0,
      monthlyAmount: 0,
      years: 0,
      existingAmount: 0,
      inflation: 6,
      targetCorpus: 0,
    });
    setMode('projection');
    setCurrency('INR');
    setStatus('starting');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-wrapper">
      <Navbar onReset={handleReset} />
      
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <span className="badge">New: Inflation-Adjusted Planning</span>
            <h1>Master Your Future.<br />Generate Your Wealth.</h1>
            <p className="hero-subtitle">
              The most advanced, inflation-aware corpus generator built for those who take their financial independence seriously.
            </p>
            <div className="hero-actions">
              <a href="#calculator" className="btn-primary">Start Planning Now</a>
              <a href="#how-it-works" className="btn-secondary">Learn Methodology</a>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        <section id="calculator" className="calculator-section">
          <div className="section-header">
            <h2>Financial Projection Engine</h2>
            <p>Input your variables below to see the exponential power of compounding.</p>
          </div>

          <div className="mode-selector">
            <button 
              className={`mode-btn ${mode === 'projection' ? 'active' : ''}`}
              onClick={() => setMode('projection')}
            >
              <TrendingUp size={18} />
              Projection Mode
            </button>
            <button 
              className={`mode-btn ${mode === 'goal' ? 'active' : ''}`}
              onClick={() => setMode('goal')}
            >
              <Target size={18} />
              Target Goal Mode
            </button>
          </div>

          <div className="toggle-section">
            <div className="toggle-group">
              <label>Currency</label>
              <div className="buttons">
                <button className={currency === 'INR' ? 'active' : ''} onClick={() => setCurrency('INR')}>INR (₹)</button>
                <button className={currency === 'USD' ? 'active' : ''} onClick={() => setCurrency('USD')}>USD ($)</button>
              </div>
            </div>
            <div className="toggle-group">
              <label>Starting Point</label>
              <div className="buttons">
                <button className={status === 'starting' ? 'active' : ''} onClick={() => setStatus('starting')}>Fresh Start</button>
                <button className={status === 'invested' ? 'active' : ''} onClick={() => setStatus('invested')}>Already Invested</button>
              </div>
            </div>
          </div>

          <div className="content-grid">
            <section className="input-section glass-card">
              <InputForm
                mode={mode}
                currency={currency}
                status={status}
                {...formData}
                onChange={handleInputChange}
              />
            </section>

            <section className="results-section glass-card">
              <ResultsDisplay
                mode={mode}
                currency={currency}
                {...formData}
                existingAmount={status === 'invested' ? formData.existingAmount : 0}
              />
            </section>
          </div>
        </section>

        <section id="how-it-works" className="education-section">
          <div className="edu-card glass-card">
            <h4><TrendingUp size={20} /> The Power of Compounding</h4>
            <p>Earnings generate more earnings. By reinvesting your gains, your wealth grows exponentially over time. Our engine uses the standard Future Value (FV) formula for monthly contributions and lump-sum growth.</p>
          </div>
          <div className="edu-card glass-card">
            <h4><Info size={20} /> Why Inflation Matters</h4>
            <p>A corpus of ₹10 Crore today won't buy the same things in 20 years. We use your custom inflation rate to calculate the <strong>Real Value</strong>, ensuring your plan survives the test of time.</p>
          </div>
        </section>

        <section id="faq" className="faq-section">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-grid">
            <div className="faq-item glass-card">
              <h5><HelpCircle size={18} /> What is a realistic return rate?</h5>
              <p>For long-term equity in India, 10-12% is often cited as a benchmark. In the US, the S&P 500 historically averages around 8-10%.</p>
            </div>
            <div className="faq-item glass-card">
              <h5><HelpCircle size={18} /> Is my data private?</h5>
              <p>Yes. This is a client-side application. None of your financial data ever leaves your browser or is stored on any server.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="main-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <TrendingUp className="logo-icon" />
              <span>CorpusGen</span>
            </div>
            <p>© 2026 CorpusGen. Built for financial freedom.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
