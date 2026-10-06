export type ChatbotRect = { left: number; top: number; width: number; height: number };
export type ChatbotPoint = { left: number; top: number };

/** Choose a viewport location with clearance from visible controls and headings. */
export function chooseChatbotPlacement(
  viewport: { width: number; height: number },
  size: { width: number; height: number },
  obstacles: ChatbotRect[],
  random: number,
  area: ChatbotRect = { left: 0, top: 0, ...viewport },
  preferred?: ChatbotPoint,
  previous?: ChatbotPoint | null,
): ChatbotPoint | null {
  const margin = 20;
  const clearance = 16;
  const horizontalSpace = area.width - size.width - margin * 2;
  const verticalSpace = area.height - size.height - margin * 2;
  if (horizontalSpace < 0 || verticalSpace < 0) return null;
  const candidates: ChatbotPoint[] = [];
  const left = area.left + (area.width - size.width) / 2;
  const anchors = [0, 0.25, 0.5, 0.75, 1].map(y => ({ left, top: area.top + margin + y * verticalSpace }));
  if (preferred) anchors.push({ left, top: preferred.top });
  for (const point of anchors) {
      if (point.top < area.top || point.top + size.height > area.top + area.height) continue;
      const overlaps = obstacles.some(rect =>
        point.left < rect.left + rect.width + clearance &&
        point.left + size.width + clearance > rect.left &&
        point.top < rect.top + rect.height + clearance &&
        point.top + size.height + clearance > rect.top,
      );
      if (!overlaps) candidates.push(point);
  }
  const different = previous ? candidates.filter(point => Math.hypot(point.left - previous.left, point.top - previous.top) > 24) : candidates;
  const available = different.length ? different : candidates;
  return available[Math.min(available.length - 1, Math.floor(random * available.length))] ?? null;
}
