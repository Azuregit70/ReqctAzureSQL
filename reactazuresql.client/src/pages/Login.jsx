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
        setError(""); // Reset error state

        try {
            const response = await login(username, password);
            if (response.token) {
                // ✅ Store JWT token
                if (rememberMe) {
                    localStorage.setItem("token", response.token);
                } else {
                    sessionStorage.setItem("token", response.token);
                }
                alert("Login Successful!");
                navigate("/dashboard"); // ✅ Redirect after login
            } else {
                setError("Invalid credentials.");
            }
        } catch (error) {
            setError("Login failed. Please try again.");
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
