import { apiSlice } from './apiSlice';
import type { UserType } from '@/lib/types';

export const usersApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUserById: builder.query<{ data: { user: UserType } }, string>({
            query: userId => `/users/profile/${userId}`,
            providesTags: (result, error, userId) => [
                { type: 'User', id: userId }
            ]
        }),
        getSuggestedUsers: builder.query<{ data: { users: UserType[] } }, void>(
            {
                query: () => '/users/suggested-user',
                providesTags: ['User']
            }
        ),
        followUser: builder.mutation<
            { message: string; data: { user: UserType } },
            string
        >({
            query: userId => ({
                url: `/users/follow-unfollow/${userId}`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, userId) => [
                { type: 'User', id: userId },
                'User',
                'Auth'
            ]
        }),
        editProfile: builder.mutation<
            { message: string; data: { user: UserType } },
            FormData
        >({
            query: userData => ({
                url: '/users/edit-profile',
                method: 'POST',
                body: userData
            }),
            invalidatesTags: ['Auth', 'User']
        })
    })
});

export const {
    useGetUserByIdQuery,
    useGetSuggestedUsersQuery,
    useFollowUserMutation,
    useEditProfileMutation
} = usersApi;
