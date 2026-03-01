import type { Command } from './types';
import type { EditorObject } from '../objects/types';
import type { EditorState } from '../EditorState';

export class RemoveObjectCommand implements Command {
  private removedObject: EditorObject | null = null;
  private removedIndex = -1;

  constructor(
    private state: EditorState,
    private objectId: string,
    private onApply: () => void,
  ) {}

  execute(): void {
    const idx = this.state.objects.findIndex((o) => o.id === this.objectId);
    if (idx === -1) return;
    this.removedIndex = idx;
    this.removedObject = { ...this.state.objects[idx] } as EditorObject;
    this.state.objects.splice(idx, 1);
    if (this.state.selectedId === this.objectId) {
      this.state.selectedId = null;
    }
    this.onApply();
  }

  undo(): void {
    if (!this.removedObject) return;
    this.state.objects.splice(this.removedIndex, 0, this.removedObject);
    this.onApply();
  }
}
