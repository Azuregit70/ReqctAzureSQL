import axios from "axios";

export const login = async (username, password) => {
    try {
        const response = await fetch("https://localhost:7155/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials:"include",
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error("Invalid credentials");
        }

        return await response.json(); // Expecting { "token": "JWT_HERE" }
    } catch (error) {
        console.error("AuthService Login Error:", error);
        throw error;
    }
};
