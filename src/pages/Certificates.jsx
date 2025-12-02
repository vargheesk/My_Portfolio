import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import LoadingScreen from "../components/LoadingScreen";

import { SparklesSeparator } from "../components/SparklesSeparator";

export default function Certificates() {
    const [loading, setLoading] = useState(true);
    const [certificates, setCertificates] = useState([]);

    useEffect(() => {
        async function fetchCertificates() {
            const { data } = await supabase
                .from("certificates")
                .select("*")
                .eq("is_hidden", false)
                .order("created_at", { ascending: false });
            setCertificates(data || []);
            setLoading(false);
        }
        fetchCertificates();
    }, []);

    if (loading) {
        return <LoadingScreen onComplete={() => setLoading(false)} />;
    }

    return (
        <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4 text-center">
                    Certifications
                </h1>
                <div className="mb-16">
                    <SparklesSeparator />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {certificates.map((cert) => (
                        <a
                            key={cert.id}
                            href={cert.credential_url}
                            target="_blank"
                            className="group block aspect-[4/3] bg-muted relative overflow-hidden"
                        >
                            {cert.image_url ? (
                                <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs uppercase font-bold">
                                    {cert.title}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white p-4 text-center">
                                <span className="text-sm font-bold uppercase">{cert.issuer}</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
