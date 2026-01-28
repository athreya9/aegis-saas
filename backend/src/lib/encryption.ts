import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

export interface EncryptedData {
    encrypted: string;
    iv: string;
    authTag: string;
}

export class EncryptionUtils {
    private readonly key: Buffer;

    constructor(secretKey: string) {
        // Ensure key is 32 bytes for AES-256
        this.key = crypto.scryptSync(secretKey, 'salt', 32);
    }

    encrypt(text: string): EncryptedData {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag().toString('hex');

        return {
            encrypted,
            iv: iv.toString('hex'),
            authTag
        };
    }

    decrypt(encrypted: string, ivHex: string, authTagHex: string): string {
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv);

        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}
