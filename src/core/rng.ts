/**
 * RNG linear congruente com seed configurável para reprodutibilidade.
 */
export class SeededRng {
  private state: number;

  constructor(seed: string) {
    this.state = this.hash(seed);
  }

  /**
   * Gera número pseudo-aleatório em [0, 1).
   */
  public next(): number {
    // Parâmetros do gerador LCG (Numerical Recipes)
    this.state = (1664525 * this.state + 1013904223) % 0xffffffff;
    return this.state / 0xffffffff;
  }

  /**
   * Devolve inteiro no intervalo [min, max].
   */
  public nextInt(min: number, max: number): number {
    const range = max - min + 1;
    return min + Math.floor(this.next() * range);
  }

  private hash(seed: string): number {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i += 1) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
}
