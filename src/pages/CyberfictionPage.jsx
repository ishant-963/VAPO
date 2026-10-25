import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { contentService, useSearch } from "../dataStore.jsx";
import {
  UniverseCard,
  CharacterCard,
  MediaCard,
  ArticleCard,
} from "../components/Cards.jsx";
import {
  Sparkles,
  ArrowRight,
  Search,
  Film,
  Tv,
  BookOpen,
  Layers,
  Scroll,
  Library,
} from "../components/common/icons.jsx";
import "./CyberfictionPage.css";

export default function CyberfictionPage() {
  const navigate = useNavigate();
  const previewCanvasRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(1);
  const { openModal: openSearch } = useSearch();

  // Load website components data
  const cyberMedia = contentService.getCyberfictionMedia();
  const featuredUniverses = contentService.getFeaturedUniverses();
  const featuredCharacters = contentService.getFeaturedCharacters();
  const featuredMedia = contentService.getFeaturedMedia();
  const featuredArticles = contentService.getFeaturedArticles();

  // Interactive preview scrubber for the "First Page" showcase card
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isMounted = true;
    const img = new Image();

    const renderPreviewFrame = (idx) => {
      const padded = String(Math.max(1, Math.min(300, idx))).padStart(4, "0");
      img.src = `${import.meta.env.BASE_URL}cyberfiction/male${padded}.png`;
      img.onload = () => {
        if (!isMounted) return;
        canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1) || 600;
        canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1) || 450;

        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.min(hRatio, vRatio);

        const centerShiftX = (canvas.width - img.width * ratio) / 2;
        const centerShiftY = (canvas.height - img.height * ratio) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShiftX,
          centerShiftY,
          img.width * ratio,
          img.height * ratio
        );
      };
    };

    renderPreviewFrame(currentFrame);

    return () => {
      isMounted = false;
    };
  }, [currentFrame]);

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const targetFrame = Math.max(1, Math.min(300, Math.round(pct * 299) + 1));
    setCurrentFrame(targetFrame);
  };

  return (
    <div className="cyberfiction-page">
      {/* Cyberfiction World Hero */}
      <section className="cyber-world-hero">
        <div className="cyber-content-container">
          <div className="cyber-world-hero-badge">
            <span className="cyber-badge-dot"></span>
            <span>Metaverse Protocol & Web3 Frontier</span>
          </div>

          <h1 className="cyber-world-hero-title">
            The Cyberfiction World
          </h1>

          <p className="cyber-world-hero-desc">
            A separate entertainment medium created in virtual worlds. Unlike serialized prose novels or static manhwa panels, Cyberfiction fuses 3D canvas consciousness, collaborative metaverse stories, and decentralized play.
          </p>

          <div className="cyber-world-hero-actions">
            <Link to="/cyberfiction/scroll" className="cyber-btn-primary" style={{ padding: "12px 28px", fontSize: "14px" }}>
              <span>▶ Launch 300 Photo Scroll (First Page)</span>
              <ArrowRight size={16} />
            </Link>
            <button
              type="button"
              className="cyber-btn-outline"
              onClick={openSearch}
              style={{ padding: "12px 24px", fontSize: "14px" }}
            >
              <Search size={16} />
              <span>Search Cyber Lore & Works</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= FIRST PAGE SHOWCASE (Click to open 300-photo scroll) ================= */}
      <section className="cyber-white-section" style={{ paddingTop: "20px" }}>
        <div className="cyber-content-container">
          <div className="cyber-first-page-card" onClick={() => navigate("/cyberfiction/scroll")}>
            <div className="cyber-first-page-info">
              <div className="cyber-section-kicker">
                <span>PAGE 01</span> // INTERACTIVE 300-PHOTO SCROLL EXPERIENCE
              </div>
              <h2 className="cyber-first-page-title">
                The Real Story in the Metaverse: 300 Photo Avatar Genesis
              </h2>
              <p className="cyber-first-page-desc">
                Click this first page to enter the full 300-photo scroll sequence. Scrub through real-time 3D rendered avatar frames with kinetic typography, infinite marquee loops, and interactive locomotive camera tracking.
              </p>

              <div className="cyber-first-page-features">
                <div className="cyber-feat-tag">
                  <Sparkles size={13} style={{ color: "#0284c7" }} />
                  <span>300 High-Res Frames</span>
                </div>
                <div className="cyber-feat-tag">
                  <span>GSAP Smooth Scrub</span>
                </div>
                <div className="cyber-feat-tag">
                  <span>Transparent 3D Canvas</span>
                </div>
              </div>

              <div className="cyber-first-page-cta-wrap">
                <Link
                  to="/cyberfiction/scroll"
                  className="cyber-btn-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Open 300 Photo Scroll Page</span>
                  <ArrowRight size={15} />
                </Link>
                <span className="cyber-first-page-hint">
                  Click anywhere on this card to launch 300-photo scroll
                </span>
              </div>
            </div>

            {/* Interactive Preview Canvas */}
            <div
              className="cyber-first-page-preview"
              onMouseMove={handleCardMouseMove}
              title="Move your mouse across horizontally to scrub preview"
            >
              <canvas ref={previewCanvasRef} className="cyber-preview-canvas-el" />
              <div className="cyber-preview-overlay">
                <div className="cyber-preview-hud">
                  FRAME {String(currentFrame).padStart(3, "0")} / 300 · HOVER TO SCRUB
                </div>
                <div className="cyber-preview-btn-badge">
                  <span>CLICK TO OPEN FULL SCROLL →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= METAVERSE PROTOCOL PILLARS ================= */}
      <section id="manifesto" className="cyber-white-section">
        <div className="cyber-content-container">
          <div className="cyber-section-kicker">
            <span>02</span> // CORE METAVERSE PILLARS
          </div>
          <h2 className="cyber-white-title">
            The Decentralized <span>Playground Protocol</span>
          </h2>
          <p className="cyber-white-lead">
            Cyberfiction is an open living medium where creators and players co-author reality in real-time virtual dimensions.
          </p>

          <div className="cyber-pillars-grid">
            <div className="cyber-pillar-card">
              <div className="cyber-pillar-num">01</div>
              <h3 className="cyber-pillar-title">Have Fun Together</h3>
              <p className="cyber-pillar-desc">
                Tear down regional, cultural, and generational barriers. A non-zero-sum space where play and collaborative connection supersede competition.
              </p>
              <div className="cyber-pillar-tag">Open Playground</div>
            </div>

            <div className="cyber-pillar-card">
              <div className="cyber-pillar-num">02</div>
              <h3 className="cyber-pillar-title">Make a Story</h3>
              <p className="cyber-pillar-desc">
                Lore isn't dictated by central publishing houses. Every character movement, duel, and narrative fork is recorded in decentralized chronicles.
              </p>
              <div className="cyber-pillar-tag">Living Lore</div>
            </div>

            <div className="cyber-pillar-card">
              <div className="cyber-pillar-num">03</div>
              <h3 className="cyber-pillar-title">Build & Own</h3>
              <p className="cyber-pillar-desc">
                Create virtual artifacts, 3D character avatars, dimensional realms, and own your creations directly through sovereign digital protocols.
              </p>
              <div className="cyber-pillar-tag">Sovereign Web3</div>
            </div>

            <div className="cyber-pillar-card">
              <div className="cyber-pillar-num">04</div>
              <h3 className="cyber-pillar-title">Good Humanity</h3>
              <p className="cyber-pillar-desc">
                As artificial intelligence and machine minds accelerate, our core mission remains steadfast: elevate empathy, creativity, and the human spirit.
              </p>
              <div className="cyber-pillar-tag">Human Centric</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED UNIVERSES ================= */}
      <section id="universes" className="cyber-white-section">
        <div className="cyber-content-container">
          <div className="cyber-section-header-split">
            <div>
              <div className="cyber-section-kicker">
                <span>03</span> // MULTIVERSE INDEX
              </div>
              <h2 className="cyber-white-title">
                Connected <span>Fictional Universes</span>
              </h2>
              <p className="cyber-white-lead">
                Explore narrative realms intersecting across cinema, literature, anime, and the Cyberfiction metaverse.
              </p>
            </div>
            <Link to="/universes" className="cyber-btn-outline">
              <span>Explore All Universes</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-cards">
            {featuredUniverses.slice(0, 3).map((universe) => (
              <UniverseCard key={universe.id} universe={universe} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= CHARACTER CODEX & 3D MODELS ================= */}
      <section id="characters" className="cyber-white-section">
        <div className="cyber-content-container">
          <div className="cyber-section-header-split">
            <div>
              <div className="cyber-section-kicker">
                <span>04</span> // BIOMETRIC & 3D AVATAR CODEX
              </div>
              <h2 className="cyber-white-title">
                Character Codex <span>& 3D Models</span>
              </h2>
              <p className="cyber-white-lead">
                Inspect combat ratings, metaphysical abilities, source lore, and interact with real-time 3D dimensional avatars.
              </p>
            </div>
            <Link to="/characters" className="cyber-btn-outline">
              <span>View All Characters</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-cards">
            {featuredCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= CYBERFICTION MEDIA ARCHIVE ================= */}
      <section id="cyber-codex" className="cyber-white-section">
        <div className="cyber-content-container">
          <div className="cyber-section-kicker">
            <span>05</span> // CURATED GENRE HUB
          </div>
          <h2 className="cyber-white-title">
            Cyberfiction <span>Media Archive</span>
          </h2>
          <p className="cyber-white-lead">
            Immersive virtual stories, cybernetic consciousness sagas, and decentralized storytelling protocols.
          </p>

          <div className="cyber-works-grid">
            {cyberMedia.map((media) => (
              <div key={media.id} className="cyber-work-card">
                <div className="cyber-work-image-wrap">
                  <img
                    src={media.coverImage}
                    alt={media.title}
                    className="cyber-work-image"
                    loading="lazy"
                  />
                  <span className="cyber-work-tag">Cyberfiction</span>
                </div>

                <div className="cyber-work-content">
                  <h3 className="cyber-work-title">{media.title}</h3>
                  <div className="cyber-work-meta">
                    {media.releaseYear} · {media.universeName}
                  </div>
                  <p className="cyber-work-synopsis">{media.synopsis}</p>

                  <div className="cyber-work-badges">
                    {media.genres?.map((g) => (
                      <span key={g} className="cyber-tag-chip">
                        #{g}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/media/${media.slug}`}
                    className="cyber-btn-primary"
                    style={{ textAlign: "center", marginTop: "auto" }}
                  >
                    Inspect Lore Entry →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ENTERTAINMENT DISCOVERY ================= */}
      <section className="cyber-white-section">
        <div className="cyber-content-container">
          <div className="cyber-section-header-split">
            <div>
              <div className="cyber-section-kicker">
                <span>06</span> // CROSS-MEDIA CATALOG
              </div>
              <h2 className="cyber-white-title">
                Entertainment <span>Discovery Spotlight</span>
              </h2>
              <p className="cyber-white-lead">
                Curated cinema, television series, anime, manhwa, and novels across all indexed fictional dimensions.
              </p>
            </div>
            <Link to="/explore" className="cyber-btn-outline">
              <span>Explore Full Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-cards">
            {featuredMedia.slice(0, 4).map((media) => (
              <MediaCard key={media.id} media={media} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= WIKI LORE ================= */}
      <section id="lore" className="cyber-white-section">
        <div className="cyber-content-container">
          <div className="cyber-section-header-split">
            <div>
              <div className="cyber-section-kicker">
                <span>07</span> // PRIMORDIAL ARCHIVES
              </div>
              <h2 className="cyber-white-title">
                Recently Curated <span>Wiki Lore</span>
              </h2>
              <p className="cyber-white-lead">
                Deep editorial articles exploring metaphysical systems, legendary weapons, dimensional rifts, and universe factions.
              </p>
            </div>
            <Link to="/explore" className="cyber-btn-outline">
              <span>Browse All Articles</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid-cards">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= METRICS ================= */}
      <section className="cyber-white-section cyber-metrics-section">
        <div className="cyber-content-container">
          <div className="cyber-metrics-grid">
            <div className="cyber-metric-card">
              <div className="cyber-metric-value">300</div>
              <div className="cyber-metric-label">3D Avatar Photos</div>
              <p className="cyber-metric-sub">Smooth real-time scrubbed render sequence</p>
            </div>

            <div className="cyber-metric-card">
              <div className="cyber-metric-value">5+</div>
              <div className="cyber-metric-label">Linked Universes</div>
              <p className="cyber-metric-sub">From Cyberfiction Web3 to Solo Leveling</p>
            </div>

            <div className="cyber-metric-card">
              <div className="cyber-metric-value">12+</div>
              <div className="cyber-metric-label">Codex Biographies</div>
              <p className="cyber-metric-sub">Interactive 3D models and power stats</p>
            </div>

            <div className="cyber-metric-card">
              <div className="cyber-metric-value">100%</div>
              <div className="cyber-metric-label">Open Metaverse Lore</div>
              <p className="cyber-metric-sub">Zero-friction decentralized codex access</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORY PORTALS ================= */}
      <section className="cyber-white-section">
        <div className="cyber-content-container">
          <div className="cyber-section-kicker">
            <span>08</span> // DIRECT ACCESS PORTALS
          </div>
          <h2 className="cyber-white-title">
            Explore by <span>Storytelling Medium</span>
          </h2>

          <div className="cyber-portal-grid">
            <Link to="/movies" className="cyber-portal-item">
              <div className="cyber-portal-icon"><Film size={20} /></div>
              <div className="cyber-portal-name">Cinema & Movies</div>
              <div className="cyber-portal-desc">Theatrical sagas & blockbusters</div>
            </Link>

            <Link to="/series" className="cyber-portal-item">
              <div className="cyber-portal-icon"><Tv size={20} /></div>
              <div className="cyber-portal-name">TV Series</div>
              <div className="cyber-portal-desc">Episodic dramas & limited series</div>
            </Link>

            <Link to="/anime" className="cyber-portal-item">
              <div className="cyber-portal-icon"><Sparkles size={20} /></div>
              <div className="cyber-portal-name">Anime</div>
              <div className="cyber-portal-desc">Japanese acclaimed animations</div>
            </Link>

            <Link to="/manga" className="cyber-portal-item">
              <div className="cyber-portal-icon"><BookOpen size={20} /></div>
              <div className="cyber-portal-name">Manga & Print</div>
              <div className="cyber-portal-desc">Serialized Japanese volumes</div>
            </Link>

            <Link to="/manhwa" className="cyber-portal-item">
              <div className="cyber-portal-icon"><Layers size={20} /></div>
              <div className="cyber-portal-name">Manhwa Webtoons</div>
              <div className="cyber-portal-desc">Korean full-color digital comics</div>
            </Link>

            <Link to="/novels" className="cyber-portal-item">
              <div className="cyber-portal-icon"><Scroll size={20} /></div>
              <div className="cyber-portal-name">Webnovels</div>
              <div className="cyber-portal-desc">Original prose & serialized epics</div>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="cyber-white-section" style={{ paddingBottom: "120px" }}>
        <div className="cyber-content-container">
          <div className="cyber-cta-box-white">
            <div className="cyber-cta-badge">
              <Sparkles size={14} />
              <span>METAVERSE PROTOCOL DEPLOYED</span>
            </div>
            <h3 className="cyber-cta-title-white">
              Ready to Explore the 300 Photo Avatar Genesis?
            </h3>
            <p className="cyber-cta-text-white">
              Click into the first page to experience the full 300-photo kinetic avatar sequence, or bookmark your favorite chronicles in the open loreverse.
            </p>
            <div className="cyber-cta-actions">
              <Link to="/cyberfiction/scroll" className="cyber-btn-primary">
                ▶ Open 300 Photo Scroll Page (Page 1)
              </Link>
              <Link to="/" className="cyber-btn-outline">
                Return to Fandomverse Main Page
              </Link>
              <Link to="/explore" className="cyber-btn-outline">
                Explore All Media Genres
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
