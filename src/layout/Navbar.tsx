// src/layout/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import Search from '../components/Search';
import ThemeToggle from '../components/ThemeToggle';

const Navbar = () => {
  return (
    <header style={{ padding: '1rem', borderBottom: '1px solid #eaeaea' }}>
      <nav style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
          SysCode
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '250px' }}>
            <Search />
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;