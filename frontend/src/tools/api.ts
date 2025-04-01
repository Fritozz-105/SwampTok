interface UserData {
    firebaseUid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
    dateOfBirth?: string;
}

export const syncUserWithMongoDB = async (userData: UserData) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
