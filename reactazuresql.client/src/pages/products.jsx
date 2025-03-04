import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate(); // To redirect if not authenticated

    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
            setError("No token found, redirecting to login...");
            setTimeout(() => navigate("/"), 2000);
            return;
        }

        fetch("https://localhost:7155/api/products", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch products");
                return response.json();
            })
            .then(data => setProducts(data))
            .catch(err => setError(err.message));
    }, [navigate]);

    return (
        <div className="products-container">
            <h2>Products</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        <strong>{product.name}</strong>: {product.description} - ${product.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Products;
