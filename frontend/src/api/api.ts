const API_BASE_URL = "http://localhost:5000"; // Update this to match your backend

export const signupUser = async (userData: { fullName: string; email: string; password: string; dateOfBirth: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        if (!response.ok) throw new Error(`Signup failed: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Signup Error:", error);
        throw error;
    }
};

