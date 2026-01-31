import Redis from 'ioredis';
import dotenv from 'dotenv';
import { OSClient } from '../src/core/os-client';

dotenv.config();

const redis = new Redis({
    host: process.env.VPS_IP || '127.0.0.1',
    port: 6379,
});

async function runTest() {
    console.log("Setting mock Redis values...");
    await redis.set('aegis:heartbeat', Date.now().toString());
    await redis.set('last_trade_decision', 'BUY NIFTY @ 24500');
    await redis.set('last_rejection_reason', 'NONE');
    await redis.set('aegis:system_state', 'LIVE');
    await redis.set('confidence_score', '0.85');
    await redis.set('risk_used', '1250');

    console.log("Waiting for OSClient to poll (approx 2s)...");
    const client = OSClient.getInstance();

    setTimeout(() => {
        const transparency = client.getTransparency();
        console.log("OSClient Transparency Data:", JSON.stringify(transparency, null, 2));

        if (transparency.coreStatus === 'LIVE' && transparency.confidenceScore === 0.85) {
            console.log("✅ Verification Successful!");
        } else {
            console.log("❌ Verification Failed!");
        }
        process.exit();
    }, 3000);
}

runTest();
