import type { Tool } from "./types";

export class TextTool implements Tool {
  readonly type = "text" as const;

  activate(): void {}

  deactivate(): void {}
}
