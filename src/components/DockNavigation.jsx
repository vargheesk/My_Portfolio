import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Home, User, Briefcase, FolderGit2, Mail, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { vibrate } from "../utils/haptics";

export default function DockNavigation() {
    const mouseX = useMotionValue(Infinity);
    const navigate = useNavigate();

    const links = [
        { label: "Home", icon: Home, href: "/" },

        { label: "Skills", icon: Cpu, href: "/skills" },
        { label: "Experience", icon: Briefcase, href: "/experience" },
        { label: "Projects", icon: FolderGit2, href: "/projects" },
        { label: "Contact", icon: Mail, href: "/#contact" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.5, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            onTouchMove={(e) => mouseX.set(e.touches[0].clientX)} // Enable zoom on touch drag
            onTouchStart={(e) => mouseX.set(e.touches[0].clientX)} // Enable zoom on touch start
            onTouchEnd={() => mouseX.set(Infinity)} // Reset on touch end for mobile
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex h-16 items-end gap-4 rounded-2xl bg-gray-50/10 px-4 pb-3 backdrop-blur-md border border-white/20 dark:border-white/10 dark:bg-neutral-900/30 shadow-minimal"
        >
            {links.map((link, i) => (
                <DockIcon mouseX={mouseX} key={i} {...link} navigate={navigate} />
            ))}
        </motion.div>
    );
}

function DockIcon({ mouseX, icon: Icon, label, href, navigate }) {
    const ref = useRef(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    const handleClick = (e) => {
        e.preventDefault();
        vibrate(35);
        mouseX.set(Infinity); // Reset zoom on click (fixes mobile sticky hover)
        if (href.startsWith("/#")) {
            // Handle hash navigation from any page
            const [path, hash] = href.split("#");
            if (window.location.pathname !== path) {
                navigate(path);
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                }, 100);
            } else {
                const element = document.getElementById(hash);
                if (element) element.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            navigate(href);
        }
    };

    return (
        <motion.a
            ref={ref}
            href={href}
            onClick={handleClick}
            onMouseEnter={() => vibrate(30)} // Haptic on hover
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
