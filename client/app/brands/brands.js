"use client";
import { useState, useEffect } from "react";
import Loader from "../_utilities/Loader";

export default function Brands() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState(null); // Add error state

    useEffect(() => {
        fetch("http://localhost:3001/api/brands")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch brands");
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setBrands(data.data);
                setIsLoaded(true);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message); // Capture error message
                setIsLoaded(true);
            });
    }, []);

    if (!isLoaded) {
        return <Loader />;
    }

    if (error) {
        return (
            <section className="w-full">
                <div className="container py-10 px-5 bg-white rounded-lg shadow-inner text-center">
                    <h1 className="text-4xl"><b>Error</b></h1>
                    <p className="text-red-500">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full">
            <div className="container">
                <div className="py-10 px-5 bg-white rounded-lg mb-5 shadow-inner page-header">
                    <h1 className="text-4xl"><b>Brands</b></h1>
                    <p>Browse email newsletters from <b>{brands.length} brands</b> from across the web</p>
                </div>

                <div
                    className={`mb-32 grid ${
                        brands.length > 0
                            ? "gap-3 mx-auto lg:w-full lg:mb-0 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                            : "text-center"
                    } text-left`}
                >
                    {brands.length > 0 ? (
                        brands.map((brand, i) => (
                            <a
                                href={`/brands/${brand.brand_name}`}
                                key={i} // Ensure each element has a unique key
                                className="py-10 px-5 bg-white rounded-lg shadow-inner"
                            >
                                <h2>{brand.brand_name}</h2>
                            </a>
                        ))
                    ) : (
                        <p>No brands found</p>
                    )}
                </div>
            </div>
        </section>
    );
}