import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Github, ExternalLink, ArrowLeft } from "lucide-react";

export default function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProject() {
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("id", id)
                .single();

            if (data) setProject(data);
            setLoading(false);
        }
        fetchProject();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">LOADING...</div>;
    if (!project) return <div className="min-h-screen flex items-center justify-center">PROJECT NOT FOUND</div>;

    return (
        <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-12 hover:opacity-50 transition-opacity">
                <ArrowLeft size={16} /> Back to Home
            </Link>

            <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-8">
                {project.title}
            </h1>

            <div className="aspect-video w-full bg-muted mb-12 overflow-hidden">
                {project.image_url && (
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                    <div className="prose prose-lg dark:prose-invert">
                        <p className="text-xl leading-relaxed text-muted-foreground whitespace-pre-wrap">
                            {project.description}
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-muted-foreground">Links</h3>
                        <div className="flex flex-col gap-4">
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    className="flex items-center gap-3 hover:opacity-50 transition-opacity"
                                >
                                    <Github size={20} />
                                    <span className="font-bold">View Code</span>
                                </a>
                            )}
                            {project.demo_url && (
                                <a
                                    href={project.demo_url}
                                    target="_blank"
                                    className="flex items-center gap-3 hover:opacity-50 transition-opacity"
                                >
                                    <ExternalLink size={20} />
                                    <span className="font-bold">Live Demo</span>
                                </a>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-muted-foreground">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.tags?.map((tag, i) => (
                                <span key={i} className="text-xs font-mono border border-border px-2 py-1 uppercase">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
