'use client';

import { useGetSuggestedUsersQuery } from '@/lib/redux/api/usersApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import FollowButton from '@/components/profile/follow-button';

export default function ExplorePage() {
    const { data, isLoading, error } = useGetSuggestedUsersQuery();

    if (isLoading) {
        return <ExplorePageSkeleton />;
    }

    if (error) {
        return (
            <div className="container max-w-4xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-8">Explore</h1>
                <p className="text-muted-foreground">
                    Failed to load users. Please try again later.
                </p>
            </div>
        );
    }

    const users = data?.data?.users || [];

    return (
        <div className="container max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Explore</h1>

            {users.length === 0 ? (
                <p className="text-muted-foreground">No users found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {users.map(user => (
                        <Card key={user._id}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <Link
                                        href={`/profile/${user._id}`}
                                        className="flex items-center gap-3"
                                    >
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage
                                                src={user.profilePicture?.url}
                                                alt={user.username}
                                            />
                                            <AvatarFallback>
                                                {user.username
                                                    .substring(0, 2)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">
                                                {user.username}
                                            </p>
                                            {user.bio && (
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {user.bio}
                                                </p>
                                            )}
                                            <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                                                <span>
                                                    {user.posts?.length || 0}{' '}
                                                    posts
                                                </span>
                                                <span>
                                                    {user.followers?.length ||
                                                        0}{' '}
                                                    followers
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                    <FollowButton userId={user._id} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

function ExplorePageSkeleton() {
    return (
        <div className="container max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Explore</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array(8)
                    .fill(0)
                    .map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div>
                                            <Skeleton className="h-5 w-32" />
                                            <Skeleton className="h-4 w-48 mt-1" />
                                            <Skeleton className="h-3 w-24 mt-1" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-9 w-20" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    );
}
