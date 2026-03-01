import type { SerializedDocument } from './serialize';
import type { EditorObject } from '../objects/types';

export function deserialize(json: string): { fileName: string; objects: EditorObject[] } {
  const doc: SerializedDocument = JSON.parse(json);
  return {
    fileName: doc.fileName,
    objects: doc.objects,
  };
}
