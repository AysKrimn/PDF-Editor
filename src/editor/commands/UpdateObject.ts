import type { Command } from './types';
import type { EditorObject } from '../objects/types';
import type { EditorState } from '../EditorState';

export class UpdateObjectCommand implements Command {
  private previousData: Partial<EditorObject> = {};

  constructor(
    private state: EditorState,
    private objectId: string,
    private updates: Partial<EditorObject>,
    private onApply: () => void,
  ) {}

  execute(): void {
    const obj = this.state.objects.find((o) => o.id === this.objectId);
    if (!obj) return;

    this.previousData = {};
    for (const key of Object.keys(this.updates) as (keyof EditorObject)[]) {
      (this.previousData as Record<string, unknown>)[key] = (obj as Record<string, unknown>)[key];
    }

    const idx = this.state.objects.indexOf(obj);
    this.state.objects[idx] = Object.assign({}, obj, this.updates) as EditorObject;
    this.onApply();
  }

  undo(): void {
    const obj = this.state.objects.find((o) => o.id === this.objectId);
    if (!obj) return;

    const idx = this.state.objects.indexOf(obj);
    this.state.objects[idx] = Object.assign({}, obj, this.previousData) as EditorObject;
    this.onApply();
  }
}
