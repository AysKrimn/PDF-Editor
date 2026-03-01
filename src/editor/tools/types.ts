export type ToolType = 'select' | 'text' | 'image';

export interface Tool {
  readonly type: ToolType;
  activate(): void;
  deactivate(): void;
}
