// src/layout/Footer.tsx
import React from 'react';

const Footer = () => {
  return (
    <footer style={{ padding: '1rem', borderTop: '1px solid #eaeaea', marginTop: '2rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <p>© {new Date().getFullYear()} SysCode. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;