import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx"; // Import the Login component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
