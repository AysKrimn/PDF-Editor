import type { EditorState } from "../EditorState";
import type { EditorObject } from "../objects/types";

export interface SerializedDocument {
  version: number;
  fileName: string;
  objects: EditorObject[];
}

export function serialize(state: EditorState): string {
  const doc: SerializedDocument = {
    version: 1,
    fileName: state.fileName,
    objects: state.objects.map((o) => ({ ...o }) as EditorObject),
  };
  return JSON.stringify(doc);
}
