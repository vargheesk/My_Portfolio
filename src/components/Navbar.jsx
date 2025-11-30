import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { vibrate } from "../utils/haptics";

export default function Navbar() {
    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-6 py-4 mix-blend-difference text-white"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link
                to="/"
                className="text-xl font-bold tracking-tighter"
                onClick={() => vibrate(30)}
            >
                Vargheeskutty.
            </Link>
            <div className="flex gap-6">
                {/* Links removed as per request */}
            </div>
        </motion.nav>
    );
}
