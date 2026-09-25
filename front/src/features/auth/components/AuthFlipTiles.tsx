import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import AuthQualityPanel from "./AuthQualityPanel";
import { platformQualities as qualities } from "./auth-platform-qualities";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "./auth-flip-tiles.css";
import { getExpandedTileBounds, getVisibleAuthTiles, tileWidth, tileHeight, type Geometry } from "./auth-tile-grid";

const colors = [
  "bg-primary text-primary-content",
  "bg-secondary text-secondary-content",
  "bg-accent text-accent-content",
];
type Tile = { x: number; y: number; quality: number; color: number };
const revealDuration = 980;
const currentTime = () => Date.now();

export default function AuthFlipTiles({ image, imageSrc, onClipPathChange }: { image: HTMLImageElement; imageSrc?: string; onClipPathChange: (value: string) => void }) {
  const reducedMotion = useReducedMotion();
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [heldTiles, setHeldTiles] = useState<Tile[]>([]);
  const holdTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const automaticRestoreTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const [selected, setSelected] = useState<Tile | null>(null);
  const [assignments, setAssignments] = useState([0, 1, 2]);
  const [revealedColors, setRevealedColors] = useState<number[]>([]);
  const revealTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const firstAppearance = useRef(true);
  const visibleColors = useRef(new Set<number>());
  const autoStartedAt = useRef(new Map<number, number>());
  const autoTiles = useRef<Tile[]>([]);
  const pausedAt = useRef<number | null>(null);
  const available = useMemo(() => geometry ? getVisibleAuthTiles(geometry) : [], [geometry]);
  const expandedBounds = geometry && selected ? getExpandedTileBounds(geometry) : null;
  const interaction = useRef({ protectedColors: new Set<number>(), dialogOpen: false });
  useLayoutEffect(() => {
    interaction.current = {
      protectedColors: new Set([hovered, focused, selected?.color, ...heldTiles.map((tile) => tile.color)].filter((color): color is number => color != null)),
      dialogOpen: selected !== null,
    };
  }, [hovered, focused, selected, heldTiles]);
  const activeTiles = useMemo(() => {
    if (reducedMotion) return available.flatMap((position, color) => color === selected?.color ? [] : [{ ...position, color, quality: assignments[color] }]);
    const active = new Map(tiles.map((tile) => [tile.color, tile]));
    heldTiles.forEach((tile) => active.set(tile.color, tile));
    available.forEach((position, color) => {
      if (color === hovered || color === focused || color === selected?.color) {
        active.set(color, { ...position, color, quality: assignments[color] });
      }
    });
    if (selected) active.delete(selected.color);
    return [...active.values()];
  }, [reducedMotion, available, hovered, focused, selected, assignments, tiles, heldTiles]);

  const holdTile = (tile: Tile) => {
    setHeldTiles((current) => [...current.filter((held) => held.color !== tile.color), tile]);
  };

  const takeControlOfTile = (tile: Tile) => {
    const restoreTimer = automaticRestoreTimers.current.get(tile.color);
    if (restoreTimer) clearTimeout(restoreTimer);
    automaticRestoreTimers.current.delete(tile.color);
    visibleColors.current.delete(tile.color);
    autoStartedAt.current.delete(tile.color);
    setTiles((current) => current.filter((active) => active.color !== tile.color));
    holdTile(tile);
  };

  // Each card owns its return timer. Moving to another card must not replace
  // the previous card's held state or restart its animation/countdown.
  useEffect(() => {
    const timers = holdTimers.current;
    const protectedColors = new Set([hovered, focused, selected?.color]);
    for (const [color, timer] of timers) {
      if (protectedColors.has(color) || !heldTiles.some((tile) => tile.color === color)) {
        clearTimeout(timer);
        timers.delete(color);
      }
    }
    heldTiles.forEach(({ color }) => {
      if (protectedColors.has(color) || timers.has(color) || (!reducedMotion && !revealedColors.includes(color))) return;
      timers.set(color, setTimeout(() => {
        timers.delete(color);
        setHeldTiles((current) => current.filter((tile) => tile.color !== color));
      }, 4000));
    });
  }, [heldTiles, hovered, focused, selected, revealedColors, reducedMotion]);

  useEffect(() => {
    const timers = holdTimers.current;
    const automaticTimers = automaticRestoreTimers.current;
    const revealTimeouts = revealTimers.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
      automaticTimers.forEach(clearTimeout);
      automaticTimers.clear();
      revealTimeouts.forEach(clearTimeout);
      revealTimeouts.clear();
    };
  }, []);

  useLayoutEffect(() => {
    autoTiles.current = tiles;
  }, [tiles]);

  useLayoutEffect(() => {
    const parent = image.parentElement;
    if (!parent) return;
    const measure = () => {
      const bounds = image.getBoundingClientRect();
      const container = parent.getBoundingClientRect();
      setTiles([]);
      setRevealedColors([]);
      setGeometry({
        width: bounds.width, height: bounds.height,
        left: bounds.left - container.left, top: bounds.top - container.top,
        visibleWidth: container.width,
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(image);
    observer.observe(parent);
    measure();
    return () => observer.disconnect();
  }, [image]);

  useEffect(() => {
    if (!geometry || reducedMotion) return;
    if (!available.length) return;
    if (selected) {
      pausedAt.current ??= currentTime();
      return;
    }
    const resuming = pausedAt.current !== null;
    if (pausedAt.current !== null) {
      const pausedFor = currentTime() - pausedAt.current;
      autoStartedAt.current.forEach((started, color) => autoStartedAt.current.set(color, started + pausedFor));
      pausedAt.current = null;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const restoreTimers: ReturnType<typeof setTimeout>[] = [];
    const clearTimers = () => {
      timers.forEach(clearTimeout);
      restoreTimers.forEach(clearTimeout);
      automaticRestoreTimers.current.clear();
      revealTimers.current.forEach(clearTimeout);
      revealTimers.current.clear();
    };
    const restore = (color: number, delay: number) => {
      restoreTimers[color] = setTimeout(() => {
        automaticRestoreTimers.current.delete(color);
        autoStartedAt.current.delete(color);
        setTiles((current) => current.filter((tile) => tile.color !== color));
        visibleColors.current.delete(color);
        if (visibleColors.current.size === 0) {
          const next = (color + 1) % available.length;
          clearTimeout(timers[next]);
          schedule(next, 1500);
        }
      }, delay);
      automaticRestoreTimers.current.set(color, restoreTimers[color]);
    };
    const schedule = (color: number, delay = 12000 + Math.random() * 6000) => {
      timers[color] = setTimeout(() => {
        if (interaction.current.dialogOpen || interaction.current.protectedColors.has(color)) {
          schedule(color, 1500);
          return;
        }
        if (!document.hidden) {
          firstAppearance.current = false;
          visibleColors.current.add(color);
          autoStartedAt.current.set(color, currentTime());
          const quality = Math.floor(Math.random() * qualities.length);
          setAssignments((current) => current.map((value, index) => index === color ? quality : value));
          clearTimeout(revealTimers.current.get(color));
          setRevealedColors((current) => current.filter((item) => item !== color));
          setTiles((current) => [...current.filter((tile) => tile.color !== color), { ...available[color], quality, color }]);
          revealTimers.current.set(color, setTimeout(() => {
            setRevealedColors((current) => [...current.filter((item) => item !== color), color]);
            revealTimers.current.delete(color);
          }, revealDuration));
          restore(color, 7000);
        }
        schedule(color);
      }, delay);
    };
    const onVisibility = () => {
      clearTimers();
      setTiles([]);
      setRevealedColors([]);
      visibleColors.current.clear();
      autoStartedAt.current.clear();
      if (!document.hidden) available.forEach((_, color) => schedule(color, 800 + color * 1200));
    };
    autoTiles.current.forEach((tile) => {
      visibleColors.current.add(tile.color);
      restore(tile.color, Math.max(0, 7000 - (currentTime() - (autoStartedAt.current.get(tile.color) ?? currentTime()))));
    });
    available.forEach((_, color) => schedule(color,
      resuming || interaction.current.protectedColors.has(color) ? 12000 + Math.random() * 6000
        : (firstAppearance.current ? 800 : 1200) + color * (1000 + Math.random() * 300),
    ));
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimers();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [geometry, available, reducedMotion, selected]);

  // Cut the photo out beneath the expanded panel as well, including its rounded
  // corners. Keep the holes disjoint: overlapping evenodd paths would refill it.
  useLayoutEffect(() => {
    if (!geometry || (!activeTiles.length && !selected)) return;
    const { width, height } = geometry;
    const expanded = selected ? getExpandedTileBounds(geometry) : null;
    const rects = expanded ? [expanded] : [];
    activeTiles.forEach(({ x, y }) => {
      const tile = { left: x, top: y, width: tileWidth, height: tileHeight };
      if (!expanded) { rects.push(tile); return; }
      const right = x + tileWidth;
      const bottom = y + tileHeight;
      const cutLeft = Math.max(x, expanded.left);
      const cutTop = Math.max(y, expanded.top);
      const cutRight = Math.min(right, expanded.left + expanded.width);
      const cutBottom = Math.min(bottom, expanded.top + expanded.height);
      if (cutLeft >= cutRight || cutTop >= cutBottom) { rects.push(tile); return; }
      if (cutTop > y) rects.push({ left: x, top: y, width: tileWidth, height: cutTop - y });
      if (cutBottom < bottom) rects.push({ left: x, top: cutBottom, width: tileWidth, height: bottom - cutBottom });
      if (cutLeft > x) rects.push({ left: x, top: cutTop, width: cutLeft - x, height: cutBottom - cutTop });
      if (cutRight < right) rects.push({ left: cutRight, top: cutTop, width: right - cutRight, height: cutBottom - cutTop });
    });
    const holes = rects.map(({ left, top, width: rectWidth, height: rectHeight }) =>
      `M${left} ${top}h${rectWidth}v${rectHeight}h-${rectWidth}Z`,
    ).join(" ");
    onClipPathChange(`path(evenodd, "M0 0H${width}V${height}H0Z ${holes}")`);
    return () => onClipPathChange("");
  }, [onClipPathChange, geometry, activeTiles, selected]);

  if (!geometry) return null;
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute overflow-hidden" style={{ left: geometry.left, top: geometry.top, width: geometry.width, height: geometry.height }}>
          <AnimatePresence>
            {expandedBounds && (
              <motion.div key="fading-photo-tiles" data-auth-photo-fade className="pointer-events-none absolute" style={{ left: expandedBounds.left, top: expandedBounds.top }}
                initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 1 }}
                transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}>
                {[0, 1].flatMap((row) => [0, 1].map((column) => {
                  const x = expandedBounds.left + column * (tileWidth + 10);
                  const y = expandedBounds.top + row * (tileHeight + 10);
                  const width = Math.min(tileWidth, expandedBounds.left + expandedBounds.width - x);
                  const height = Math.min(tileHeight, expandedBounds.top + expandedBounds.height - y);
                  return width > 0 && height > 0 ? (
                    <div key={`${row}-${column}`} className="absolute overflow-hidden rounded-[15px]"
                      style={{ left: x - expandedBounds.left, top: y - expandedBounds.top, width, height }}>
                      <img src={imageSrc || image.currentSrc || image.src} alt="" draggable={false} className="absolute max-w-none object-cover"
                        style={{ width: geometry.width, height: geometry.height, left: -x, top: -y }} />
                    </div>
                  ) : null;
                }))}
              </motion.div>
            )}
          </AnimatePresence>
          {available.map(({ x, y }, color) => {
            const quality = assignments[color];
            const { icon: Icon, label } = qualities[quality];
            const hiddenSource = selected?.color === color;
            const active = hiddenSource || activeTiles.some((tile) => tile.color === color);
            return (
              <button key={`${x}-${y}`} type="button"
                className={`auth-tile-button pointer-events-auto absolute cursor-pointer disabled:pointer-events-none disabled:cursor-default rounded-[15px] border-0 bg-transparent p-0 text-left [perspective:1200px] focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-primary ${hiddenSource ? "pointer-events-none opacity-0" : ""}`}
                style={{ left: x, top: y, width: tileWidth, height: tileHeight }}
                disabled={!active} tabIndex={active && !hiddenSource ? 0 : -1} aria-hidden={!active || hiddenSource}
                aria-label={`${label} : découvrir les fonctionnalités`} aria-haspopup="dialog"
                onMouseEnter={() => { if (active) { takeControlOfTile({ x, y, color, quality }); setHovered(color); } }}
                onMouseLeave={() => {
                  setHovered(null);
                }}
                onFocus={() => { if (active) { takeControlOfTile({ x, y, color, quality }); setFocused(color); } }}
                onBlur={() => {
                  setFocused(null);
                }}
                onClick={() => { takeControlOfTile({ x, y, color, quality }); setSelected({ x, y, quality, color }); }}>
                {active && !hiddenSource && <div className={`auth-flip-tile relative size-full ${selected ? "[animation-play-state:paused]" : ""} ${reducedMotion || (revealedColors.includes(color) && (color === hovered || color === focused)) ? "auth-tile-revealed" : revealedColors.includes(color) && heldTiles.some((tile) => tile.color === color) ? "auth-tile-returning" : ""}`} aria-hidden="true">
                  <div className="auth-flip-face absolute inset-0 overflow-hidden rounded-[15px]">
                    <img src={imageSrc || image.currentSrc || image.src} alt="" draggable={false} className="absolute max-w-none object-cover"
                      style={{ width: geometry.width, height: geometry.height, left: -x, top: -y }} />
                  </div>
                  <div className={`auth-flip-face auth-flip-icon-face absolute inset-0 flex items-end justify-end gap-3 rounded-[15px] p-6 ${colors[color]}`}>
                    <span className="absolute left-6 top-6 flex items-center gap-2 text-xs font-medium opacity-80">Découvrir <ArrowUpRight className="size-4" /></span>
                    <Icon className="size-9 shrink-0" strokeWidth={2} />
                    <span className="pb-1 text-xl font-semibold">{label}</span>
                  </div>
                </div>}
              </button>
            );
          })}
          <AnimatePresence>
            {selected && (
              <AuthQualityPanel
                key={`${selected.color}-${selected.quality}`}
                quality={selected.quality}
                color={colors[selected.color]}
                x={selected.x}
                y={selected.y}
                geometry={geometry}
                reducedMotion={Boolean(reducedMotion)}
                onClose={() => {
                  setRevealedColors((current) => current.includes(selected.color) ? current : [...current, selected.color]);
                  holdTile(selected);
                  setSelected(null);
                  setHovered(null);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
