import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectCard({ project, index }) {
    return (
        <motion.div
            className="group relative block bg-card dark:bg-neutral-900 border border-border overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
        >
            <div className="aspect-video overflow-hidden bg-muted">
                {project.image_url ? (
                    <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        NO IMAGE
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold uppercase tracking-tighter">{project.title}</h3>
                    <div className="flex gap-3">
                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-muted-foreground transition-colors"
                            >
                                <Github size={20} />
                            </a>
                        )}
                        {project.demo_url && (
                            <a
                                href={project.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-muted-foreground transition-colors"
                            >
                                <ExternalLink size={20} />
                            </a>
                        )}
                    </div>
                </div>

                <p className="text-muted-foreground line-clamp-3 mb-6">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags && project.tags.map((tag, i) => (
                        <span key={i} className="text-xs font-mono border border-border px-2 py-1 uppercase">
                            {tag}
                        </span>
                    ))}
                </div>

                <Link
                    to={`/project/${project.id}`}
                    className="inline-block text-sm font-bold uppercase tracking-widest border-b border-foreground pb-1 hover:opacity-50 transition-opacity"
                >
                    View Details
                </Link>
            </div>
        </motion.div>
    );
}
