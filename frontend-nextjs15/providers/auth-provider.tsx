'use client';

import { createContext, useEffect, useState, type ReactNode } from 'react';
import { getCurrentUser, checkApiConnection } from '@/lib/api/auth';
import type { UserType } from '@/lib/types';
import { toast } from 'sonner';

interface AuthContextType {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
    isLoading: boolean;
    apiConnected: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    isLoading: true,
    apiConnected: false
});

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [apiConnected, setApiConnected] = useState(false);

    useEffect(() => {
        const checkConnection = async () => {
            const connected = await checkApiConnection();
            setApiConnected(connected);

            if (!connected) {
                toast.error('Could not connect to the API');
            }
        };

        checkConnection();

        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, setUser, isLoading, apiConnected }}
        >
            {children}
        </AuthContext.Provider>
    );
}
