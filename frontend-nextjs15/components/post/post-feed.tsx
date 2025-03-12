'use client';

import { useGetAllPostsQuery } from '@/lib/redux/api/postsApi';
import PostCard from './post-card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function PostFeed() {
    const { data, error, isLoading } = useGetAllPostsQuery();

    if (isLoading) {
        return <PostFeedSkeleton />;
    }

    if (error) {
        return (
            <Alert variant="destructive" className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load posts. Please check your API connection and
                    try again.
                </AlertDescription>
            </Alert>
        );
    }

    const posts = data?.data?.posts || [];

    if (posts.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No posts found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {posts.map(post => (
                <PostCard key={post._id} post={post} />
            ))}
        </div>
    );
}

function PostFeedSkeleton() {
    return (
        <div className="space-y-6">
            {Array(3)
                .fill(0)
                .map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-[300px] w-full rounded-md" />
                        <div className="flex space-x-4">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                    </div>
                ))}
        </div>
    );
}
