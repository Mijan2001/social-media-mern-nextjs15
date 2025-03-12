'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { PostType } from '@/lib/types';

interface UserPostsProps {
    posts: PostType[];
}

export default function UserPosts({ posts }: UserPostsProps) {
    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No posts yet</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {posts.map(post => (
                <Link
                    key={post._id}
                    href={`/post/${post._id}`}
                    className="block"
                >
                    <div className="relative aspect-square rounded-md overflow-hidden">
                        <Image
                            src={post.image.url || '/placeholder.svg'}
                            alt={post.caption || 'Post image'}
                            fill
                            className="object-cover hover:opacity-90 transition-opacity"
                        />
                    </div>
                </Link>
            ))}
        </div>
    );
}
