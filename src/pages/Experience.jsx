import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Timeline from "../components/Timeline";
import LoadingScreen from "../components/LoadingScreen";

export default function Experience() {
    const [loading, setLoading] = useState(true);
    const [experience, setExperience] = useState([]);

    useEffect(() => {
        async function fetchExperience() {
            const { data } = await supabase
                .from("experience")
                .select("*")
                .order("start_date", { ascending: false });
            setExperience(data || []);
            setLoading(false);
        }
        fetchExperience();
    }, []);

    if (loading) {
        return <LoadingScreen onComplete={() => setLoading(false)} />;
    }

    return (
        <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 bg-background relative overflow-hidden">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-20 text-center">
                    Experience
                </h1>
                <Timeline items={experience} />
            </div>
        </div>
    );
}
