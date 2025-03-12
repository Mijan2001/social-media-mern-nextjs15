'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { UserType } from '@/lib/types';
import { useAppSelector } from '@/lib/redux/hooks';
import { useFollowUserMutation } from '@/lib/redux/api/usersApi';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Pencil } from 'lucide-react';

interface UserProfileProps {
    user: UserType;
}

export default function UserProfile({ user }: UserProfileProps) {
    const { user: currentUser } = useAppSelector(state => state.auth);
    const [followUser, { isLoading }] = useFollowUserMutation();

    const isCurrentUser = currentUser?._id === user._id;
    const [isFollowing, setIsFollowing] = useState(
        currentUser?.following?.includes(user._id) || false
    );

    const handleFollow = async () => {
        if (!currentUser) {
            toast.error('You must be logged in to follow users');
            return;
        }

        try {
            await followUser(user._id).unwrap();
            setIsFollowing(!isFollowing);

            toast.success(
                isFollowing
                    ? `Unfollowed ${user.username}`
                    : `Followed ${user.username}`
            );
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again');
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24">
                <AvatarImage
                    src={user.profilePicture?.url}
                    alt={user.username}
                />
                <AvatarFallback className="text-2xl">
                    {user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="space-y-4 flex-1 text-center md:text-left">
                <div>
                    <h1 className="text-2xl font-bold">{user.username}</h1>
                    {user.bio && (
                        <p className="text-muted-foreground mt-1">{user.bio}</p>
                    )}
                </div>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div>
                        <span className="font-bold">
                            {user.posts?.length || 0}
                        </span>{' '}
                        <span className="text-muted-foreground">posts</span>
                    </div>
                    <div>
                        <span className="font-bold">
                            {user.followers?.length || 0}
                        </span>{' '}
                        <span className="text-muted-foreground">followers</span>
                    </div>
                    <div>
                        <span className="font-bold">
                            {user.following?.length || 0}
                        </span>{' '}
                        <span className="text-muted-foreground">following</span>
                    </div>
                </div>

                {isCurrentUser ? (
                    <Button variant="outline" asChild>
                        <Link href="/settings/profile">
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Link>
                    </Button>
                ) : (
                    <Button
                        onClick={handleFollow}
                        disabled={isLoading}
                        variant={isFollowing ? 'outline' : 'default'}
                    >
                        {isLoading
                            ? 'Loading...'
                            : isFollowing
                            ? 'Unfollow'
                            : 'Follow'}
                    </Button>
                )}
            </div>
        </div>
    );
}
