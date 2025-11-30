import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { DotPattern } from "../components/magicui/dot-pattern";
import { cn } from "../lib/utils";
import LoadingScreen from "../components/LoadingScreen";

export default function Skills() {
    const [loading, setLoading] = useState(true);
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        async function fetchSkills() {
            const { data: skillData } = await supabase.from("skills").select("*");
            setSkills(skillData || []);
            setLoading(false);
        }

        fetchSkills();
    }, []);

    if (loading) {
        return <LoadingScreen onComplete={() => setLoading(false)} />;
    }

    return (
        <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 bg-background relative overflow-hidden">
            <DotPattern
                className={cn(
                    "[mask-image:radial-gradient(300px_circle_at_50%_60%,white,transparent)]"
                )}
            />
            <div className="relative z-10 max-w-4xl mx-auto">
                <h1 className="text-center text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-16">
                    Technical Skills
                </h1>

                <div className="space-y-12">
                    {Object.entries(skills.reduce((acc, skill) => {
                        const category = skill.category || "Other";
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(skill.name);
                        return acc;
                    }, {})).map(([category, skillNames]) => (
                        <div key={category} className="grid md:grid-cols-[1fr_1.5fr] gap-4 md:gap-6 items-baseline max-w-3xl mx-auto">
                            <h4 className="text-xl font-bold uppercase tracking-widest text-muted-foreground text-center md:text-right">
                                {category} <span className="hidden md:inline">:</span>
                            </h4>
                            <p className="text-xl md:text-2xl font-medium leading-relaxed text-center md:text-left">
                                {skillNames.join(", ")}
                            </p>
                        </div>
                    ))}

                    {skills.length === 0 && (
                        <div className="text-center text-muted-foreground">
                            No skills found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
