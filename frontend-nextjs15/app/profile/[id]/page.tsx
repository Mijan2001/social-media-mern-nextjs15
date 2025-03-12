'use client';

import { useParams, notFound } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import UserProfile from '@/components/profile/user-profile';
import UserPosts from '@/components/profile/user-posts';
import { useGetUserByIdQuery } from '@/lib/redux/api/usersApi';
import type { PostType } from '@/lib/types'; // Adjust the import path as necessary

export default function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, error } = useGetUserByIdQuery(id);

    if (error) {
        return notFound();
    }

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    const user = data?.data?.user;

    if (!user) {
        return notFound();
    }

    return (
        <div className="container max-w-4xl mx-auto py-10 px-4">
            <UserProfile user={user} />

            <Tabs defaultValue="posts" className="mt-8">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="saved">Saved</TabsTrigger>
                </TabsList>
                <TabsContent value="posts" className="mt-4">
                    <UserPosts posts={user.posts as unknown as PostType[]} />
                </TabsContent>
                <TabsContent value="saved" className="mt-4">
                    <UserPosts
                        posts={user.savedPosts as unknown as PostType[]}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="container max-w-4xl mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-4 flex-1">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-full max-w-md" />
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {Array(6)
                        .fill(0)
                        .map((_, i) => (
                            <Skeleton
                                key={i}
                                className="aspect-square rounded-md"
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}
