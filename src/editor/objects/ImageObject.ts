import type { ImageObjectData, EditorObject } from "./types";
import { generateId } from "./BaseObject";

export function createImageObject(
  x: number,
  y: number,
  zIndex: number,
  src: string,
  width: number,
  height: number,
  overrides?: Partial<ImageObjectData>,
): ImageObjectData {
  return {
    id: generateId("image"),
    type: "image",
    x,
    y,
    width,
    height,
    zIndex,
    src,
    opacity: 1,
    objectFit: "contain",
    ...overrides,
  };
}

export function isImageObject(obj: EditorObject): obj is ImageObjectData {
  return obj.type === "image";
}
