'use client';

import { useGetSuggestedUsersQuery } from '@/lib/redux/api/usersApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import FollowButton from '@/components/profile/follow-button';

export default function SuggestedUsers() {
    const { data, isLoading, error } = useGetSuggestedUsersQuery();

    if (isLoading) {
        return <SuggestedUsersSkeleton />;
    }

    if (error || !data) {
        return (
            <Card>
                <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                        Failed to load suggested users
                    </p>
                </CardContent>
            </Card>
        );
    }

    const users = data.data.users;

    if (users.length === 0) {
        return (
            <Card>
                <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                        No suggested users found
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-4">
                    {users.slice(0, 5).map(user => (
                        <div
                            key={user._id}
                            className="flex items-center justify-between"
                        >
                            <Link
                                href={`/profile/${user._id}`}
                                className="flex items-center gap-2"
                            >
                                <Avatar className="h-10 w-10">
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
                                    <p className="font-medium text-sm">
                                        {user.username}
                                    </p>
                                    {user.bio && (
                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                            {user.bio}
                                        </p>
                                    )}
                                </div>
                            </Link>
                            <FollowButton userId={user._id} />
                        </div>
                    ))}

                    {users.length > 5 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            asChild
                        >
                            <Link href="/explore">See More</Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function SuggestedUsersSkeleton() {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-4">
                    {Array(5)
                        .fill(0)
                        .map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div>
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-32 mt-1" />
                                    </div>
                                </div>
                                <Skeleton className="h-9 w-20" />
                            </div>
                        ))}
                </div>
            </CardContent>
        </Card>
    );
}
