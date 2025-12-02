import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes

export default function SessionTimeout() {
    const navigate = useNavigate();
    const timerRef = useRef(null);

    useEffect(() => {
        const resetTimer = () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(handleLogout, TIMEOUT_DURATION);
        };

        const handleLogout = async () => {
            await supabase.auth.signOut();
            navigate("/login"); // Redirect to login or home
        };

        // Events to listen for
        const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];

        // Attach listeners
        events.forEach((event) => {
            document.addEventListener(event, resetTimer);
        });

        // Initialize timer
        resetTimer();

        // Cleanup
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach((event) => {
                document.removeEventListener(event, resetTimer);
            });
        };
    }, [navigate]);

    return null; // This component doesn't render anything
}
