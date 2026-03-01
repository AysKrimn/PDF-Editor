import type { Command } from './types';
import type { EditorObject } from '../objects/types';
import type { EditorState } from '../EditorState';

export class AddObjectCommand implements Command {
  constructor(
    private state: EditorState,
    private object: EditorObject,
    private onApply: () => void,
  ) {}

  execute(): void {
    this.state.objects.push(this.object);
    this.onApply();
  }

  undo(): void {
    const idx = this.state.objects.findIndex((o) => o.id === this.object.id);
    if (idx !== -1) {
      this.state.objects.splice(idx, 1);
    }
    if (this.state.selectedId === this.object.id) {
      this.state.selectedId = null;
    }
    this.onApply();
  }
}
