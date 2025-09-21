import React, { useState } from 'react';
import Link from 'next/link';
import Search from '../components/Search';
import ThemeToggle from '../components/ThemeToggle';
import styles from './Navbar.module.css';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';

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

        {/* --- Desktop Menu --- */}
        <div className={styles.desktopMenu}>
          <Link href="/" className={styles.navLink}>
            All Posts
          </Link>
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} size={20} />
            <Search />
          </div>
          <ThemeToggle />
        </div>

        {/* --- Mobile Controls (button and theme toggle) --- */}
        <div className={styles.mobileControls}>
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            className={styles.mobileMenuButton}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* --- Mobile Dropdown Menu --- */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" className={styles.navLink}>
            All Posts
          </Link>
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} size={20} />
            <Search />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;