"use client";
import { useState, useEffect } from "react";
import Loader from "../../../_utilities/Loader";

export default function Template({ params }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [template, setTemplate] = useState(null); // Changed to null for better type handling
    const [emailBody, setEmailBody] = useState("");

    useEffect(() => {
        // Unwrap params asynchronously
        const fetchTemplate = async () => {
            const { id } = params;
            if (id) {
                try {
                    const response = await fetch(`http://localhost:3001/api/templates/${id}`);
                    const data = await response.json();
                    setTemplate(data.data);
                    setEmailBody(data.data?.email_body || ""); // Safely access email_body
                    setIsLoaded(true);
                } catch (error) {
                    console.error("Error fetching template:", error);
                }
            }
        };

        fetchTemplate();
    }, [params]);

    if (!isLoaded) {
        return <Loader />;
    }

    return (
        <section className="w-full">
            <div className="container grid grid-cols-4 gap-4">
                <div className="col-span-1">
                    <div className="sticky top-[90px] py-3 px-3 bg-white rounded-lg mb-5 shadow-inner">
                        <h1 className="text-2xl">
                            <b>{template ? decodeURIComponent(template.brand_name) : "Loading..."}</b>
                        </h1>
                        <h2><b>{template.email_title}</b></h2>
                        <p className="font-2xl">{template.email_description}</p>
                        <hr className="my-3" />
                        <small>This email was saved on</small>
                        <p><b>Date:</b> { template.date }</p>
                    </div>
                </div>
                <div className="col-span-3 rounded-lg bg-[#fdfdfd]">
                        {/* Render HTML safely */}
                        <div className="mx-auto max-w-[600px]" dangerouslySetInnerHTML={{ __html: emailBody }} />
                </div>
            </div>
        </section>
    );
}
