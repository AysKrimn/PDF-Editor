import type { TextObjectData, EditorObject } from "./types";
import { generateId } from "./BaseObject";
import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  DEFAULT_TEXT_COLOR,
} from "../../shared/constants";

export function createTextObject(
  x: number,
  y: number,
  zIndex: number,
  overrides?: Partial<TextObjectData>,
): TextObjectData {
  return {
    id: generateId("text"),
    type: "text",
    x,
    y,
    width: 150,
    height: 40,
    zIndex,
    text: "Yeni metin",
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: DEFAULT_FONT_SIZE,
    fontWeight: "normal",
    fontStyle: "normal",
    textAlign: "left",
    color: DEFAULT_TEXT_COLOR,
    ...overrides,
  };
}

export function createListObject(
  x: number,
  y: number,
  zIndex: number,
): TextObjectData {
  // super createtext object
  const textObject = createTextObject(x, y, zIndex);
  textObject.text = `1. Item\n2. Item\n3. Item`.split("\n").join("\n");

  return textObject;
}

export function isTextObject(obj: EditorObject): obj is TextObjectData {
  return obj.type === "text";
}
