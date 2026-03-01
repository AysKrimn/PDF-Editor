import { A4_WIDTH, A4_HEIGHT } from '../../shared/constants';

export interface PageConfig {
  width: number;
  height: number;
}

export class EditorCanvas {
  private _page: PageConfig;

  constructor(page?: Partial<PageConfig>) {
    this._page = {
      width: page?.width ?? A4_WIDTH,
      height: page?.height ?? A4_HEIGHT,
    };
  }

  get page(): Readonly<PageConfig> {
    return this._page;
  }

  setPageSize(width: number, height: number): void {
    this._page = { width, height };
  }
}
