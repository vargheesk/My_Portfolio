import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "@studio-freight/lenis";
import Navbar from "./Navbar";
import DockNavigation from "./DockNavigation";
import Noise from "./Noise";

export default function Layout({ children }) {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith("/admin");

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
            {!isAdmin && <Navbar />}
            <main>{children}</main>
            {!isAdmin && <DockNavigation />}

            <footer className="relative py-8 pb-32 text-center text-sm bg-black text-white/40 uppercase tracking-widest border-t border-white/10 overflow-hidden">
                <Noise patternAlpha={15} />
                <span className="relative z-10">© {new Date().getFullYear()} Vargheeskutty Eldhose. All rights reserved.</span>
            </footer>
        </div>
    );
}

