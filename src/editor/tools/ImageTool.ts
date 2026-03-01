import type { Tool } from './types';

export class ImageTool implements Tool {
  readonly type = 'image' as const;

  activate(): void {
    // image placement mode
  }

  deactivate(): void {
    // reset
  }
}
