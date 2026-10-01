import { useEffect, useRef } from "react";
import { celestialObjects, type CelestialObject } from "@/data/celestialObjects";
import { useExplorerTravel } from "./useExplorerTravel";
import { useReducedMotion } from "framer-motion";

import { planetDiameters } from "@/data/explorerImagery";
export function PlanetComparison({
  onOpen,
  onClose,
}: {
  onOpen: (o: CelestialObject) => void;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const [zoom, go] = useExplorerTravel(3, !!reduced, 1.6);
  const stage = useRef<HTMLDivElement>(null);
  const kmPerPixel = 1400 / Math.pow(2, zoom);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      go((v) => v - e.deltaY * (e.deltaMode === 1 ? 16 : 1) * 0.002);
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [go]);
  return (
    <section className="planet-comparison" aria-label="Planet size comparison">
      <header>
        <div>
          <p>TEAM DIAMONDS · SCALE LAB</p>
          <h2>
            Solar System
            <br />
            at scale
          </h2>
          <p>1 screen pixel ≈ {Math.round(kmPerPixel).toLocaleString()} km</p>
          <small>
            Circle diameters to scale · spacing and photographs illustrative · rings excluded
          </small>
        </div>
        <button onClick={onClose}>Back to journey ×</button>
      </header>
      <div ref={stage} className="comparison-worlds">
        {Object.entries(planetDiameters).map(([id, diameter]) => {
          const o = celestialObjects.find((x) => x.id === id)!;
          return (
            <button
              key={id}
              onClick={() => onOpen(o)}
              aria-label={`Discover ${o.name}`}
              className="comparison-target"
            >
              <span
                className="comparison-disk"
                style={{
                  width: diameter / kmPerPixel,
                  height: diameter / kmPerPixel,
                  backgroundColor: o.color,
                }}
              >
                <img src={`/explorer/${id}.jpg`} alt="" draggable={false} />
              </span>
              <strong>{o.name}</strong>
              <small>{diameter.toLocaleString()} km</small>
            </button>
          );
        })}
      </div>
      <footer>
        <label>
          Zoom in{" "}
          <input
            type="range"
            aria-label="Planet comparison zoom"
            min="0"
            max="3"
            step=".01"
            value={zoom}
            onChange={(e) => go(Number(e.target.value))}
          />
        </label>
        <p>Scroll to zoom · swipe sideways to see every world · tap to discover</p>
        <a href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/" target="_blank" rel="noreferrer">
          NASA diameter measurements ↗
        </a>
      </footer>
    </section>
  );
}
