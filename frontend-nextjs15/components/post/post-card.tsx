'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
    Heart,
    MessageCircle,
    Bookmark,
    MoreHorizontal,
    Trash2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner'; // Import Sonner
import type { PostType } from '@/lib/types';
import {
    useLikePostMutation,
    useSavePostMutation,
    useDeletePostMutation
} from '@/lib/redux/api/postsApi';
import { useAppSelector } from '@/lib/redux/hooks';
import CommentSection from './comment-section';

interface PostCardProps {
    post: PostType;
}

export default function PostCard({ post }: PostCardProps) {
    const { user } = useAppSelector(state => state.auth);
    const [isLiked, setIsLiked] = useState(
        post.likes.includes(user?._id || '')
    );
    const [isSaved, setIsSaved] = useState(
        user?.savedPosts?.includes(post._id) || false
    );
    const [likesCount, setLikesCount] = useState(post.likes.length);
    const [showComments, setShowComments] = useState(false);

    const [likePost] = useLikePostMutation();
    const [savePost] = useSavePostMutation();
    const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

    const isOwner = user?._id === post.user._id;

    const handleLike = async () => {
        if (!user) {
            toast.error('You need to be logged in to like posts'); // Sonner error toast
            return;
        }

        try {
            await likePost(post._id).unwrap();
            setIsLiked(!isLiked);
            setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
        } catch (error) {
            console.error(error);
            toast.error('Failed to like post'); // Sonner error toast
        }
    };

    const handleSave = async () => {
        if (!user) {
            toast.error('You need to be logged in to save posts'); // Sonner error
            return;
        }

        try {
            await savePost(post._id).unwrap();
            setIsSaved(!isSaved);
            toast.success(isSaved ? 'Post unsaved' : 'Post saved'); // Sonner success toast
        } catch (error) {
            console.error(error);
            toast.error('Failed to save post'); // Sonner error toast
        }
    };

    const handleDelete = async () => {
        if (!isOwner) return;

        try {
            await deletePost(post._id).unwrap();
            toast.success('Post deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete post');
        }
    };

    return (
        <Card>
            <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-center">
                    <Link
                        href={`/profile/${post.user._id}`}
                        className="flex items-center gap-2"
                    >
                        <Avatar>
                            <AvatarImage
                                src={post.user.profilePicture?.url}
                                alt={post.user.username}
                            />
                            <AvatarFallback>
                                {post.user.username
                                    .substring(0, 2)
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{post.user.username}</p>
                            <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(post.createdAt), {
                                    addSuffix: true
                                })}
                            </p>
                        </div>
                    </Link>

                    {isOwner && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-4">
                {post.caption && <p className="mb-4">{post.caption}</p>}

                <div className="relative aspect-square rounded-md overflow-hidden">
                    <Image
                        src={post.image.url || '/placeholder.svg'}
                        alt={post.caption || 'Post image'}
                        fill
                        className="object-cover"
                    />
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex flex-col">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLike}
                            aria-label={isLiked ? 'Unlike' : 'Like'}
                        >
                            <Heart
                                className={`h-6 w-6 ${
                                    isLiked ? 'fill-red-500 text-red-500' : ''
                                }`}
                            />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowComments(!showComments)}
                            aria-label="Comment"
                        >
                            <MessageCircle className="h-6 w-6" />
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSave}
                        aria-label={isSaved ? 'Unsave' : 'Save'}
                    >
                        <Bookmark
                            className={`h-6 w-6 ${
                                isSaved ? 'fill-current' : ''
                            }`}
                        />
                    </Button>
                </div>

                {likesCount > 0 && (
                    <p className="text-sm font-medium mt-2">
                        {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                    </p>
                )}

                {showComments && <CommentSection post={post} />}
            </CardFooter>
        </Card>
    );
}
