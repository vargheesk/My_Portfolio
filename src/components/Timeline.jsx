import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "../lib/utils";

const ExperienceItem = ({ role, company, start_date, end_date, description, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    const duration = `${formatDate(start_date)} - ${end_date ? formatDate(end_date) : "Present"}`;

    // Truncate logic
    const MAX_LENGTH = 150;
    const shouldTruncate = description && description.length > MAX_LENGTH;
    const textToShow = isExpanded ? description : (shouldTruncate ? description.slice(0, MAX_LENGTH) : description);

    return (
        <motion.div
            className="relative pl-8 md:pl-12 mb-12 group last:mb-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
        >
            {/* Timeline Line */}
            <div className="absolute left-2 top-2 bottom-[-48px] w-px bg-border group-last:bottom-auto group-last:h-full" />

            {/* Dot */}
            <div className="absolute left-[5px] top-2.5 w-1.5 h-1.5 rounded-full bg-foreground ring-2 ring-background" />

            {/* Content */}
            <div className="flex flex-col items-start text-left">
                <span className="text-xs font-mono text-muted-foreground mb-1">{duration}</span>
                <h3 className="text-xl font-bold uppercase tracking-tight leading-none mb-1">{role}</h3>
                <div className="text-sm font-medium text-muted-foreground mb-3">{company}</div>

                <p className="text-muted-foreground leading-relaxed max-w-prose text-sm md:text-base">
                    {textToShow}
                    {shouldTruncate && (
                        <>
                            {!isExpanded && "..."}
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="inline-block ml-2 text-xs font-bold uppercase tracking-widest hover:opacity-50 transition-opacity underline decoration-1 underline-offset-2"
                            >
                                {isExpanded ? "Read Less" : "Read More"}
                            </button>
                        </>
                    )}
                </p>
            </div>
        </motion.div>
    );
};

export default function Timeline({ items }) {
    return (
        <div className="relative py-10 max-w-3xl mx-auto">
            {items.map((item, index) => (
                <ExperienceItem key={item.id || index} {...item} index={index} />
            ))}
        </div>
    );
}
