import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Products from "./pages/products";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/products" element={<Products />} />
            </Routes>
        </Router>
    );
}

export default App;