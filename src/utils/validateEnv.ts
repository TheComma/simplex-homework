import { cleanEnv, port, str, num, url } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    CACHE_MAX_SIZE: num(),
    EXCHANGE_RATE_API_URL: url(),
    TTL_FOR_CACHE_RECORD: num(),
  });
};

export default validateEnv;
