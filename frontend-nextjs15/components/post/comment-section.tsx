'use client';

import type React from 'react';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { PostType } from '@/lib/types';
import { useAddCommentMutation } from '@/lib/redux/api/postsApi';
import { useAppSelector } from '@/lib/redux/hooks';

interface CommentSectionProps {
    post: PostType;
}

export default function CommentSection({ post }: CommentSectionProps) {
    const { user } = useAppSelector(state => state.auth);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(post.comments || []);

    const [addComment, { isLoading: isSubmitting }] = useAddCommentMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('You must be logged in to comment');
            return;
        }

        if (!comment.trim()) return;

        try {
            const response = await addComment({
                postId: post._id,
                text: comment
            }).unwrap();

            setComments([...comments, response.comment]);
            setComment('');

            toast.success('Comment added successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to add comment');
        }
    };

    return (
        <div className="mt-4 space-y-4">
            <div className="max-h-60 overflow-y-auto space-y-4">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment._id} className="flex gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={comment.user.profilePicture?.url}
                                    alt={comment.user.username}
                                />
                                <AvatarFallback>
                                    {comment.user.username
                                        .substring(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">
                                        {comment.user.username}
                                    </p>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(
                                            new Date(comment.createdAt),
                                            { addSuffix: true }
                                        )}
                                    </span>
                                </div>
                                <p className="text-sm">{comment.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center">
                        No comments yet
                    </p>
                )}
            </div>

            {user && (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <Button
                        type="submit"
                        size="sm"
                        disabled={isSubmitting || !comment.trim()}
                    >
                        Post
                    </Button>
                </form>
            )}
        </div>
    );
}
