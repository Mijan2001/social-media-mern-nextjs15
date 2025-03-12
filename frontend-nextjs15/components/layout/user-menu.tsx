'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner'; // Import Sonner
import type { UserType } from '@/lib/types';
import { useLogoutMutation } from '@/lib/redux/api/authApi';

interface UserMenuProps {
    user: UserType;
}

export default function UserMenu({ user }: UserMenuProps) {
    const router = useRouter();
    const [logout, { isLoading }] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logout().unwrap();

            toast.success('Logged out successfully'); // Sonner success toast

            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Failed to logout'); // Sonner error toast
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    <AvatarImage
                        src={user.profilePicture?.url}
                        alt={user.username}
                    />
                    <AvatarFallback>
                        {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link
                        href={`/profile/${user._id}`}
                        className="cursor-pointer"
                    >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                    disabled={isLoading}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
