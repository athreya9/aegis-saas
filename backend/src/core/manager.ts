import { Sandbox } from './sandbox';

class SandboxManager {
    private static instance: SandboxManager;
    private sandboxes: Map<string, Sandbox> = new Map();

    private constructor() { }

    public static getInstance(): SandboxManager {
        if (!SandboxManager.instance) {
            SandboxManager.instance = new SandboxManager();
        }
        return SandboxManager.instance;
    }

    public getSandbox(userId: string): Sandbox {
        if (!this.sandboxes.has(userId)) {
            console.log(`[Manager] Spawning new Sandbox for User: ${userId}`);
            this.sandboxes.set(userId, new Sandbox(userId));
        }
        return this.sandboxes.get(userId)!;
    }

    public getAllActiveUsers(): string[] {
        return Array.from(this.sandboxes.keys());
    }
}

export const sandboxManager = SandboxManager.getInstance();
