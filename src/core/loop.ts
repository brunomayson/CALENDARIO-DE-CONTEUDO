import { Clock } from './time';

export type UpdateFn = (dt: number) => void;
export type RenderFn = () => void;

export interface LoopOptions {
  update: UpdateFn;
  render: RenderFn;
  fps?: number;
}

export class GameLoop {
  private readonly update: UpdateFn;

  private readonly render: RenderFn;

  private readonly clock: Clock;

  private running = false;

  constructor(options: LoopOptions) {
    this.update = options.update;
    this.render = options.render;
    this.clock = new Clock({ fps: options.fps ?? 60 });
  }

  public start(): void {
    this.running = true;
    requestAnimationFrame(this.tick);
  }

  public stop(): void {
    this.running = false;
    this.clock.reset();
  }

  private tick = (timestamp: number): void => {
    if (!this.running) {
      return;
    }

    this.clock.accumulate(timestamp / 1000);

    while (this.clock.shouldUpdate()) {
      const dt = this.clock.consume();
      this.update(dt);
    }

    this.render();
    requestAnimationFrame(this.tick);
  };
}
