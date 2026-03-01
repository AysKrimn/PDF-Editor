import type { EditorObject } from "./objects/types";
import type { ToolType } from "./EditorState";
import type { EditorState } from "./EditorState";

import { createInitialState } from "./EditorState";
import { EditorEvents } from "./EditorEvents";
import { EditorCanvas } from "./canvas/EditorCanvas";
import { CanvasManager } from "./canvas/CanvasManager";
import { CommandManager } from "./commands/CommandManager";
import { AddObjectCommand } from "./commands/AddObject";
import { RemoveObjectCommand } from "./commands/RemoveObject";
import { UpdateObjectCommand } from "./commands/UpdateObject";
import { createTextObject } from "./objects/TextObject";
import { createImageObject } from "./objects/ImageObject";

export class Editor {
  readonly events = new EditorEvents();
  readonly canvas = new EditorCanvas();

  private _state: EditorState;
  private canvasManager = new CanvasManager();
  private commandManager = new CommandManager();

  constructor() {
    this._state = createInitialState();
  }

  get state(): Readonly<EditorState> {
    return this._state;
  }

  // those methods used by ui components
  // they handle operations on the editor such as adding objects, removing objects, updating objects, etc.
  addObject(obj: EditorObject): void {
    const cmd = new AddObjectCommand(this._state, obj, () => this.notify());
    this.commandManager.execute(cmd);
    this._state.selectedId = obj.id;
    this.notify();
  }

  addTextObject(viewportCenterX: number, viewportCenterY: number): void {
    const zIndex = this.canvasManager.getNextZIndex(this._state.objects);
    const obj = createTextObject(
      viewportCenterX - 75,
      viewportCenterY - 20,
      zIndex,
    );
    this.addObject(obj);
  }

  addImageObject(
    src: string,
    naturalWidth: number,
    naturalHeight: number,
    viewportCenterX: number,
    viewportCenterY: number,
  ): void {
    const maxW = 300;
    const scale = naturalWidth > maxW ? maxW / naturalWidth : 1;
    const w = naturalWidth * scale;
    const h = naturalHeight * scale;
    const zIndex = this.canvasManager.getNextZIndex(this._state.objects);
    const obj = createImageObject(
      viewportCenterX - w / 2,
      viewportCenterY - h / 2,
      zIndex,
      src,
      w,
      h,
    );
    this.addObject(obj);
  }

  removeObject(id: string): void {
    const cmd = new RemoveObjectCommand(this._state, id, () => this.notify());
    this.commandManager.execute(cmd);
    this.notifyHistory();
  }

  updateObject(id: string, updates: Partial<EditorObject>): void {
    const cmd = new UpdateObjectCommand(this._state, id, updates, () =>
      this.notify(),
    );
    this.commandManager.execute(cmd);
    this.notifyHistory();
  }

  // ── Selection ────────────────────────────────────

  select(id: string | null): void {
    if (this._state.selectedId === id) return;
    this._state.selectedId = id;
    this.events.emit("selection:changed", id);
    this.notify();
  }

  // ── Ordering ─────────────────────────────────────

  bringToFront(id: string): void {
    this._state.objects = this.canvasManager.reorder(
      this._state.objects,
      id,
      "front",
    );
    this.notify();
  }

  sendToBack(id: string): void {
    this._state.objects = this.canvasManager.reorder(
      this._state.objects,
      id,
      "back",
    );
    this.notify();
  }

  // they handle operations on the editor such as setting the tool, setting the file name, etc.
  setTool(tool: ToolType): void {
    this._state.activeTool = tool;
    this.notify();
  }

  setFileName(name: string): void {
    this._state.fileName = name;
    this.notify();
  }

  undo(): void {
    this.commandManager.undo();
    this.notifyHistory();
  }

  redo(): void {
    this.commandManager.redo();
    this.notifyHistory();
  }

  get canUndo(): boolean {
    return this.commandManager.canUndo;
  }

  get canRedo(): boolean {
    return this.commandManager.canRedo;
  }

  reset(): void {
    this._state = createInitialState();
    this.commandManager.clear();
    this.notify();
    this.notifyHistory();
  }

  get isDirty(): boolean {
    return this._state.objects.length > 0;
  }

  private notify(): void {
    this.events.emit("state:changed", this._state);
  }

  private notifyHistory(): void {
    this.events.emit("history:changed", {
      canUndo: this.commandManager.canUndo,
      canRedo: this.commandManager.canRedo,
    });
  }
}
