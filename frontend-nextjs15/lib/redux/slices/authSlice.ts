import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserType } from '@/lib/types';

interface AuthState {
    user: UserType | null;
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isAuthenticated: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: UserType; token: string }>
        ) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
        },
        updateUser: (state, action: PayloadAction<UserType>) => {
            state.user = action.payload;
        },
        logOut: state => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        }
    }
});

export const { setCredentials, updateUser, logOut } = authSlice.actions;

export default authSlice.reducer;
