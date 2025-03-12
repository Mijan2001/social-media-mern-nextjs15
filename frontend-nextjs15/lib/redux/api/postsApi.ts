import { apiSlice } from './apiSlice';
import type { PostType, CommentType } from '@/lib/types';

export const postsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllPosts: builder.query<{ data: { posts: PostType[] } }, void>({
            query: () => '/posts/all',
            providesTags: result =>
                result
                    ? [
                          ...result.data.posts.map(({ _id }) => ({
                              type: 'Post' as const,
                              id: _id
                          })),
                          { type: 'Post', id: 'LIST' }
                      ]
                    : [{ type: 'Post', id: 'LIST' }]
        }),
        getUserPosts: builder.query<{ data: { posts: PostType[] } }, string>({
            query: userId => `/posts/user-post/${userId}`,
            providesTags: (result, error, userId) => [
                { type: 'Post', id: userId }
            ]
        }),
        getSavedPosts: builder.query<{ data: { posts: PostType[] } }, void>({
            query: () => '/users/saved-posts',
            providesTags: ['Post']
        }),
        createPost: builder.mutation<{ data: { post: PostType } }, FormData>({
            query: postData => ({
                url: '/posts/create-post',
                method: 'POST',
                body: postData
            }),
            invalidatesTags: [{ type: 'Post', id: 'LIST' }]
        }),
        likePost: builder.mutation<{ message: string }, string>({
            query: postId => ({
                url: `/posts/like-dislike/${postId}`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, postId) => [
                { type: 'Post', id: postId }
            ]
        }),
        savePost: builder.mutation<{ message: string }, string>({
            query: postId => ({
                url: `/posts/save-unsave-post/${postId}`,
                method: 'POST'
            }),
            invalidatesTags: ['Post', 'User']
        }),
        deletePost: builder.mutation<{ message: string }, string>({
            query: postId => ({
                url: `/posts/delete-post/${postId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [{ type: 'Post', id: 'LIST' }]
        }),
        addComment: builder.mutation<
            { message: string; comment: CommentType },
            { postId: string; text: string }
        >({
            query: ({ postId, text }) => ({
                url: `/posts/comment/${postId}`,
                method: 'POST',
                body: { text }
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: 'Post', id: postId }
            ]
        })
    })
});

export const {
    useGetAllPostsQuery,
    useGetUserPostsQuery,
    useGetSavedPostsQuery,
    useCreatePostMutation,
    useLikePostMutation,
    useSavePostMutation,
    useDeletePostMutation,
    useAddCommentMutation
} = postsApi;
