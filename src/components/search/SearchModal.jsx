import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Globe, User, Film, BookOpen, Scroll } from "../common/icons.jsx";
import { useSearch, searchService } from "../../dataStore.jsx";
import "./SearchModal.css";

const QUICK_SUGGESTIONS = [
  "Spider-Man",
  "Iron Man",
  "Solo Leveling",
  "Darth Vader",
  "Marvel Cinematic Universe",
  "Attack on Titan"
];

export default function SearchModal() {
  const { isModalOpen, openModal, closeModal } = useSearch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Keyboard shortcut listener: Cmd+K / Ctrl+K, /, and ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isModalOpen) closeModal();
        else openModal();
      } else if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, closeModal, openModal]);

  // Auto focus input when opened
  useEffect(() => {
    if (isModalOpen) {
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm("");
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const { results, total } = searchService.search(searchTerm, { type: "all" });

  const handleResultClick = (url) => {
    closeModal();
    navigate(url);
  };

  const handleKeyDown = (e) => {
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleResultClick(results[selectedIndex].url);
      }
    }
  };

  const getItemIcon = (type) => {
    switch (type) {
      case "universe": return <Globe size={18} />;
      case "character": return <User size={18} />;
      case "movie":
      case "series": return <Film size={18} />;
      case "manga":
      case "manhwa":
      case "anime": return <BookOpen size={18} />;
      default: return <Scroll size={18} />;
    }
  };

  return (
    <div
      className="search-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Instant Universal Search"
    >
      <div className="search-modal-container">
        {/* Simple Search Input Bar */}
        <div className="search-modal-header">
          <Search size={20} className="search-modal-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Search characters, universes, movies, anime..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <button
              type="button"
              className="search-modal-clear"
              onClick={() => {
                setSearchTerm("");
                inputRef.current?.focus();
              }}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            className="search-modal-close"
            onClick={closeModal}
            aria-label="Close search"
          >
            Esc
          </button>
        </div>

        {/* Results Body */}
        <div className="search-modal-body">
          {searchTerm.trim().length === 0 ? (
            <div className="search-modal-empty">
              <h4 className="search-modal-empty-title">Instant Search</h4>
              <p className="search-modal-empty-desc">
                Type any character name, fictional universe, film, or lore article to search immediately:
              </p>
              <div className="search-modal-suggestions">
                {QUICK_SUGGESTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="search-suggestion-chip"
                    onClick={() => {
                      setSearchTerm(tag);
                      inputRef.current?.focus();
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : total === 0 ? (
            <div className="search-modal-empty">
              <h4 className="search-modal-empty-title">No matches found</h4>
              <p className="search-modal-empty-desc">
                No entries found for "{searchTerm}". Try a different spelling or keyword.
              </p>
            </div>
          ) : (
            <div className="search-results-flat-list">
              {results.map((item, index) => (
                <button
                  key={`${item.type}-${item.id}`}
                  type="button"
                  className={`search-result-item ${selectedIndex === index ? "active" : ""}`}
                  onClick={() => handleResultClick(item.url)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="search-result-thumb"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="search-result-icon-box">{getItemIcon(item.type)}</div>
                  )}
                  <div className="search-result-info">
                    <div className="search-result-title">{item.title}</div>
                    <div className="search-result-subtitle">{item.subtitle}</div>
                  </div>
                  <span className={`search-result-type-tag tag-${item.type}`}>
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clean Footer */}
        <div className="search-modal-footer">
          <div className="search-footer-hints">
            <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
            <span><kbd>↵</kbd> to select</span>
            <span><kbd>ESC</kbd> to close</span>
          </div>
          {total > 0 && <span>{total} {total === 1 ? "result" : "results"}</span>}
        </div>
      </div>
    </div>
  );
}
