import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-6 py-4 mix-blend-difference text-white"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link to="/" className="text-xl font-bold tracking-tighter">
                Vargheeskutty.

            </Link>
            <div className="flex gap-6">
                <Link to="/about" className="text-sm font-medium uppercase tracking-widest hover:text-gray-400 transition-colors">
                    About
                </Link>
                <Link to="/skills" className="text-sm font-medium uppercase tracking-widest hover:text-gray-400 transition-colors">
                    Skills
                </Link>
            </div>

        </motion.nav>
    );
}
