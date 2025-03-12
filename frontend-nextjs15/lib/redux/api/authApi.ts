import { apiSlice } from './apiSlice';
import { setCredentials, logOut } from '../slices/authSlice';
import type { UserType } from '@/lib/types';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    status: string;
    token: string;
    user: UserType;
}

export const authApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: credentials => ({
                url: '/users/login',
                method: 'POST',
                body: credentials
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Store token in localStorage
                    localStorage.setItem('token', data.token);
                    // Update Redux state
                    dispatch(
                        setCredentials({ user: data.user, token: data.token })
                    );
                } catch (error) {
                    console.error('Login failed:', error);
                }
            }
        }),
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: userData => ({
                url: '/users/register',
                method: 'POST',
                body: userData
            })
        }),
        logout: builder.mutation<{ success: boolean }, void>({
            query: () => ({
                url: '/users/logout',
                method: 'POST'
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // Remove token from localStorage
                    localStorage.removeItem('token');
                    // Update Redux state
                    dispatch(logOut());
                } catch (error) {
                    console.error('Logout failed:', error);
                }
            }
        }),
        getCurrentUser: builder.query<{ data: { user: UserType } }, void>({
            query: () => '/users/me',
            providesTags: ['Auth']
        })
    })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetCurrentUserQuery
} = authApi;
