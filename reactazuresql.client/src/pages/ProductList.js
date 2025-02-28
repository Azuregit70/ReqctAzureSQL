import { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("https://localhost:5001/api/products")
            .then(response => setProducts(response.data))
            .catch(error => console.error("Error fetching products", error));
    }, []);

    return (
        <div>
            <h2>Product List</h2>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.name} - ${product.price} ({product.category.name})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
