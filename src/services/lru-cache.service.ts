class LruCache<K, V> {
  constructor(size: number, ttl: number) {
    this.size = size;
    this.values = new Map<K, [V, number]>();
    this.ttl = ttl;
  }
  private values: Map<K, [V, number]>;
  private size;
  private ttl;

  public get(key: K): V | undefined {
    const entry = this.values.get(key);
    if (!entry || Date.now() > entry[1]) {
      return undefined;
    } else {
      this.values.delete(key);
      this.values.set(key, entry);
      return entry[0];
    }
  }

  public put(key: K, value: V) {
    if (this.values.size === this.size) {
      console.info(`Cache size: ${this.values.size}. Need to evict.`);
      // least-recently used cache eviction strategy
      const keyToDelete = this.values.keys().next().value;
      console.info(`Deleting key: ${keyToDelete}`);

      this.values.delete(keyToDelete);
    }
    this.values.set(key, [value, Date.now() + this.ttl]);
  }
}
const lruCache = new LruCache<[string, string], number>(5, 1000);

export default lruCache;
