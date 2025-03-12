export interface UserType {
    _id: string;
    username: string;
    email: string;
    bio?: string;
    profilePicture?: {
        url: string;
        publicId: string;
    };
    posts: string[];
    savedPosts: string[];
    followers: string[];
    following: string[];
}

export interface PostType {
    _id: string;
    caption: string;
    image: {
        url: string;
        publicId: string;
    };
    user: UserType;
    likes: string[];
    comments: CommentType[];
    createdAt: string;
    updatedAt: string;
}

export interface CommentType {
    _id: string;
    text: string;
    user: UserType;
    post: string;
    createdAt: string;
    updatedAt: string;
}
