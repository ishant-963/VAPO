import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./CyberfictionScrollPage.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CyberfictionScrollPage() {
  const mainRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const main = mainRef.current;
    const canvas = canvasRef.current;
    if (!main || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Resize Canvas to fit screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    const frameCount = 300;
    const images = [];
    const imageSeq = { frame: 0 };

    const getFileUrl = (index) => {
      const base = import.meta.env.BASE_URL.endsWith("/")
        ? import.meta.env.BASE_URL
        : `${import.meta.env.BASE_URL}/`;
      const num = String(index + 1).padStart(4, "0");
      return `${base}male${num}.png`;
    };

    const render = () => {
      const frame = Math.round(imageSeq.frame);
      const img = images[frame];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const hRatio = canvasWidth / img.width;
      const vRatio = canvasHeight / img.height;
      const ratio = Math.max(hRatio, vRatio);

      const centerShiftX = (canvasWidth - img.width * ratio) / 2;
      const centerShiftY = (canvasHeight - img.height * ratio) / 2;

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.drawImage(
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

    // Preload Images
    let loadedCount = 0;
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = getFileUrl(i);
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / frameCount) * 100));
        if (loadedCount === 1) render();
        if (loadedCount >= 30) setIsLoaded(true);
      };
      img.onerror = () => {
        // Fallback to cyberfiction/ folder if maleXXXX was placed inside cyberfiction/
        const base = import.meta.env.BASE_URL.endsWith("/")
          ? import.meta.env.BASE_URL
          : `${import.meta.env.BASE_URL}/`;
        img.src = `${base}cyberfiction/male${String(i + 1).padStart(4, "0")}.png`;
      };
      images.push(img);
    }

    // ScrollTrigger: Scrub Canvas animation through the entire length of #main
    const scrubTrigger = gsap.to(imageSeq, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: main,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.25,
        onUpdate: render,
      },
    });

    // Pinned Sections for each page
    const p1Trigger = ScrollTrigger.create({
      trigger: "#cyber-page1",
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
    });

    const p2Trigger = ScrollTrigger.create({
      trigger: "#cyber-page2",
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
    });

    const p3Trigger = ScrollTrigger.create({
      trigger: "#cyber-page3",
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
    });

    const handleResize = () => {
      resizeCanvas();
      render();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      scrubTrigger.kill();
      p1Trigger.kill();
      p2Trigger.kill();
      p3Trigger.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="cyberfiction-scroll-view">
      {/* Top Fixed Nav */}
      <nav id="cyber-nav">
        <h3>
          <b>CYBER</b>FICTION*
        </h3>
        <button
          type="button"
          onClick={() => navigate("/")}
          title="Return to Loreverse Home"
        >
          ← BACK TO LOREVERSE
        </button>
      </nav>

      {/* Loading Bar if assets are still loading */}
      {!isLoaded && loadProgress < 100 && (
        <div className="cyber-loading-banner">
          <span>INITIALIZING 3D METAVERSE CANVAS · {loadProgress}%</span>
        </div>
      )}

      {/* Persistent Background Canvas */}
      <canvas ref={canvasRef} id="cyber-canvas"></canvas>

      {/* Main Scroll Content */}
      <div id="cyber-main" ref={mainRef}>
        {/* PAGE 0 */}
        <section id="cyber-page0" className="cyber-scroll-section">
          <div id="cyber-loop">
            <h1>
              <b>CYBER</b>FICTION IS THE{" "}
              <b>
                <i>REAL</i>
              </b>{" "}
              <span>STORY</span> IN THE{" "}
              <span>
                <i>METAVERSE.</i>
              </span>
            </h1>
            <h1>
              <b>CYBER</b>FICTION IS THE{" "}
              <b>
                <i>REAL</i>
              </b>{" "}
              <span>STORY</span> IN THE{" "}
              <span>
                <i>METAVERSE.</i>
              </span>
            </h1>
          </div>

          <div className="cyber-intro-text">
            <h3>
              CYBERFICTION AIMS TO BE A DECENTRALIZED COMMUNITY THAT CAN
              <br />
              CREATE NEW VALUES AND PROFITS THROUGH PLAY IN THE VIRTUAL
              <br />
              WORLD.
            </h3>
            <h4>...SCROLL TO READ</h4>
          </div>
        </section>

        {/* PAGE 1 */}
        <section id="cyber-page1" className="cyber-scroll-section">
          <div id="cyber-right-text">
            <h3>CYBERFICTION / KEY WORD</h3>
            <h1>
              HAVE FUN
              <br />
              LET'S PLAY
              <br />
              JUST BE TOGETHER
            </h1>
          </div>

          <div id="cyber-left-text">
            <h1>
              MAKE A STORY
              <br />
              TAKE A CHANCE
              <br />
              BUILD AND OWNED
            </h1>
            <h3>..AND MAINTAIN GOOD HUMANITY</h3>
          </div>
        </section>

        {/* PAGE 2 */}
        <section id="cyber-page2" className="cyber-scroll-section">
          <div id="cyber-text1">
            <h3>CYBERFICTION / HAVE FUN</h3>
            <h1>
              LET'S
              <br />
              HAVE FUN
              <br />
              TOGETHER
            </h1>
          </div>

          <div id="cyber-text2">
            <p>
              LET'S HAVE A BLAST! LET'S JUST THROW AWAY AGE, GENDER, REGION,
              <br />
              STATUS, ETC., DON'T COMPETE, DON'T FIGHT, COOPERATE AND SHARE
              <br />
              WITH EACH OTHER AND ENJOY IT TOGETHER! SO THAT YOU CAN STAND
              <br />
              THERE IN THE NOT-TOO-DISTANT FUTURE AND DREAM OF ANOTHER NEW
              <br />
              FUTURE
            </p>
          </div>
        </section>

        {/* PAGE 3 */}
        <section id="cyber-page3" className="cyber-scroll-section">
          <div id="cyber-text3">
            <h3>CYBERFICTION / PLAYGROUND</h3>
            <h1>
              CYBERFIELD
              <br />
              IS OUR
              <br />
              PLAYGROUND
            </h1>
          </div>
        </section>
      </div>
    </div>
  );
}