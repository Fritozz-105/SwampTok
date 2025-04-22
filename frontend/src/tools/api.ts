// api.ts
interface UserData {
    firebaseUid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
    dateOfBirth?: string;
    followers?: string[];
    following?: string[]; 
    bio?: string;
    interests?: string[];
}

interface PostData {
    firebaseUid: string;
    videoUrl: string;
    caption?: string;
    tags?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const syncUserWithMongoDB = async (userData: UserData) => {

    try {
        const response = await fetch(`${API_URL}/api/users/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Failed to sync with database',
                error: data.error
            };
        }

        return data;
    } catch (error) {
        console.error('Error syncing user with MongoDB:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            error: 'Connection failed'
        };
    }
};

export const getUserData = async (firebaseUid: string) => {
    try {
        const response = await fetch(`${API_URL}/api/users/${firebaseUid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Failed to fetch user data',
            };
        }

        return {
            success: true,
            user: data.user as UserData,
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};

export const createPost = async (postData: PostData) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    try {
        const response = await fetch(`${API_URL}/api/posts`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Failed to create post',
                error: data.error
            };
        }

        return data;
        } catch (error) {
        console.error('Error creating post:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            error: 'Connection failed'
        };
    }
};

export const getPosts = async (page = 1, limit = 10) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    try {
        const response = await fetch(`${API_URL}/api/posts?page=${page}&limit=${limit}`);
        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Failed to fetch posts' };
        }

        return data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        return { success: false, message: 'Connection failed' };
    }
};

export const likePost = async (postId: string, firebaseUid: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    try {
        const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firebaseUid }),
        });

        const data = await response.json();

        if (!response.ok) {
        return {
            success: false,
            message: data.message || 'Failed to like post',
        };
        }

        return data;
    } catch (error) {
        console.error('Error liking post:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};

export const unlikePost = async (postId: string, firebaseUid: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    try {
        const response = await fetch(`${API_URL}/api/posts/${postId}/unlike`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firebaseUid }),
        });

        const data = await response.json();

        if (!response.ok) {

        return {
            success: false,
            message: data.message || 'Failed to unlike post',
        };
        }

        return data;
    } catch (error) {
        console.error('Error unliking post:', error);

        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};

export const addComment = async (postId: string, firebaseUid: string, text: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    try {
        const response = await fetch(`${API_URL}/api/posts/${postId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firebaseUid, text }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Failed to add comment',
            };
        }

        return data;
    } catch (error) {
        console.error('Error adding comment:', error);

        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};

export const saveEvent = async ({
    firebaseUid,
    date,
    event
  }: {
    firebaseUid: string;
    date:string;
    event:string;
  }) => {
    const API_URL=import.meta.env.VITE_API_URL || 'http://localhost:8000';

    try {
      const response=await fetch(`${API_URL}/api/calendar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firebaseUid, date, eventName: event }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Non-OK response:', response.status, text);
        return {
          success: false,
          message: `Failed to save event: ${response.statusText}`,
        };
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        return { success: false, message: 'Invalid response format from server' };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error saving event:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  export const getCalendarEvents = async (firebaseUid: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${API_URL}/api/calendar/${firebaseUid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Non-OK response:', response.status, text);
        return {
          success: false,
          message: `Failed to fetch events: ${response.statusText}`,
        };
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        return { success: false, message: 'Invalid response format from server' };
      }

      const data = await response.json();
      return { success: true, events: data.events || [] };
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

export const deleteEvent = async (firebaseUid: string, date: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${API_URL}/api/calendar`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firebaseUid, date }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Non-OK response:', response.status, text);
        return {
          success: false,
          message: `Failed to delete event: ${response.statusText}`,
        };
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        return { success: false, message: 'Invalid response format from server' };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error deleting event:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message :'Unknown error',
      };
    }
  };

export const getUserPosts = async (firebaseUid: string) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    try {
        const response = await fetch(`${API_URL}/api/posts/user/${firebaseUid}`);
        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Failed to fetch user posts' };
        }

        return data;
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return { success: false, message: 'Connection failed' };
    }
};

export const updateUserProfile = async (firebaseUid: string, profileData: Partial<UserData>) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    try {
        const response = await fetch(`${API_URL}/api/users/${firebaseUid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Failed to update user profile',
            };
        }

        return {
            success: true,
            user: data.user as UserData,
        };
    } catch (error) {
        console.error('Error updating user profile:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
};
