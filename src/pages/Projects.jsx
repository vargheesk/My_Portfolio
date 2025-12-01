import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ProjectCard from "../components/ProjectCard";
import LoadingScreen from "../components/LoadingScreen";

export default function Projects() {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        async function fetchProjects() {
            const { data } = await supabase
                .from("projects")
                .select("*")
                .eq("is_hidden", false)
                .order("created_at", { ascending: false });
            setProjects(data || []);
            setLoading(false);
        }
        fetchProjects();
    }, []);

    if (loading) {
        return <LoadingScreen onComplete={() => setLoading(false)} />;
    }

    return (
        <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-20 text-center">
                    Projects
                </h1>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}
