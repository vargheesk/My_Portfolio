import { useRef, useMemo, memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { vibrate } from "../utils/haptics";

function ResumeSection({ resumeUrl }) {
    const container = useRef();
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end start"],
    });

    // Memoize slide configurations to prevent re-creation on every render
    const slideConfigs = useMemo(() => [
        { direction: "left", left: "-15%", speed: 100 },
        { direction: "right", left: "-25%", speed: 50 },
        { direction: "left", left: "-15%", speed: 75 },
        { direction: "right", left: "-15%", speed: 150 },
        { direction: "left", left: "-10%", speed: 30 },
    ], []);

    // Don't render if no resume URL
    if (!resumeUrl) return null;

    return (
        <section className="bg-white dark:bg-black py-12 text-black dark:text-white text-4xl/8 font-black flex flex-col items-center tracking-tighter relative overflow-hidden font-geist">
            <div
                ref={container}
                className="w-full flex flex-col gap-0"
                style={{
                    maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
                }}
            >
                {slideConfigs.map((config, index) => (
                    <Slide
                        key={index}
                        direction={config.direction}
                        left={config.left}
                        progress={scrollYProgress}
                        speed={config.speed}
                    />
                ))}
            </div>
            <p className="!text-lg/4 font-normal tracking-normal mt-8 text-black/60 dark:text-white/60">
                ( Click to download )
            </p>
            <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center"
            >
                <motion.img
                    src="/resume_sticker.png"
                    alt="Download Resume"
                    className="scale-110 w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl"
                    style={{ willChange: "transform" }}
                    whileHover={{
                        rotate: [0, -10, 10, -10, 10, 0],
                        transition: { duration: 0.5 }
                    }}
                    onClick={() => vibrate(30)}
                />
            </a>
        </section>
    );
}

// Memoized Slide component to prevent unnecessary re-renders
const Slide = memo(({ direction, left, progress, speed }) => {
    const dir = direction === "left" ? -1 : 1;
    const translateX = useTransform(progress, [0, 1], [150 * dir, -speed * dir]);

    // Memoize phrases array
    const phrases = useMemo(() => [...Array(10)].map((_, i) => <Phrase key={i} />), []);

    return (
        <motion.div
            style={{
                x: translateX,
                left,
                willChange: "transform",
                transform: "translateZ(0)" // Force GPU acceleration
            }}
            className="relative flex whitespace-nowrap"
        >
            {phrases}
        </motion.div>
    );
});

Slide.displayName = "Slide";

// Memoized Phrase component - static content
const Phrase = memo(() => (
    <div className="px-3 gap-5 flex items-center">
        <p className="flex items-baseline">
            SEE MY RESUME
            <span className="w-2 h-2 bg-red-500 rounded-full inline-block ml-1" />
        </p>
    </div>
));

Phrase.displayName = "Phrase";

export default ResumeSection;
