import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import Calendar from "../calendar";
import type { CalendarEvent } from "../calendar-configuration";

const roots: Root[] = [];

const mockViewport = (isMobile: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: isMobile && query.includes("max-width"),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
};

// Semaine du lundi 12 au dimanche 18 octobre 2026.
const currentDate = new Date(2026, 9, 15);
const events: CalendarEvent[] = [
  { id: "b", title: "Algorithmique", subtitle: "Salle 2", start: "14:00", end: "16:00", date: new Date(2026, 9, 14), type: "primary" },
  { id: "a", title: "Accueil", start: "09:00", end: "10:30", date: new Date(2026, 9, 14), type: "info" },
  { id: "c", title: "Devoir", start: "00:00", end: "00:00", category: "assignment", deadlineTime: "23:59", date: new Date(2026, 9, 16), type: "warning" },
];

const render = (view: "week" | "day" = "week") => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  const onClickEventDetails = vi.fn();
  act(() =>
    root.render(
      <Calendar events={events} view={view} currentDate={currentDate} onClickEventDetails={onClickEventDetails} />,
    ),
  );
  return { container, onClickEventDetails };
};

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.innerHTML = "";
});

describe("calendrier sur mobile", () => {
  it("affiche la semaine en liste par jour, au lieu des sept colonnes horaires", () => {
    mockViewport(true);
    const { container } = render();

    expect(container.querySelector('[aria-label="Cours de la semaine"]')).not.toBeNull();
    expect(container.querySelectorAll("section")).toHaveLength(7);
    expect(container.querySelector("[data-calendar-scroll-content]")).toBeNull();
  });

  it("trie les cours d'un jour par heure et signale les jours sans cours", () => {
    mockViewport(true);
    const { container } = render();

    const wednesday = container.querySelector('section[aria-label*="mercredi"]')!;
    const titles = Array.from(wednesday.querySelectorAll("li")).map((item) => item.textContent);
    expect(titles[0]).toContain("Accueil");
    expect(titles[1]).toContain("Algorithmique");
    expect(container.querySelector('section[aria-label*="lundi"]')?.textContent).toContain("Aucun cours");
    expect(container.querySelector('section[aria-label*="vendredi"]')?.textContent).toContain("À rendre");
  });

  it("ouvre le détail d'un cours au clic", () => {
    mockViewport(true);
    const { container, onClickEventDetails } = render();

    act(() => container.querySelector<HTMLButtonElement>('[data-calendar-event="a"]')!.click());

    expect(onClickEventDetails).toHaveBeenCalledWith("a", expect.anything(), expect.anything());
  });

  it("garde la grille horaire hors mobile", () => {
    mockViewport(false);
    const { container } = render();

    expect(container.querySelector("[data-calendar-scroll-content]")).not.toBeNull();
    expect(container.querySelector('[aria-label="Cours de la semaine"] section')).toBeNull();
  });
});
