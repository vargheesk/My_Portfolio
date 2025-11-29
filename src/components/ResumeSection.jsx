import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import LogoLoop from "./LogoLoop";

function ProximityText({ mouseX, children }) {
    const ref = useRef(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const weightSync = useTransform(distance, [-150, 0, 150], [400, 700, 400]);
    const weight = useSpring(weightSync, { mass: 0.1, stiffness: 150, damping: 12 });

    const scaleSync = useTransform(distance, [-150, 0, 150], [1, 1.3, 1]);
    const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 150, damping: 12 });

    const opacitySync = useTransform(distance, [-150, 0, 150], [0.5, 1, 0.5]);
    const opacity = useSpring(opacitySync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <motion.span
            ref={ref}
            style={{ fontWeight: weight, scale, opacity }}
            className="text-4xl md:text-6xl uppercase tracking-tighter mx-4 font-sans inline-block font-bold"
        >
            {children}
        </motion.span>
    );
}

export default function ResumeSection({ resumeUrl }) {
    const mouseX = useMotionValue(Infinity);

    const textItem = {
        node: (
            <ProximityText mouseX={mouseX}>
                See My Resume
            </ProximityText>
        )
    };

    const items = Array(8).fill(textItem);

    return (
        <section
            className="relative py-4 mb-20 bg-background border-y border-border overflow-hidden"
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
        >
            <div className="flex flex-col gap-0">
                <LogoLoop
                    logos={items}
                    direction="left"
                    speed={50}
                    pauseOnHover={false}
                    logoHeight={50}
                    gap={0}
                    fadeOut={true}
                />
                <LogoLoop
                    logos={items}
                    direction="right"
                    speed={50}
                    pauseOnHover={false}
                    logoHeight={50}
                    gap={0}
                    fadeOut={true}
                />
                <LogoLoop
                    logos={items}
                    direction="left"
                    speed={50}
                    pauseOnHover={false}
                    logoHeight={50}
                    gap={0}
                    fadeOut={true}
                />
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <a
                    href={resumeUrl}
                    target="_blank"
                    className="pointer-events-auto flex flex-col items-center group transform transition-transform hover:scale-110 duration-300"
                >
                    <img
                        src="/resume_sticker.png"
                        alt="Download Resume"
                        className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-300"
                    />
                    <span className="mt-2 px-3 py-1 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                        Click to Download
                    </span>
                </a>
            </div>
        </section>
    );
}
