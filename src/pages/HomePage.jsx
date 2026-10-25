import React from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "../components/common/icons.jsx";
import { siteConfig, contentService, useSearch } from "../dataStore.jsx";
// Consolidated Cards suite (UniverseCard, CharacterCard)
import { UniverseCard, CharacterCard } from "../components/Cards.jsx";

import "./HomePage.css";

export default function HomePage() {
  const { openModal: openSearch } = useSearch();

  const featuredUniverses = contentService.getFeaturedUniverses();
  const featuredCharacters = contentService.getFeaturedCharacters();

  return (
    <div className="home-page-root">
      {/* Wiki-First Curatorial Hero */}
      <section className="home-hero-section">
        <div className="home-hero-container">
          <div className="home-hero-kicker">Multi-Universe Entertainment Archive</div>
          <h1 className="home-hero-title">
            The Encyclopedia of Fictional Universes
          </h1>
          <p className="home-hero-subtitle">
            Explore interconnected lore across cinema, anime, manga, literature, and fictional timelines. From the Marvel Multiverse to the Shadow Monarch, all stories intersect here.
          </p>

          {/* Global Search Field */}
          <div
            className="home-search-bar"
            onClick={openSearch}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openSearch();
            }}
            aria-label="Search all universes and lore"
          >
            <Search size={20} style={{ color: "#0f172a" }} />
            <span className="home-search-input-placeholder">
              Search by character, movie, anime, webnovel, or artifact...
            </span>
            <span className="home-search-kbd">Press ⌘K</span>
          </div>

          {/* Quick Category Badges */}
          <div className="home-quick-tags">
            <Link to="/universes" className="home-quick-tag">All Universes</Link>
            <Link to="/movies" className="home-quick-tag">Cinema</Link>
            <Link to="/anime" className="home-quick-tag">Anime</Link>
            <Link to="/manga" className="home-quick-tag">Manga & Manhwa</Link>
            <Link to="/novels" className="home-quick-tag">Webnovels</Link>
            <Link to="/characters" className="home-quick-tag">Characters & 3D</Link>
          </div>
        </div>
      </section>

      <div className="page-container">
        {/* Section 1: Featured Universes */}
        <section className="mb-14">
          <div className="home-section-header">
            <div>
              <h2 className="section-title">Featured Universes</h2>
              <p className="section-subtitle">
                Explore deeply indexed fictional continuities, timelines, and world factions.
              </p>
            </div>
            <Link to="/universes" className="home-section-link">
              Explore All Universes <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid-cards">
            {featuredUniverses.slice(0, 3).map((universe) => (
              <UniverseCard key={universe.id} universe={universe} />
            ))}
          </div>
        </section>

        {/* Section 2: Popular Characters & 3D Codex */}
        <section className="mb-14">
          <div className="home-section-header">
            <div>
              <h2 className="section-title">Character Codex & 3D Models</h2>
              <p className="section-subtitle">
                Inspect character biographies, abilities, relationships, and interactive 3D models.
              </p>
            </div>
            <Link to="/characters" className="home-section-link">
              View All Characters <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid-cards">
            {featuredCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
