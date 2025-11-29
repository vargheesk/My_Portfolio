import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ScrollReveal from "../components/ScrollReveal";
import LoadingScreen from "../components/LoadingScreen";

export default function About() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            const { data: profileData } = await supabase.from("profile").select("*").single();
            setProfile(profileData);
            setLoading(false);
        }

        fetchProfile();
    }, []);

    if (loading) {
        return <LoadingScreen onComplete={() => setLoading(false)} />;
    }

    return (
        <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8">
                        About Me
                    </h2>
                    <div className="prose prose-lg dark:prose-invert">
                        <ScrollReveal
                            baseOpacity={0}
                            enableBlur={true}
                            baseRotation={5}
                            blurStrength={10}
                            wordAnimationEnd="bottom center"
                            scrub={1}
                            textClassName="text-xl leading-relaxed text-muted-foreground"
                        >
                            {profile?.bio || "I am a Data Scientist passionate about uncovering insights from data..."}
                        </ScrollReveal>
                    </div>

                    <div className="mt-12 flex gap-6">
                        {profile?.resume_url && (
                            <a
                                href={profile.resume_url}
                                target="_blank"
                                className="px-8 py-3  text-red-600 border border-black  uppercase tracking-widest hover:opacity-50 transition-opacity"
                            >
                                Download Resume
                            </a>
                        )}
                    </div>
                </div>
                <div className="relative aspect-square bg-muted overflow-hidden rounded-2xl shadow-minimal">
                    <img
                        src={profile?.avatar_url}
                        onError={(e) => {
                            if (e.target.src.includes("profile.png")) {
                                e.target.onerror = null;
                                e.target.src = "https://i.postimg.cc/PxzpRWV0/Adobe-Express-file123.png";
                            } else {
                                e.target.src = "/profile.png";
                            }
                        }}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
