import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { vibrate } from "../utils/haptics";

function ResumeSection({ resumeUrl }) {
    const container = useRef();
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end start"],
    });

    return (
        <section className=" bg-white py-12 text-black text-4xl/8 font-black flex flex-col items-center tracking-tighter relative overflow-hidden font-geist">
            <div
                ref={container}
                className="w-full flex flex-col gap-0"
                style={{
                    maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
                }}
            >
                <Slide
                    direction={"left"}
                    left={"-15%"}
                    progress={scrollYProgress}
                    speed={100}
                />
                <Slide
                    direction={"right"}
                    left={"-25%"}
                    progress={scrollYProgress}
                    speed={50}
                />
                <Slide
                    direction={"left"}
                    left={"-15%"}
                    progress={scrollYProgress}
                    speed={75}
                />
                <Slide
                    direction={"right"}
                    left={"-15%"}
                    progress={scrollYProgress}
                    speed={150}
                />
                <Slide
                    direction={"left"}
                    left={"-10%"}
                    progress={scrollYProgress}
                    speed={30}
                />
            </div>
            <p className="!text-lg/4 font-normal tracking-normal mt-8">
                ( Click to download )
            </p>
            <a href={resumeUrl} target="_blank" className="absolute inset-0 flex items-center justify-center">
                <motion.img
                    src="/resume_sticker.png"
                    alt="Download Resume"
                    className="scale-110 w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl"
                    whileHover={{
                        rotate: [0, -10, 10, -10, 10, 0],
                        transition: { duration: 0.5 }
                    }}
                    onClick={() => vibrate(50)}
                />
            </a>
        </section>
    );
}

const Slide = (props) => {
    const direction = props.direction === "left" ? -1 : 1;
    const translateX = useTransform(props.progress, [0, 1], [
        150 * direction,
        -props.speed * direction,
    ]);

    return (
        <motion.div
            style={{ x: translateX, left: props.left }}
            className="relative flex whitespace-nowrap"
        >
            <Phrase />
            <Phrase />
            <Phrase />
            <Phrase />
            <Phrase />
            <Phrase />
            <Phrase />
            <Phrase />
            <Phrase />
            <Phrase />
        </motion.div>
    );
};

const Phrase = () => {
    return (
        <div className={"px-3 gap-2 flex items-center"}>
            <p className="flex items-baseline">SEE MY RESUME<span className="w-2 h-2 bg-red-500 rounded-full inline-block ml-1"></span></p>
            <p className="hidden lg:flex items-baseline">SEE MY RESUME<span className="w-2 h-2 bg-red-500 rounded-full inline-block ml-1"></span></p>
            <p className="hidden lg:flex items-baseline">SEE MY RESUME<span className="w-2 h-2 bg-red-500 rounded-full inline-block ml-1"></span></p>
        </div>
    );
};

export default ResumeSection;
