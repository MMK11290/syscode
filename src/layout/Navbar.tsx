// src/layout/Navbar.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import Search from '../components/Search';
import ThemeToggle from '../components/ThemeToggle';
import styles from './Navbar.module.css';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi'; // Import FiSearch

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          SysCode
        </Link>
        <div className={styles.desktopMenu}>
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} size={20} />
            <Search />
          </div>
          <ThemeToggle />
        </div>
        <div className={styles.mobileMenuButton}>
          <button onClick={toggleMobileMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} size={20} />
            <Search />
          </div>
          <ThemeToggle />
        </div>
      )}
    </header>
  );
};

export default Navbar;