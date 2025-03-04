import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Redirect after login

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Attempting login with:", { username, password });

            const response = await login(username, password);
            console.log("API Response:", response);

            if (response?.token) { // Ensure token exists in response
                localStorage.setItem("token", response.token);
                localStorage.setItem("rememberMe", rememberMe);

                console.log("Login successful, redirecting...");
                navigate("/products"); // Redirect after login
            } else {
                console.error("Login failed, no token received.");
                setError("Invalid credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Invalid credentials");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember Me
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
