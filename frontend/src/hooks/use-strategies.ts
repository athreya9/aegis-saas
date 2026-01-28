import { useState, useEffect } from 'react';

// Define the Strategy interface matching the API response
export interface Strategy {
    id: string; // "trend-master-v1"
    name: string; // "Trend Master Pro"
    description: string;
    risk_profile: string; // "MODERATE"
    win_rate: string; // "68%"
    drawdown: string; // "12%"
    min_capital: number;
    tags: string[];
}

export function useStrategies() {
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStrategies() {
            try {
                // Use the configured backend URL or default to localhost:4100
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100';
                const response = await fetch(`${baseUrl}/api/v1/strategies`);

                if (!response.ok) {
                    throw new Error('Failed to fetch strategies');
                }

                const data = await response.json();
                setStrategies(data.strategies);
            } catch (err) {
                console.error("Error fetching strategies:", err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setIsLoading(false);
            }
        }

        fetchStrategies();
    }, []);

    return { strategies, isLoading, error };
}
