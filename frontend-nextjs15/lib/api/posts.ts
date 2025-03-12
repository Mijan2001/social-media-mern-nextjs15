'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Update the API_URL configuration to handle potential undefined values better
const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function getAllPosts() {
    try {
        // Add timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const res = await fetch(`${API_URL}/posts/all`, {
            cache: 'no-store',
            signal: controller.signal,
            // Add these headers to help with potential CORS issues
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
            throw new Error(
                `Failed to fetch posts: ${res.status} ${res.statusText}`
            );
        }

        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        // Return an empty array instead of an object to maintain consistent return type
        return { posts: [] };
    }
}

export async function getUserPosts(userId: string) {
    try {
        const res = await fetch(`${API_URL}/posts/user-post/${userId}`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch user posts');
        }

        const data = await res.json();
        return data.data.posts;
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return [];
    }
}

export async function getSavedPosts(userId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return [];
        }

        const res = await fetch(`${API_URL}/users/saved-posts`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error('Failed to fetch saved posts');
        }

        const data = await res.json();
        return data.data.posts;
    } catch (error) {
        console.error('Error fetching saved posts:', error);
        return [];
    }
}

export async function createPost(formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        throw new Error('Not authenticated');
    }

    const res = await fetch(`${API_URL}/posts/create-post`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create post');
    }

    revalidatePath('/');
    return res.json();
}

export async function likePost(postId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        throw new Error('Not authenticated');
    }

    const res = await fetch(`${API_URL}/posts/like-dislike/${postId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to like post');
    }

    return res.json();
}

export async function savePost(postId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        throw new Error('Not authenticated');
    }

    const res = await fetch(`${API_URL}/posts/save-unsave-post/${postId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to save post');
    }

    return res.json();
}

export async function deletePost(postId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        throw new Error('Not authenticated');
    }

    const res = await fetch(`${API_URL}/posts/delete-post/${postId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete post');
    }

    revalidatePath('/');
    return res.json();
}

export async function addComment(postId: string, data: { text: string }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        throw new Error('Not authenticated');
    }

    const res = await fetch(`${API_URL}/posts/comment/${postId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to add comment');
    }

    return res.json();
}
