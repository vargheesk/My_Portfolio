import { motion } from "framer-motion";

export default function AntiGravityHero({ name, title }) {
    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-background overflow-hidden">
            <div className="z-10 text-center px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-6xl md:text-9xl font-bold tracking-tighter mb-6 uppercase"
                >
                    {name}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-xl md:text-2xl text-red-600 tracking-widest uppercase"
                >
                    {title}
                </motion.p>
            </div>

            {/* Subtle background gradient/glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-foreground/5 rounded-full blur-3xl" />
            </div>
        </div>
    );
}
