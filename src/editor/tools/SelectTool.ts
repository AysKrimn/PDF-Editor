import type { Tool } from "./types";

export class SelectTool implements Tool {
  readonly type = "select" as const;

  activate(): void {}

  deactivate(): void {}
}
