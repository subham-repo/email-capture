"use client";
import { useState, useEffect } from "react";
import Loader from "../../_utilities/Loader";
import Tesseract from "tesseract.js"; // Import OCR library
import {parseDate} from "../../_utilities/Helper"

export default function Templates({ params }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [brands, setBrands] = useState([]);
    const [brandName, setBrandName] = useState(null);
    const [thumbnails, setThumbnails] = useState({}); // Store thumbnails for each brand

    useEffect(() => {
        // Resolve params
        (async () => {
            const resolvedParams = await params;
            setBrandName(resolvedParams.brand_name);
        })();
    }, [params]);

    useEffect(() => {
        if (brandName) {
            fetch(`http://localhost:3001/api/brands/${brandName}`)
                .then((res) => res.json())
                .then((data) => {
                    setBrands(data.data);
                    setIsLoaded(true);
                })
                .catch((error) => console.error("Error fetching brands:", error));
        }
    }, [brandName]);

    // Function to calculate color variance of an image
    const calculateColorVariance = async (imgSrc) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Ensure CORS is handled for cross-origin images
            img.src = imgSrc;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0, img.width, img.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

                let rSum = 0,
                    gSum = 0,
                    bSum = 0,
                    rVar = 0,
                    gVar = 0,
                    bVar = 0;

                for (let i = 0; i < imageData.length; i += 4) {
                    rSum += imageData[i];
                    gSum += imageData[i + 1];
                    bSum += imageData[i + 2];
                }

                const totalPixels = imageData.length / 4;
                const rAvg = rSum / totalPixels;
                const gAvg = gSum / totalPixels;
                const bAvg = bSum / totalPixels;

                for (let i = 0; i < imageData.length; i += 4) {
                    rVar += Math.pow(imageData[i] - rAvg, 2);
                    gVar += Math.pow(imageData[i + 1] - gAvg, 2);
                    bVar += Math.pow(imageData[i + 2] - bAvg, 2);
                }

                const variance =
                    (rVar / totalPixels + gVar / totalPixels + bVar / totalPixels) / 3;

                resolve(variance);
            };

            img.onerror = () => resolve(0); // If the image cannot be loaded, return 0 variance
        });
    };

    // Function to detect text content using OCR
    const detectTextContent = async (imgSrc) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Handle cross-origin images
            img.src = imgSrc;

            img.onload = async () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0, img.width, img.height);

                try {
                    const { data } = await Tesseract.recognize(canvas, "eng");
                    resolve(data.text.trim().length > 0); // Resolve true if text is detected
                } catch (error) {
                    console.error("Error with OCR:", error);
                    resolve(false); // Resolve false if OCR fails
                }
            };

            img.onerror = () => resolve(false); // Resolve false if image fails to load
        });
    };

    // Function to find the largest and most colorful banner in the email body
    const findBestBanner = async (emailBody, brandId) => {
        // Create a temporary DOM element to parse the email body
        const container = document.createElement("div");
        container.innerHTML = emailBody;

        // Find all image elements in the email body
        const images = Array.from(container.querySelectorAll("img"));

        if (images.length === 0) {
            console.warn(`No images found for brand ID ${brandId}`);
            return;
        }

        // Calculate height, color variance, and text content for each image
        const imageData = await Promise.all(
            images.map(async (img) => {
                const variance = await calculateColorVariance(img.src);
                const hasText = await detectTextContent(img.src); // Check if the image contains text
                return {
                    src: img.src,
                    height: img.height,
                    variance,
                    hasText,
                };
            })
        );

        // Sort images by height and colorfulness (variance), prioritize those with text
        const bestImage = imageData
            .filter((img) => img.height >= 200) // Minimum height for banners
            .sort((a, b) => {
                if (b.hasText !== a.hasText) return b.hasText - a.hasText; // Prioritize images with text
                return b.height - a.height || b.variance - a.variance; // Then sort by height and color variance
            })[0];

        if (bestImage) {
            setThumbnails((prev) => ({ ...prev, [brandId]: bestImage.src }));
        } else {
            console.warn(`No suitable banner found for brand ID ${brandId}`);
        }
    };

    // Generate thumbnails for all brands after data is loaded
    useEffect(() => {
        if (isLoaded && brands.length > 0) {
            brands.forEach((brand) => findBestBanner(brand.email_body, brand.id));
        }
    }, [isLoaded, brands]);

    return (
        <section className="w-full">
            <div className="container">
                <div className="py-10 px-5 bg-white rounded-lg mb-5 shadow-inner page-header">
                    <h1 className="text-4xl">
                        <b>{brandName ? decodeURIComponent(brandName) : "Loading..."}</b>
                    </h1>
                    <p>
                        Browse email <b>{brands.length}</b> newsletters of <b>{decodeURIComponent(brandName)}</b>{" "}
                        brands from across the web
                    </p>
                </div>

                <div
                    className={`mb-32 grid ${
                        brands.length > 0
                            ? "gap-3 mx-auto lg:w-full lg:mb-0 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                            : ""
                    } text-left`}
                >
                    {!isLoaded && <Loader />}
                    {brands.length > 0 &&
                        brands.map((brand) => (
                            <a href={`/brands/${brandName}/${brand.id}`} key={brand.id} className="py-3 px-3 bg-white rounded-lg shadow-inner">
                                {/* Display the best banner */}
                                {thumbnails[brand.id] ? (
                                    <img
                                        src={thumbnails[brand.id]}
                                        alt="Email Banner Thumbnail"
                                        className="thumbnail"
                                        style={{ width: "100%", height: "300px", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div className="loader">No Banner Found</div>
                                )}
                                <small>{ parseDate(brand.date) }</small>
                                <h2>
                                    <b>{brand.email_title}</b>
                                </h2>
                                <p>{ String(brand.email_description).substring(0, 100) }</p>
                            </a>
                        ))}
                </div>
            </div>
        </section>
    );
}
