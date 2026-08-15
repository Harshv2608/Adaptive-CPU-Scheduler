// Linear Congruential Generator (LCG) for seeded randomness
export class RandomGenerator {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Returns a pseudo-random float between 0 (inclusive) and 1 (exclusive)
  public next(): number {
    // LCG parameters (glibc/ANSI C)
    const a = 1103515245;
    const c = 12345;
    const m = 2147483648; // 2^31
    
    this.seed = (a * this.seed + c) % m;
    return this.seed / m;
  }

  // Returns an integer between min and max (inclusive)
  public nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}
