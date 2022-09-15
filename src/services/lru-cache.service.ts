import { CACHE_MAX_SIZE, TTL_FOR_CACHE_RECORD } from '@/config';
import { logger } from '@/utils/logger';
import { Service } from 'typedi';

@Service()
export class LruCache<K, V> {
  constructor() {
    this.size = CACHE_MAX_SIZE;
    this.values = new Map<K, [V, number]>();
    this.ttl = TTL_FOR_CACHE_RECORD;
  }
  private values: Map<K, [V, number]>;
  private size;
  private ttl;

  public get(key: K): V | undefined {
    const entry = this.values.get(key);
    if (!entry) {
      return undefined;
    } else if (Date.now() > entry[1]) {
      logger.debug(`${key} is outdated. Deleting.`);
      this.values.delete(key);
      return undefined;
    } else {
      this.values.delete(key);
      this.values.set(key, entry);
      return entry[0];
    }
  }

  public put(key: K, value: V) {
    if (this.values.size === this.size) {
      // least-recently used cache eviction strategy
      const keyToDelete = this.values.keys().next().value;
      logger.debug(`Cache size: ${this.values.size}. Deleting key: ${keyToDelete}`);

      this.values.delete(keyToDelete);
    }
    this.values.set(key, [value, Date.now() + this.ttl]);
  }

  //For testing purposes
  public clean() {
    this.values.clear();
  }
}
