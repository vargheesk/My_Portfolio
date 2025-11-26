import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LightRays } from "./ui/light-rays";

const parseMarkup = (text) => {
    if (!text) return null;

    const parts = [];
    let currentText = "";
    let isBold = false;
    let isItalic = false;
    let isRed = false;

    const flush = () => {
        if (currentText) {
            parts.push({
                text: currentText,
                bold: isBold,
                italic: isItalic,
                red: isRed
            });
            currentText = "";
        }
    };

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '<') {
            flush();
            isBold = true;
        } else if (char === '>') {
            flush();
            isBold = false;
        } else if (char === '*') {
            flush();
            isItalic = !isItalic;
        } else if (char === '[') {
            flush();
            isRed = true;
        } else if (char === ']') {
            flush();
            isRed = false;
        } else {
            currentText += char;
        }
    }
    flush();

    return parts.map((part, index) => {
        const classes = [
            part.bold ? "font-bold" : "", // Bold for < >
            part.italic ? "italic" : "",
            part.red ? "text-red-600" : "",
        ].filter(Boolean).join(" ");

        return (
            <span key={index} className={classes}>
                {part.text}
            </span>
        );
    });
};

function HeroSection({ content, title, animation }) {
    return (
        <section className="relative overflow-hidden text-center min-h-[80vh] flex flex-col justify-center items-center bg-background">
            <LightRays color="rgba(251, 213, 213, 0.09)" count={15} blur={15} />
            <div className="relative z-10 max-w-5xl mx-auto px-4">
                <motion.h1
                    {...animation}
                    transition={{ delay: 0.5, duration: 1, ease: ['easeInOut'] }}
                    className="text-4xl md:text-6xl lg:text-7xl font-medium leading-tight tracking-tightest mb-6"
                >
                    {parseMarkup(content)}
                </motion.h1>
                {title && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 1, ease: ['easeInOut'] }}
                        className="text-xl md:text-2xl tracking-widest uppercase"
                    >
                        {parseMarkup(title)}
                    </motion.p>
                )}
            </div>
        </section>
    )
}

export default HeroSection;
