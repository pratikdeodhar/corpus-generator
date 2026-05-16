import React from 'react';
import { TrendingUp, Share2 } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onReset }) => {
  const handleShare = async () => {
    const shareData = {
      title: 'CorpusGen | Advanced Financial Planning',
      text: 'Plan your financial future with this advanced, inflation-aware corpus generator.',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <button className="logo-btn" onClick={onReset} title="Reset to Home">
          <div className="logo">
            <TrendingUp className="logo-icon" />
            <span>CorpusGen</span>
          </div>
        </button>
        <div className="nav-links">
          <a href="#calculator">Calculator</a>
          <a href="#how-it-works">How it Works</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="nav-actions">
          <button className="share-btn" onClick={handleShare}>
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
