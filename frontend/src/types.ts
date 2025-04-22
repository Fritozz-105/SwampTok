export interface User {
    _id: string;
    displayName: string;
    photoURL?: string;
}

export interface UserData {
    firebaseUid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
    dateOfBirth?: string;
    followers?: string[];    // ✅ Add this
    following?: string[]; 
}

export interface Comment {
    _id: string;
    userId: User | string;
    text: string;
    createdAt: string;
}

export interface CommentWithUser {
    _id: string;
    userId: User;
    text: string;
    createdAt: string;
}

export interface Post {
    _id: string;
    userId: {
        _id: string;
        displayName: string;
        photoURL?: string;
    };
    videoUrl: string;
    caption: string;
    tags: string[];
    likes: string[];
    comments: Comment[];
    createdAt: string;
}

export interface ApiResponse {
    success: boolean;
    posts: Post[];
    hasMore: boolean;
    message?: string;
}
