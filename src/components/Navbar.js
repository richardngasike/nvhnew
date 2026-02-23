'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { landlord, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    router.push('/');
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          <Link href="/" className="logo">
            <div className="logo-icon">🏠</div>
            <div className="logo-text">
              Nairobi Vacant Houses
              <span>Find Your Perfect Home</span>
            </div>
          </Link>

          <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
            <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
              🏡 Home
            </Link>
            <Link href="/listings" className={`nav-link ${isActive('/listings') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
              🔍 Browse Houses
            </Link>
            <Link href="/listings?featured=true" className={`nav-link`} onClick={() => setMobileOpen(false)}>
              ⭐ Featured
            </Link>
            <Link href="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
              ℹ️ About
            </Link>
          </div>

          <div className="nav-actions">
            {landlord ? (
              <div className="landlord-menu" ref={dropRef}>
                <button className="landlord-btn" onClick={() => setDropOpen(!dropOpen)}>
                  <div className="landlord-avatar">
                    {landlord.name[0].toUpperCase()}
                  </div>
                  <span className="hide-mobile">{landlord.name.split(' ')[0]}</span>
                  <span>▾</span>
                </button>
                {dropOpen && (
                  <div className="dropdown-menu">
                    <Link href="/dashboard" className="dropdown-item" onClick={() => setDropOpen(false)}>
                      📊 Dashboard
                    </Link>
                    <Link href="/dashboard/post" className="dropdown-item" onClick={() => setDropOpen(false)}>
                      ➕ Post a Listing
                    </Link>
                    <Link href="/dashboard/listings" className="dropdown-item" onClick={() => setDropOpen(false)}>
                      📋 My Listings
                    </Link>
                    <Link href="/dashboard/profile" className="dropdown-item" onClick={() => setDropOpen(false)}>
                      👤 Profile
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-secondary btn-sm">
                  Login
                </Link>
                <Link href="/auth/register" className="btn btn-primary btn-sm">
                  Post Listing
                </Link>
              </>
            )}
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
