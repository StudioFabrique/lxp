/**
 * Géométrie de la pyramide qui se construit niveau par niveau : une couche par
 * niveau retenu, du plus grand (en bas) au plus petit, et sur la couche courante
 * les éléments du même niveau posés côte à côte. Unités de la scène 3D (700 x 500), avec les mêmes pas que la pyramide complète.
 */
export type StackBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
};

const LAYER_WIDTH = 700;
const LAYER_HEIGHT = 500;
const WIDTH_STEP = 80;
const HEIGHT_STEP = 62;
export const STACK_DEPTH = 60;
const ROW_GAP = 14;
const ROW_HEIGHT_SHARE = 0.62;

/** Couche du niveau `level` (1 pour la formation) : concentrique, plus petite à chaque niveau. */
export const layerBox = (level: number): StackBox => ({
  x: 0,
  y: 0,
  width: LAYER_WIDTH - (level - 1) * WIDTH_STEP,
  height: LAYER_HEIGHT - (level - 1) * HEIGHT_STEP,
  z: (level - 1) * STACK_DEPTH,
});

/** Carte `index` sur `count`, posée côte à côte sur la couche du niveau `level`. */
export const childBox = (level: number, index: number, count: number): StackBox => {
  const layer = layerBox(level);
  const width = (layer.width - (count + 1) * ROW_GAP) / count;
  return {
    x: -layer.width / 2 + ROW_GAP + width / 2 + index * (width + ROW_GAP),
    y: 0,
    width,
    height: layer.height * ROW_HEIGHT_SHARE,
    z: level * STACK_DEPTH,
  };
};

/** Propriétés CSS qui placent une plaque dans le repère centré de la pile. */
export const boxStyle = (box: StackBox) => ({
  width: box.width,
  height: box.height,
  left: box.x - box.width / 2,
  top: box.y - box.height / 2,
});
