import type { ShapeObjectData, EditorObject } from './types';
import { generateId } from './BaseObject';

export function createShapeObject(
  x: number,
  y: number,
  zIndex: number,
  width = 100,
  height = 100,
): ShapeObjectData {
  return {
    id: generateId(),
    type: 'shape',
    x,
    y,
    width,
    height,
    zIndex,
  };
}

export function isShapeObject(obj: EditorObject): obj is ShapeObjectData {
  return obj.type === 'shape';
}
