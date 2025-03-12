'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusSquare, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import UserMenu from './user-menu';
import { useAppSelector } from '@/lib/redux/hooks';
import { useGetCurrentUserQuery } from '@/lib/redux/api/authApi';
import ThemeToggle from './theme-toggle';

export default function Navbar() {
    const pathname = usePathname();
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const { data, isLoading, error } = useGetCurrentUserQuery(undefined, {
        skip: !isAuthenticated
    });

    const user = data?.data?.user;
    const apiConnected = !error;

    return (
        <header className="border-b">
            <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                    SocialApp
                </Link>

                {!isLoading && (
                    <nav>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link href="/">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Home"
                                    >
                                        <Home
                                            className={
                                                pathname === '/'
                                                    ? 'text-primary'
                                                    : ''
                                            }
                                        />
                                    </Button>
                                </Link>
                                <Link href="/explore">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Explore"
                                    >
                                        <Search
                                            className={
                                                pathname === '/explore'
                                                    ? 'text-primary'
                                                    : ''
                                            }
                                        />
                                    </Button>
                                </Link>
                                <Link href="/create">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Create Post"
                                    >
                                        <PlusSquare
                                            className={
                                                pathname === '/create'
                                                    ? 'text-primary'
                                                    : ''
                                            }
                                        />
                                    </Button>
                                </Link>
                                <ThemeToggle />
                                <UserMenu user={user} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <ThemeToggle />
                                <Link href="/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button>Register</Button>
                                </Link>
                            </div>
                        )}
                    </nav>
                )}
            </div>

            {!apiConnected && (
                <Alert variant="destructive" className="rounded-none">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        API connection failed. Please check your backend server
                        and environment variables.
                    </AlertDescription>
                </Alert>
            )}
        </header>
    );
}
