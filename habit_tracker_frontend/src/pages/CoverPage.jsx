import React, { useEffect, useRef, useCallback } from 'react';
import './cover.css';

/**
 * PUBLIC_INTERFACE
 * CoverPage renders the generated Cover static design inside a namespaced wrapper.
 * - Markup adapted from assets/index.html (main#cover and children)
 * - Styles copied/prefixed under .cover-root in cover.css to avoid global leakage
 * - Interactions from assets/app.js (nav toggle + Escape close) implemented with useEffect
 *
 * Maintenance notes:
 * - When updating styles, keep selectors under .cover-root to avoid global conflicts.
 * - Images are served from /assets/... in public; update import paths accordingly if moved.
 * - Avoid direct document/window global handlers outside useEffect to maintain React safety.
 */
export default function CoverPage() {
  const toggleRef = useRef(null);
  const navRef = useRef(null);

  // Toggle handler replicates assets/app.js behavior
  const onToggle = useCallback(() => {
    const toggle = toggleRef.current;
    const nav = navRef.current;
    if (!toggle || !nav) return;
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    if (expanded) {
      nav.hidden = true;
    } else {
      nav.hidden = false;
      const firstLink = nav.querySelector('a');
      if (firstLink && typeof firstLink.focus === 'function') {
        firstLink.focus();
      }
    }
  }, []);

  useEffect(() => {
    const toggle = toggleRef.current;
    const nav = navRef.current;
    if (!toggle || !nav) return;

    // Click binding
    toggle.addEventListener('click', onToggle);
    // Escape key close
    const onKey = (e) => {
      if (e.key === 'Escape' && nav && !nav.hidden) {
        nav.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        if (typeof toggle.focus === 'function') toggle.focus();
      }
    };
    window.addEventListener('keydown', onKey);

    // Cleanup
    return () => {
      toggle.removeEventListener('click', onToggle);
      window.removeEventListener('keydown', onKey);
    };
  }, [onToggle]);

  return (
    <div className="cover-root">
      <main id="cover" aria-label="Cover">
        {/* Background gradient layer per Ocean Professional */}
        <div className="cover-bg" aria-hidden="true" />

        {/* Figma FRAME root container 2048x1456 at origin; centered responsively */}
        <section className="canvas" role="img" aria-label="Cover composition from Figma 0:4">
          {/* Vector outlines: approximated via CSS */}
          <div className="vector vector-a" aria-hidden="true" />
          <div className="vector vector-b" aria-hidden="true" />

          {/* Title */}
          <h1 className="title">HABITA Habit Tracker</h1>

          {/* Three device preview rectangles: images relocated into public/assets/figmaimages */}
          <figure className="shot shot-0">
            <img src="/assets/figma_image_0_8.png" alt="Home-2 screen" />
          </figure>

          <figure className="shot shot-1">
            <img src="/assets/figma_image_0_9.png" alt="Your Goals Detail Process screen" />
          </figure>

          <figure className="shot shot-2">
            <img src="/assets/figma_image_0_10.png" alt="Home screen" />
          </figure>
        </section>

        {/* Minimal top nav (for interactivity) */}
        <button ref={toggleRef} className="nav-toggle" aria-controls="site-nav" aria-expanded="false">
          <span className="sr-only">Toggle navigation</span>
          ☰
        </button>
        <nav id="site-nav" ref={navRef} hidden aria-label="Primary">
          <ul>
            <li><a href="#" aria-current="page">Cover</a></li>
          </ul>
        </nav>
      </main>
    </div>
  );
}
