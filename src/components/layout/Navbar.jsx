import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Bookmark, Menu, X, Globe, User, Film, BookOpen, Scroll } from "../common/icons.jsx";
import { siteConfig, useLibrary, useSearch, searchService } from "../../dataStore.jsx";
import "./Navbar.css";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items: libraryItems, removeItem, clearLibrary } = useLibrary();
  const { openModal: openSearchModal } = useSearch();
  const navigate = useNavigate();

  // Instant Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Bookmarks Popover State
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const bookmarksContainerRef = useRef(null);

  // Live search query
  const searchResults = searchQuery.trim().length > 0 
    ? searchService.search(searchQuery, { type: "all" }).results 
    : [];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (bookmarksContainerRef.current && !bookmarksContainerRef.current.contains(e.target)) {
        setIsBookmarksOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut listener to focus search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsBookmarksOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectResult = (url) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate(url);
  };

  const handleSearchKeyDown = (e) => {
    if (searchResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSearchIndex((prev) => (prev + 1) % Math.min(searchResults.length, 8));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSearchIndex((prev) => (prev - 1 + Math.min(searchResults.length, 8)) % Math.min(searchResults.length, 8));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (searchResults[selectedSearchIndex]) {
        handleSelectResult(searchResults[selectedSearchIndex].url);
      }
    }
  };

  const getItemIcon = (type) => {
    switch (type) {
      case "universe": return <Globe size={15} />;
      case "character": return <User size={15} />;
      case "movie":
      case "series": return <Film size={15} />;
      case "manga":
      case "manhwa":
      case "anime": return <BookOpen size={15} />;
      default: return <Scroll size={15} />;
    }
  };

  const getItemUrl = (item) => {
    if (item.type === "character") return `/characters/${item.slug}`;
    if (item.type === "article") return `/articles/${item.slug}`;
    return `/media/${item.slug}`;
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Zone 1: Single text element wordmark */}
        <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
          <span className="navbar-brand-symbol">L</span>
          <span className="navbar-brand-name">
            {siteConfig.name}
            <span className="navbar-brand-dot">.</span>
          </span>
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <NavLink
            to="/explore"
            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
          >
            Explore
          </NavLink>
          <NavLink
            to="/universes"
            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
          >
            Universes
          </NavLink>
          <NavLink
            to="/movies"
            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
          >
            Cinema & Series
          </NavLink>
          <NavLink
            to="/anime"
            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
          >
            Anime & Manga
          </NavLink>
          <NavLink
            to="/characters"
            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
          >
            Characters
          </NavLink>
          <NavLink
            to="/cyberfiction"
            className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
            style={({ isActive }) => ({ color: isActive ? "#0f172a" : "#0284c7", fontWeight: 600 })}
          >
            Cyberfiction
          </NavLink>
        </nav>

        {/* Zone 3: Easy Search Bar & Interactive Bookmarks */}
        <div className="navbar-actions">
          {/* Simple Inline Search Bar */}
          <div className="navbar-search-wrapper" ref={searchContainerRef}>
            <div className={`navbar-inline-search ${isSearchOpen ? "focused" : ""}`}>
              <Search size={15} className="navbar-search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                className="navbar-search-field"
                placeholder="Search lore, characters, movies..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                  setSelectedSearchIndex(0);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) setIsSearchOpen(true);
                }}
                onKeyDown={handleSearchKeyDown}
              />
              {searchQuery ? (
                <button
                  type="button"
                  className="navbar-search-clear-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                    searchInputRef.current?.focus();
                  }}
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              ) : (
                <span className="navbar-search-shortcut" onClick={openSearchModal} title="Press ⌘K for full search">⌘K</span>
              )}
            </div>

            {/* Instant Floating Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="navbar-search-dropdown">
                {searchResults.length === 0 ? (
                  <div className="navbar-search-empty">
                    No results for "{searchQuery}"
                  </div>
                ) : (
                  <div className="navbar-search-list">
                    {searchResults.slice(0, 7).map((item, index) => (
                      <button
                        key={`${item.type}-${item.id}`}
                        type="button"
                        className={`navbar-search-item ${selectedSearchIndex === index ? "active" : ""}`}
                        onClick={() => handleSelectResult(item.url)}
                        onMouseEnter={() => setSelectedSearchIndex(index)}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="navbar-search-thumb"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="navbar-search-icon-box">{getItemIcon(item.type)}</div>
                        )}
                        <div className="navbar-search-info">
                          <span className="navbar-search-item-title">{item.title}</span>
                          <span className="navbar-search-item-sub">{item.subtitle}</span>
                        </div>
                        <span className={`navbar-search-tag tag-${item.type}`}>{item.type}</span>
                      </button>
                    ))}
                    {searchResults.length > 7 && (
                      <button
                        type="button"
                        className="navbar-search-more"
                        onClick={() => {
                          setIsSearchOpen(false);
                          openSearchModal();
                        }}
                      >
                        See all {searchResults.length} results in modal →
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Simple Interactive Bookmarks Popover Button */}
          <div className="navbar-bookmarks-wrapper" ref={bookmarksContainerRef}>
            <button
              type="button"
              className={`navbar-bookmarks-btn ${isBookmarksOpen ? "active" : ""} ${libraryItems.length > 0 ? "has-items" : ""}`}
              onClick={() => {
                setIsBookmarksOpen(!isBookmarksOpen);
                setIsSearchOpen(false);
              }}
              title="View your bookmarks"
              aria-label="Bookmarks"
            >
              <Bookmark size={15} fill={libraryItems.length > 0 ? "currentColor" : "none"} />
              <span>Bookmarks</span>
              {libraryItems.length > 0 && (
                <span className="navbar-bookmarks-count">{libraryItems.length}</span>
              )}
            </button>

            {/* Quick Bookmarks Popover Menu */}
            {isBookmarksOpen && (
              <div className="navbar-bookmarks-popover">
                <div className="navbar-bookmarks-popover-header">
                  <div className="flex items-center gap-2">
                    <Bookmark size={14} className="text-amber-500" fill="currentColor" />
                    <span className="font-semibold text-slate-900 text-sm">
                      My Bookmarks {libraryItems.length > 0 ? `(${libraryItems.length})` : ""}
                    </span>
                  </div>
                  {libraryItems.length > 0 && (
                    <button
                      type="button"
                      className="navbar-bookmarks-clear"
                      onClick={() => {
                        if (window.confirm("Clear all bookmarks?")) {
                          clearLibrary();
                        }
                      }}
                      title="Clear all bookmarks"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="navbar-bookmarks-popover-body">
                  {libraryItems.length === 0 ? (
                    <div className="navbar-bookmarks-empty-box">
                      <Bookmark size={24} className="text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700 text-sm">No bookmarks yet</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto">
                        Click the bookmark icon on any character or film to save it here!
                      </p>
                    </div>
                  ) : (
                    <div className="navbar-bookmarks-items-list">
                      {libraryItems.map((item) => (
                        <div key={item.id} className="navbar-bookmark-item-row">
                          <Link
                            to={getItemUrl(item)}
                            className="navbar-bookmark-item-link"
                            onClick={() => setIsBookmarksOpen(false)}
                          >
                            {item.portrait || item.coverImage || item.image ? (
                              <img
                                src={item.portrait || item.coverImage || item.image}
                                alt={item.title}
                                className="navbar-bookmark-item-thumb"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="navbar-bookmark-item-icon">
                                <Bookmark size={14} />
                              </div>
                            )}
                            <div className="navbar-bookmark-item-text">
                              <span className="navbar-bookmark-item-title">{item.title}</span>
                              <span className="navbar-bookmark-item-sub">
                                {item.universeName || item.category || item.type}
                              </span>
                            </div>
                          </Link>
                          <button
                            type="button"
                            className="navbar-bookmark-delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeItem(item.id);
                            }}
                            title="Remove bookmark"
                            aria-label={`Remove ${item.title}`}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {libraryItems.length > 0 && (
                  <div className="navbar-bookmarks-popover-footer">
                    <Link
                      to="/library"
                      className="navbar-bookmarks-full-link"
                      onClick={() => setIsBookmarksOpen(false)}
                    >
                      Open Full Library View →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`navbar-mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <nav className="navbar-mobile-links">
          {siteConfig.navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `navbar-mobile-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/about"
            className={({ isActive }) => `navbar-mobile-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            About Loreverse
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
