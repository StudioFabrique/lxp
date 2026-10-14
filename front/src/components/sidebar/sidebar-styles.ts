import { cn } from "../../utils/cn";

// Courbe d'accélération douce (ease-out marqué) : démarrage rapide, arrivée sans à-coup.
// Les classes Tailwind complètes restent dans le code pour être détectées à la compilation.
export const sidebarTransitionClassName =
  "duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

// One compact geometry for navigation, profile and utility controls.
// L'icône garde la même position (px-2) en barre compacte et étendue : seule la largeur
// du contrôle change, et le libellé est rogné puis révélé par le redimensionnement de la barre.
export const sidebarControlClassName =
  "flex min-h-8 w-full shrink-0 cursor-pointer items-center justify-start gap-2 rounded-lg px-2 py-1 text-sm transition-colors hover:bg-[var(--sidebar-hover)]";

export const sidebarLabelClassName = cn(
  "min-w-0 overflow-hidden whitespace-nowrap opacity-0 2xl:opacity-100 group-data-[variant=drawer]/sidebar:opacity-100",
  "group-data-[animated=true]/sidebar:transition-opacity",
  sidebarTransitionClassName,
);

export const sidebarListClassName =
  "flex flex-col items-stretch gap-1 select-none";
