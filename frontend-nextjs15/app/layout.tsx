import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/layout/navbar';
import { Toaster } from 'sonner'; // Import Sonner
import ReduxProvider from '@/providers/redux-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Social Media App',
    description: 'A social media application built with Next.js and Express',
    generator: 'v0.dev'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ReduxProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className="min-h-screen flex flex-col">
                            <Navbar />
                            <div className="flex-1">{children}</div>
                        </div>
                        <Toaster />
                    </ThemeProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
