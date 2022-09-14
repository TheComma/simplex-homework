import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CACHE_MAX_SIZE = +process.env.CACHE_MAX_SIZE;
export const TTL_FOR_CACHE_RECORD = +process.env.TTL_FOR_CACHE_RECORD;

export const { NODE_ENV, PORT, LOG_FORMAT, LOG_DIR, EXCHANGE_RATE_API_URL } = process.env;
