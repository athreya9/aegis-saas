export interface OrderParams {
    symbol: string;
    transaction_type: 'BUY' | 'SELL';
    quantity: number;
    product: 'MIS' | 'CNC' | 'NRML';
    order_type: 'MARKET' | 'LIMIT' | 'SL' | 'SL-M';
    price?: number;
    trigger_price?: number;
    tag?: string;
}

export interface Position {
    tradingsymbol: string;
    quantity: number;
    average_price: number;
    last_price: number;
    pnl: number;
    product: string;
}

export interface BrokerAdapter {
    /**
     * Connect to the broker using auth entitlements (API Key / Access Token)
     */
    connect(authData: any): Promise<boolean>;

    /**
     * Check if the current session is valid
     */
    validateSession(): Promise<boolean>;

    /**
     * Place an order (Paper Mode: Logs only)
     */
    placeOrder(params: OrderParams): Promise<string>; // Returns Order ID

    /**
     * Get current open positions
     */
    getPositions(): Promise<Position[]>;

    /**
     * Close the connection
     */
    disconnect(): Promise<void>;
}
