import axios from 'axios';
import { cookies } from 'next/headers';

// Client-side axios instance
export const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include auth token for client-side requests
axiosClient.interceptors.request.use(
    config => {
        // Get token from localStorage on client side
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Server-side axios instance
export const axiosServer = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        }
    });
};

// For file uploads
export const axiosUpload = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

axiosUpload.interceptors.request.use(
    config => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
