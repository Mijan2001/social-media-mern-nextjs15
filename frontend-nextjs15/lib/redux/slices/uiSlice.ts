import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    isDarkMode: boolean;
    isApiConnected: boolean;
}

const initialState: UiState = {
    isDarkMode:
        typeof window !== 'undefined'
            ? localStorage.getItem('theme') === 'dark'
            : false,
    isApiConnected: false
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleDarkMode: state => {
            state.isDarkMode = !state.isDarkMode;
            if (typeof window !== 'undefined') {
                localStorage.setItem(
                    'theme',
                    state.isDarkMode ? 'dark' : 'light'
                );
            }
        },
        setApiConnected: (state, action: PayloadAction<boolean>) => {
            state.isApiConnected = action.payload;
        }
    }
});

export const { toggleDarkMode, setApiConnected } = uiSlice.actions;

export default uiSlice.reducer;
