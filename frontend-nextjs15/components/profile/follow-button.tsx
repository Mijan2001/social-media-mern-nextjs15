'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner'; // Import Sonner
import { useAppSelector } from '@/lib/redux/hooks';
import { useFollowUserMutation } from '@/lib/redux/api/usersApi';
import { useState, useEffect } from 'react';

interface FollowButtonProps {
    userId: string;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

export default function FollowButton({
    userId,
    variant = 'default',
    size = 'sm'
}: FollowButtonProps) {
    const { user } = useAppSelector(state => state.auth);
    const [followUser, { isLoading }] = useFollowUserMutation();

    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        if (user) {
            setIsFollowing(user.following?.includes(userId) || false);
        }
    }, [user, userId]);

    const handleFollow = async () => {
        if (!user) {
            toast.error('You must be logged in to follow users');
            return;
        }

        if (user._id === userId) {
            return;
        }

        try {
            await followUser(userId).unwrap();
            setIsFollowing(!isFollowing);

            toast.success(isFollowing ? `Unfollowed user` : `Followed user`);
        } catch (error) {
            console.error(error);
            toast.error('An error occurred. Please try again');
        }
    };

    if (!user || user._id === userId) {
        return null;
    }

    return (
        <Button
            onClick={handleFollow}
            disabled={isLoading}
            variant={isFollowing ? 'outline' : variant}
            size={size}
        >
            {isLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
    );
}
