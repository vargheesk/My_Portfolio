import { motion } from "framer-motion";

const ExperienceItem = ({ role, company, start_date, end_date, description, index }) => {
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    const duration = `${formatDate(start_date)} - ${end_date ? formatDate(end_date) : "Present"}`;

    return (
        <motion.div
            className="relative pl-8 md:pl-0 md:grid md:grid-cols-12 gap-8 mb-12 group"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
        >
            {/* Timeline Line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-border md:left-1/2 md:-ml-px group-last:bottom-auto group-last:h-full" />

            {/* Dot */}
            <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-foreground md:left-1/2 md:-ml-1" />

            {/* Left Side (Date) */}
            <div className="md:col-span-5 md:text-right md:pr-8 mb-2 md:mb-0">
                <span className="text-sm font-mono text-muted-foreground">{duration}</span>
            </div>

            {/* Right Side (Content) */}
            <div className="md:col-span-7 md:col-start-7 md:pl-8">
                <h3 className="text-xl font-bold uppercase tracking-tight">{role}</h3>
                <div className="text-lg font-medium mb-2">{company}</div>
                <p className="text-muted-foreground leading-relaxed max-w-prose">
                    {description}
                </p>
            </div>
        </motion.div>
    );
};

export default function Timeline({ items }) {
    return (
        <div className="relative py-20">
            {items.map((item, index) => (
                <ExperienceItem key={item.id || index} {...item} index={index} />
            ))}
        </div>
    );
}
