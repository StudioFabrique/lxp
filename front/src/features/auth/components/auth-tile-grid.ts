export const tileWidth = 300;
export const tileHeight = 250;

export type Geometry = { width: number; height: number; left: number; top: number; visibleWidth: number };

// Third visible row, columns 2–4. Edge tiles are cropped with the photo.
export function getVisibleAuthTiles({ width, height, left, visibleWidth }: Geometry) {
  return [150, 460, 770]
    .map((x) => ({ x, y: 440 }))
    .filter(({ x, y }) =>
      y < height && x < width && left + x < visibleWidth && left + x + tileWidth > 0,
    );
}

export function getExpandedTileBounds(geometry: Geometry) {
  const visibleStart = Math.max(0, -geometry.left);
  const visibleEnd = Math.min(geometry.width, geometry.visibleWidth - geometry.left);
  const width = Math.min(tileWidth * 2 + 10, visibleEnd - visibleStart);
  const height = Math.min(tileHeight * 2 + 10, geometry.height);
  const centered = visibleStart + (visibleEnd - visibleStart - width) / 2;
  const alignedStarts = [-160, 150, 460, 770]
    .filter((x) => x >= visibleStart && x + width <= visibleEnd);
  return {
    left: alignedStarts.length
      ? alignedStarts.reduce((closest, x) => Math.abs(x - centered) < Math.abs(closest - centered) ? x : closest)
      : centered,
    top: Math.min(180, Math.max(0, geometry.height - height)),
    width,
    height,
  };
}
