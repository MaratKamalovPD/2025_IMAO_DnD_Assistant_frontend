import type { MapData, Rotation } from 'entities/maps';
import type { MapTile } from 'entities/mapTiles';

/** 1 macro cell = 8 microcells (same as MapEditor) */
const MACRO_CELL_UNITS = 8;

export type TilesById = Record<string, MapTile>;

export type MosaicRenderResult = {
  dataUrl: string;
  width: number;
  height: number;
};

/** Shared cache for loaded images */
const imageCache = new Map<string, HTMLImageElement>();

/** Load an image with caching */
const loadImage = (url: string): Promise<HTMLImageElement> => {
  const cached = imageCache.get(url);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(url, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
};

/** Draw a tile with rotation on canvas context */
const drawRotatedTile = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  size: number,
  rot: Rotation,
) => {
  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  ctx.rotate((rot * Math.PI) / 2);
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
};

export type ValidateMosaicResult = { valid: true } | { valid: false; error: string };

/**
 * Validates that map data is compatible with mosaic rendering.
 * Checks for proper MACRO_CELL_UNITS alignment.
 */
export const validateMapForMosaic = (mapData: MapData): ValidateMosaicResult => {
  // Check dimensions are aligned to macro cells
  if (mapData.widthUnits % MACRO_CELL_UNITS !== 0) {
    return {
      valid: false,
      error: `Ширина карты (${mapData.widthUnits}) не кратна ${MACRO_CELL_UNITS}`,
    };
  }

  if (mapData.heightUnits % MACRO_CELL_UNITS !== 0) {
    return {
      valid: false,
      error: `Высота карты (${mapData.heightUnits}) не кратна ${MACRO_CELL_UNITS}`,
    };
  }

  // Check that all placements are aligned
  for (const placement of mapData.placements) {
    if (placement.x % MACRO_CELL_UNITS !== 0) {
      return {
        valid: false,
        error: `Тайл с id=${placement.tileId} имеет неверную позицию X (${placement.x})`,
      };
    }
    if (placement.y % MACRO_CELL_UNITS !== 0) {
      return {
        valid: false,
        error: `Тайл с id=${placement.tileId} имеет неверную позицию Y (${placement.y})`,
      };
    }
  }

  return { valid: true };
};

/**
 * Renders a map's tiles to a data URL that can be used as a background image.
 * @param mapData The map data containing placements
 * @param tilesById A lookup object from tile ID to tile info (with imageUrl)
 * @param cellSizePx The size of each macro cell in pixels (default: 50 to match BattleMap)
 * @returns Promise resolving to a data URL of the rendered mosaic
 */
export const renderMapMosaic = async (
  mapData: MapData,
  tilesById: TilesById,
  cellSizePx = 50,
): Promise<MosaicRenderResult> => {
  const cols = mapData.widthUnits / MACRO_CELL_UNITS;
  const rows = mapData.heightUnits / MACRO_CELL_UNITS;

  if (cols <= 0 || rows <= 0) {
    throw new Error('Некорректные размеры карты');
  }

  const width = cols * cellSizePx;
  const height = rows * cellSizePx;

  // Create offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Не удалось создать canvas context');
  }

  // Fill with dark background
  ctx.fillStyle = '#212529';
  ctx.fillRect(0, 0, width, height);

  // Collect unique tile URLs to load
  const urlsToLoad = new Set<string>();
  for (const placement of mapData.placements) {
    const tile = tilesById[placement.tileId];
    if (tile?.imageUrl) {
      urlsToLoad.add(tile.imageUrl);
    }
  }

  // Load all images in parallel
  await Promise.all([...urlsToLoad].map(loadImage));

  // Sort placements by layer (lower layers first)
  const sortedPlacements = [...mapData.placements].sort((a, b) => (a.layer ?? 0) - (b.layer ?? 0));

  // Render placements
  for (const placement of sortedPlacements) {
    const tile = tilesById[placement.tileId];
    if (!tile?.imageUrl) continue;

    const img = imageCache.get(tile.imageUrl);
    if (!img) continue;

    const col = placement.x / MACRO_CELL_UNITS;
    const row = placement.y / MACRO_CELL_UNITS;
    const x = col * cellSizePx;
    const y = row * cellSizePx;

    drawRotatedTile(ctx, img, x, y, cellSizePx, placement.rot);
  }

  return {
    dataUrl: canvas.toDataURL('image/png'),
    width,
    height,
  };
};

/** Cache for rendered mosaics by map ID */
const mosaicCache = new Map<string, MosaicRenderResult>();

/**
 * Gets a cached mosaic or renders a new one.
 * @param mapId The map ID for caching
 * @param mapData The map data
 * @param tilesById Tiles lookup
 * @param cellSizePx Cell size in pixels
 */
export const getOrRenderMosaic = async (
  mapId: string,
  mapData: MapData,
  tilesById: TilesById,
  cellSizePx = 50,
): Promise<MosaicRenderResult> => {
  const cached = mosaicCache.get(mapId);
  if (cached) return cached;

  const result = await renderMapMosaic(mapData, tilesById, cellSizePx);
  mosaicCache.set(mapId, result);
  return result;
};

/** Clear a specific mosaic from cache */
export const clearMosaicCache = (mapId?: string) => {
  if (mapId) {
    mosaicCache.delete(mapId);
  } else {
    mosaicCache.clear();
  }
};
