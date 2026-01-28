export interface BrokerProfile {
    userId: string;
    userName: string;
    email: string;
    broker: string;
}

export interface BrokerMargins {
    enabled: boolean;
    net: number;
    available: number;
}

export interface IReadOnlyBroker {
    brokerName: string;

    /**
     * Validate the provided credentials with the broker (Read-Only)
     */
    validateCredentials(credentials: any): Promise<boolean>;

    /**
     * Check if the current session/token is still valid
     */
    checkTokenStatus(): Promise<{ valid: boolean; expiresAt?: Date }>;

    /**
     * Fetch user profile information (Read-Only)
     */
    fetchProfile(): Promise<BrokerProfile>;

    /**
     * Fetch account margins/balance (Read-Only)
     */
    fetchMargins(): Promise<BrokerMargins>;

    /**
     * Fetch list of tradable instruments/metadata (Read-Only)
     */
    fetchInstruments(): Promise<any[]>;

    /**
     * Disconnect the broker session
     */
    disconnect(): Promise<void>;
}
