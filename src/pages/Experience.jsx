import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Timeline from "../components/Timeline";
import LoadingScreen from "../components/LoadingScreen";

import { cn } from "../lib/utils";
import { InteractiveGridPattern } from "../components/magicui/interactive-grid-pattern";

import { SparklesSeparator } from "../components/SparklesSeparator";

export default function Experience() {
    const [loading, setLoading] = useState(true);
    const [experience, setExperience] = useState([]);

    useEffect(() => {
        async function fetchExperience() {
            const { data } = await supabase
                .from("experience")
                .select("*")
                .eq("is_hidden", false)
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
            <InteractiveGridPattern
                className={cn(
                    "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
                    "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
                    "opacity-100 dark:opacity-100", // Fully visible in both modes (controlled by fill)
                    "fill-black/10 dark:fill-white/20" // Increased visibility in dark mode (adjusted)
                )}
            />
            <div className="relative z-10 max-w-5xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4 text-center">
                    Experience
                </h1>
                <div className="mb-16">
                    <SparklesSeparator lineWidth="w-1/2" />
                </div>
                <Timeline items={experience} />
            </div>
        </div>
    );
}
