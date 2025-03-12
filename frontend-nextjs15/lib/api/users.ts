'use server';

import { cookies } from 'next/headers';

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function getUserById(userId: string) {
    try {
        const res = await fetch(`${API_URL}/users/${userId}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch user');
        }

        const data = await res.json();
        return data.data.user;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

export async function followUser(userId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        throw new Error('Not authenticated');
    }

    const res = await fetch(`${API_URL}/users/follow/${userId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to follow user');
    }

    return res.json();
}

export async function unfollowUser(userId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        throw new Error('Not authenticated');
    }

    const res = await fetch(`${API_URL}/users/unfollow/${userId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to unfollow user');
    }

    return res.json();
}

export async function checkIfFollowing(userId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return false;
    }

    try {
        const res = await fetch(`${API_URL}/users/check-follow/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to check follow status');
        }

        const data = await res.json();
        return data.isFollowing;
    } catch (error) {
        console.error('Error checking follow status:', error);
        return false;
    }
}
