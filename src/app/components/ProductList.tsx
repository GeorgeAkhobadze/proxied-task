"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/app/graphql/queries";
import { Product } from "@/app/graphql/types";

const ProductList: React.FC = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const { data, loading, error } = useQuery<{ getProducts: { products: Product[] } }>(GET_PRODUCTS, {
        skip: !token,
    });

    if (!token) return <p>Checking authentication...</p>;
    if (loading) return <p>Loading products...</p>;
    if (error) return <p>Error loading products: {error.message}</p>;
    if (!data?.getProducts?.products.length) return <p>No products available</p>;

    return (
        <ul>
            {data.getProducts.products.map((product, index) => (
                <li key={index}>
                    {product.title} - ${product.cost}
                </li>
            ))}
        </ul>
    );
};

export default ProductList;
