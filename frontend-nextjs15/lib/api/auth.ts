'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Update the API_URL configuration to handle potential undefined values better
const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export async function login(data: LoginData) {
    const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to login');
    }

    const responseData = await res.json();

    // Set the token in cookies
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'token',
        value: responseData.token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return responseData;
}

export async function register(data: RegisterData) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to register');
    }

    return res.json();
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    revalidatePath('/');
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return null;
    }

    try {
        const res = await fetch(`${API_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch user');
        }

        const data = await res.json();
        return data.data.user;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}

// Add a function to check API connectivity
export async function checkApiConnection() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const res = await fetch(`${API_URL}/health`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        return res.ok;
    } catch (error) {
        console.error('API connection check failed:', error);
        return false;
    }
}
