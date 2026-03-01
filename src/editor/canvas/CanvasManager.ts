import type { EditorObject } from '../objects/types';

export class CanvasManager {
  getNextZIndex(objects: EditorObject[]): number {
    if (objects.length === 0) return 1;
    return Math.max(...objects.map((o) => o.zIndex)) + 1;
  }

  reorder(
    objects: EditorObject[],
    targetId: string,
    position: 'front' | 'back',
  ): EditorObject[] {
    const sorted = [...objects].sort((a, b) => a.zIndex - b.zIndex);
    const targetIndex = sorted.findIndex((el) => el.id === targetId);
    if (targetIndex === -1) return objects;

    if (position === 'front' && targetIndex === sorted.length - 1) return objects;
    if (position === 'back' && targetIndex === 0) return objects;

    const [target] = sorted.splice(targetIndex, 1);
    if (position === 'front') {
      sorted.push(target);
    } else {
      sorted.unshift(target);
    }

    const zMap = new Map<string, number>();
    sorted.forEach((el, i) => zMap.set(el.id, i + 1));

    return objects.map(
      (el) => Object.assign({}, el, { zIndex: zMap.get(el.id)! }) as EditorObject,
    );
  }
}
