import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Home, User, Briefcase, FolderGit2, Mail } from "lucide-react";

export default function DockNavigation() {
    const mouseX = useMotionValue(Infinity);

    const links = [
        { label: "Home", icon: Home, href: "/" },
        { label: "About", icon: User, href: "#about" },
        { label: "Experience", icon: Briefcase, href: "#experience" },
        { label: "Projects", icon: FolderGit2, href: "#projects" },
        { label: "Contact", icon: Mail, href: "#contact" },
    ];

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex h-16 items-end gap-4 rounded-2xl bg-gray-50/10 px-4 pb-3 backdrop-blur-md border border-white/20 dark:border-white/10 dark:bg-neutral-900/30 shadow-minimal"
        >
            {links.map((link, i) => (
                <DockIcon mouseX={mouseX} key={i} {...link} />
            ))}
        </motion.div>
    );
}

function DockIcon({ mouseX, icon: Icon, label, href }) {
    const ref = useRef(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    const handleClick = (e) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <motion.a
            ref={ref}
            href={href}
            onClick={handleClick}
            style={{ width }}
            className="aspect-square rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center relative group shadow-sm border border-black/5 dark:border-white/5 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
        >
            <Icon className="w-1/2 h-1/2 text-black dark:text-white" />

            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium bg-black/80 text-white px-2 py-1 rounded pointer-events-none whitespace-nowrap backdrop-blur-sm">
                {label}
            </div>
        </motion.a>
    );
}
