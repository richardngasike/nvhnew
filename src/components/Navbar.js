'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  FiHome,
  FiSearch,
  FiStar,
  FiInfo,
  FiGrid,
  FiPlusCircle,
  FiList,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const { landlord, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled]     = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);
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

  /* close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
    setDropOpen(false);
  }, [pathname]);

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

          {/* ── Logo ── */}
          <Link href="/" className="logo">
            <div className="logo-icon">
              <Image
                src="/favicon.ico"
                alt="Nairobi Vacant Houses logo"
                width={32}
                height={32}
                priority
              />
            </div>
            <div className="logo-text">
              Nairobi Vacant Houses
              <span>Find Your Perfect Home</span>
            </div>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
            <Link
              href="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <FiHome className="nav-icon" />
              Home
            </Link>

            <Link
              href="/listings"
              className={`nav-link ${isActive('/listings') ? 'active' : ''}`}
            >
              <FiSearch className="nav-icon" />
              Browse Houses
            </Link>

            <Link
              href="/listings?featured=true"
              className="nav-link"
            >
              <FiStar className="nav-icon" />
              Featured
            </Link>

            <Link
              href="/about"
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              <FiInfo className="nav-icon" />
              About
            </Link>
          </div>

          {/* ── Actions ── */}
          <div className="nav-actions">
            {landlord ? (
              <div className="landlord-menu" ref={dropRef}>
                <button
                  className="landlord-btn"
                  onClick={() => setDropOpen(!dropOpen)}
                  aria-expanded={dropOpen}
                  aria-haspopup="true"
                >
                  <div className="landlord-avatar">
                    {landlord.name[0].toUpperCase()}
                  </div>
                  <span className="hide-mobile">
                    {landlord.name.split(' ')[0]}
                  </span>
                  <FiChevronDown
                    className={`chevron ${dropOpen ? 'chevron-open' : ''}`}
                  />
                </button>

                {dropOpen && (
                  <div className="dropdown-menu" role="menu">
                    <Link
                      href="/dashboard"
                      className="dropdown-item"
                      onClick={() => setDropOpen(false)}
                      role="menuitem"
                    >
                      <FiGrid className="drop-icon" />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/post"
                      className="dropdown-item"
                      onClick={() => setDropOpen(false)}
                      role="menuitem"
                    >
                      <FiPlusCircle className="drop-icon" />
                      Post a Listing
                    </Link>

                    <Link
                      href="/dashboard/listings"
                      className="dropdown-item"
                      onClick={() => setDropOpen(false)}
                      role="menuitem"
                    >
                      <FiList className="drop-icon" />
                      My Listings
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      className="dropdown-item"
                      onClick={() => setDropOpen(false)}
                      role="menuitem"
                    >
                      <FiUser className="drop-icon" />
                      Profile
                    </Link>

                    <div className="dropdown-divider" />

                    <button
                      className="dropdown-item danger"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <FiLogOut className="drop-icon" />
                      Logout
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

            {/* Mobile hamburger */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}