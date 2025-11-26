import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function VariableProximity({ items }) {
    const mouseX = useMotionValue(Infinity);

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="mx-auto flex h-16 items-end gap-4 rounded-2xl bg-gray-50/10 px-4 pb-3 backdrop-blur-md border border-white/20 dark:border-white/10 dark:bg-neutral-900/30 shadow-minimal"
        >
            {items.map((item, i) => (
                <AppIcon mouseX={mouseX} key={i} src={item.icon} label={item.label} />
            ))}
        </motion.div>
    );
}

function AppIcon({ mouseX, src, label }) {
    const ref = useRef(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <motion.div
            ref={ref}
            style={{ width }}
            className="aspect-square rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center relative group shadow-sm border border-black/5 dark:border-white/5"
        >
            {src ? (
                <img src={src} alt={label} className="w-3/5 h-3/5 object-contain" />
            ) : (
                <span className="text-xs font-bold">{label[0]}</span>
            )}

            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium bg-black/80 text-white px-2 py-1 rounded pointer-events-none whitespace-nowrap backdrop-blur-sm">
                {label}
            </div>
        </motion.div>
    );
}
