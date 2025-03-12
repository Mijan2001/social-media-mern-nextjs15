import { Suspense } from 'react';
import PostFeed from '@/components/post/post-feed';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import SuggestedUsers from '@/components/user/suggested-users';

export default function Home() {
    return (
        <main className="container max-w-6xl mx-auto py-10 px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <h1 className="text-3xl font-bold mb-8">Feed</h1>
                    <Suspense fallback={<PostFeedSkeleton />}>
                        <PostFeed />
                    </Suspense>
                </div>

                <div className="hidden md:block">
                    <h2 className="text-xl font-semibold mb-4">
                        Suggested Users
                    </h2>
                    <SuggestedUsers />
                </div>
            </div>
        </main>
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
