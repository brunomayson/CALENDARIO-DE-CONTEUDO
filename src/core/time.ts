export interface LoopConfig {
  fps: number;
}

export class Clock {
  private readonly step: number;

  private accumulator = 0;

  private last = 0;

  private initialized = false;

  constructor(config: LoopConfig) {
    this.step = 1 / config.fps;
  }

  public start(timestamp: number): void {
    this.last = timestamp;
    this.initialized = true;
  }

  public accumulate(timestamp: number): number {
    if (!this.initialized) {
      this.start(timestamp);
      return 0;
    }
    const delta = timestamp - this.last;
    this.last = timestamp;
    this.accumulator += delta;
    return delta;
  }

  public shouldUpdate(): boolean {
    return this.accumulator >= this.step;
  }

  public consume(): number {
    this.accumulator -= this.step;
    return this.step;
  }

  public reset(): void {
    this.accumulator = 0;
    this.initialized = false;
    this.last = 0;
  }
}
