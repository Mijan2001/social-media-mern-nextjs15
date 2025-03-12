export interface User {
    _id: string;
    username: string;
    email: string;
    password?: string;
    bio?: string;
    profilePicture?: string;
    posts: Post[];
    savedPosts: string[] | Post[];
    followers: string[];
    following: string[];
    isVerified: boolean;
}

export interface Post {
    _id: string;
    caption: string;
    image?: {
        url: string;
        publicId: string;
    };
    user: User | undefined;
    likes: string[];
    comments: Comment[];
    createdAt: string;
}

export interface Comment {
    _id: string;
    text: string;
    user: {
        _id: string;
        username: string;
        profilePicture: string;
    };
    createdAt: string;
}
