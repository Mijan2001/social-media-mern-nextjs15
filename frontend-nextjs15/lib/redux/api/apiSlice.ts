import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        prepareHeaders: (headers, { getState }) => {
            // Get token from Redux store
            const token = (getState() as RootState).auth.token;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Post', 'User', 'Comment', 'Auth'],
    endpoints: () => ({})
});
