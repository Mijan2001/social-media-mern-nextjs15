'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toggleDarkMode } from '@/lib/redux/slices/uiSlice';
import { useEffect } from 'react';

export default function ThemeToggle() {
    const dispatch = useAppDispatch();
    const { isDarkMode } = useAppSelector(state => state.ui);

    useEffect(() => {
        // Apply dark mode class to document
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleDarkMode())}
        >
            {isDarkMode ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">
                {isDarkMode ? 'Light mode' : 'Dark mode'}
            </span>
        </Button>
    );
}
