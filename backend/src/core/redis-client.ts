import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

/**
 * STRICT: Read-Only Redis Connection
 * This client is used ONLY for observability.
 * It connects to the Core VPS Redis instance.
 */

const CORE_REDIS_URL = process.env.CORE_REDIS_URL;
const REDIS_HOST = CORE_REDIS_URL ? new URL(CORE_REDIS_URL).hostname : (process.env.REDIS_HOST || process.env.VPS_IP || '127.0.0.1');
const REDIS_PORT = CORE_REDIS_URL ? parseInt(new URL(CORE_REDIS_URL).port || '6379') : parseInt(process.env.REDIS_PORT || '6379');

class RedisReadOnlyClient {
    private static instance: RedisReadOnlyClient;
    private redis: Redis;

    private constructor() {
        console.log(`[Redis] Connecting to ${REDIS_HOST}:${REDIS_PORT} (READ-ONLY MODE)...`);

        this.redis = new Redis({
            host: REDIS_HOST,
            port: REDIS_PORT,
            // Safety: No password in mock/dev but recommended for Prod
            password: process.env.REDIS_PASSWORD,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 1,
            enableOfflineQueue: false // Don't queue commands if offline
        });

        this.redis.on('error', (err) => {
            console.error('[Redis] Connection Error:', err.message);
        });

        this.redis.on('connect', () => {
            console.log('[Redis] Connected successfully.');
        });
    }

    public static getInstance(): RedisReadOnlyClient {
        if (!RedisReadOnlyClient.instance) {
            RedisReadOnlyClient.instance = new RedisReadOnlyClient();
        }
        return RedisReadOnlyClient.instance;
    }

    /**
     * READ-ONLY GET
     */
    public async get(key: string): Promise<string | null> {
        try {
            return await this.redis.get(key);
        } catch (e) {
            return null;
        }
    }

    /**
     * MGET for efficiency
     */
    public async mget(keys: string[]): Promise<(string | null)[]> {
        try {
            return await this.redis.mget(...keys);
        } catch (e) {
            return keys.map(() => null);
        }
    }

    /**
     * Get JSON parsed value
     */
    public async getJSON<T>(key: string): Promise<T | null> {
        const val = await this.get(key);
        if (!val) return null;
        try {
            return JSON.parse(val) as T;
        } catch (e) {
            return null;
        }
    }
}

export const redis = RedisReadOnlyClient.getInstance();
