import { useRef } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";

function ParallaxText({ children, baseVelocity = 100 }) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400,
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false,
    });

    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className="parallax overflow-hidden m-0 flex flex-nowrap items-center">
            <motion.div className="scroller flex flex-nowrap gap-16 items-center" style={{ x }}>
                <span className="flex items-center gap-16">{children}</span>
                <span className="flex items-center gap-16">{children}</span>
                <span className="flex items-center gap-16">{children}</span>
                <span className="flex items-center gap-16">{children}</span>
            </motion.div>
        </div>
    );
}

export default function VelocityScroll({ items = [] }) {
    // Default items if none provided (fallback)
    const defaultItems = [
        { label: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { label: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { label: "TensorFlow", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
        { label: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
        { label: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
        { label: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    ];

    const displayItems = items.length > 0 ? items : defaultItems;

    return (
        <section className="py-6 overflow-hidden bg-black text-white border-y border-white/10">
            <ParallaxText baseVelocity={-2}>
                {displayItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                        {item.icon ? (
                            <img src={item.icon} alt={item.label} className="h-8 w-8 object-contain invert" />
                        ) : (
                            <span className="text-xl font-bold">{item.label}</span>
                        )}
                        <span className="text-sm font-medium uppercase tracking-widest">{item.label}</span>
                    </div>
                ))}
            </ParallaxText>
        </section>
    );
}
