import type { EditorObject } from "./objects/types";

export type ToolType = "select" | "text" | "image";

export interface EditorState {
  objects: EditorObject[];
  selectedId: string | null;
  activeTool: ToolType;
  fileName: string;
}

export function createInitialState(): EditorState {
  return {
    objects: [],
    selectedId: null,
    activeTool: "select",
    fileName: "untitled-project",
  };
}
