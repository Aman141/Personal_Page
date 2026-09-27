"use client";

import { useEffect, useRef } from "react";

/** Matches `--sonar-stroke`. Only used if the token cannot be read. */
const FALLBACK_STROKE = "#82cfff";

const GRID_SPACING = 72;
const WAVE_COUNT = 6;

/**
 * The animated sonar sweep behind the hero. Six sine traces over a faint grid,
 * each with its own frequency, amplitude and phase speed, enveloped so they
 * taper to nothing at both edges rather than being clipped mid-oscillation.
 *
 * Purely decorative, so it is `aria-hidden` and carries no text.
 */
export default function SonarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Read the stroke colour off the document so this stays in step with
    // globals.css instead of holding a second copy of the value. It has to be
    // re-read on every theme change, not just at mount: the token flips
    // between a light accent and a dark blue, and a canvas keeps whatever was
    // painted last, so a stale colour survives until something forces a
    // repaint.
    let colour = FALLBACK_STROKE;
    const readColour = () => {
      const token = getComputedStyle(document.documentElement)
        .getPropertyValue("--sonar-stroke")
        .trim();
      // Alpha is appended as two hex digits below, so anything but a 6-digit
      // hex would produce an invalid strokeStyle and draw nothing.
      colour = /^#[0-9a-f]{6}$/i.test(token) ? token : FALLBACK_STROKE;
    };
    readColour();

    const stroke = (alpha: number) =>
      colour +
      Math.round(255 * alpha)
        .toString(16)
        .padStart(2, "0");

    // The canvas is stretched by CSS, so its backing store has to be sized in
    // device pixels and the context scaled to match — otherwise every line is
    // soft on a retina display.
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, canvas.clientWidth * dpr);
      canvas.height = Math.max(1, canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = stroke(0.05);
      ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += GRID_SPACING) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += GRID_SPACING) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      for (let i = 0; i < WAVE_COUNT; i++) {
        const amp = h * (0.05 + i * 0.02);
        const baseY = h * (0.3 + i * 0.075);
        const speed = 0.9 + i * 0.35;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const freq = 0.004 + (x / w) * 0.015 + i * 0.001;
          // Sine envelope: zero at both edges, so traces fade in and out
          // rather than being cut off by the section boundary.
          const env = Math.sin((x / w) * Math.PI) ** 1.4;
          const y =
            baseY + Math.sin(x * freq + t * speed * 0.02 + i) * amp * env;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = stroke(Math.max(0.05, 0.3 - i * 0.04));
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let raf: number | null = null;

    const loop = () => {
      paint(frame);
      frame += 1;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    };

    const start = () => {
      if (raf !== null) return;
      // One static frame for anyone who has asked their OS to reduce motion.
      // The artwork still lands; it just holds still.
      if (reduced.matches) {
        paint(0);
        return;
      }
      loop();
    };

    // A hero animation that keeps burning frames after the visitor has scrolled
    // past it is pure battery cost, so the loop is tied to visibility.
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    observer.observe(canvas);

    // Toggling the OS setting mid-visit should take effect without a reload.
    const onPreferenceChange = () => {
      stop();
      start();
    };
    reduced.addEventListener("change", onPreferenceChange);

    // ThemeContext toggles `.dark` on <html>. Watching the attribute is what
    // keeps the sweep in the right colour after a toggle — under reduced
    // motion especially, where only one frame is ever painted and nothing else
    // would trigger a repaint.
    const themeObserver = new MutationObserver(() => {
      readColour();
      if (reduced.matches) paint(0);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      stop();
      observer.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      reduced.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 block h-full w-full"
    />
  );
}
