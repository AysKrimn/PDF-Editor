import type { EditorState } from "./EditorState";

export interface EditorEventMap {
  "state:changed": EditorState;
  "object:added": string;
  "object:removed": string;
  "object:updated": string;
  "selection:changed": string | null;
  "history:changed": { canUndo: boolean; canRedo: boolean };
}

type Listener<T> = (payload: T) => void;

export class EditorEvents {
  private listeners = new Map<string, Set<Listener<unknown>>>();

  on<K extends keyof EditorEventMap>(
    event: K,
    listener: Listener<EditorEventMap[K]>,
  ): () => void {
    const key = event as string;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(listener as Listener<unknown>);

    return () => {
      this.listeners.get(key)?.delete(listener as Listener<unknown>);
    };
  }

  emit<K extends keyof EditorEventMap>(
    event: K,
    payload: EditorEventMap[K],
  ): void {
    const key = event as string;
    this.listeners.get(key)?.forEach((fn) => fn(payload));
  }

  clear(): void {
    this.listeners.clear();
  }
}
