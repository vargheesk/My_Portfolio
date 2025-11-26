import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Alive() {
    const [status, setStatus] = useState("Checking...");

    useEffect(() => {
        async function wakeUp() {
            try {
                // Simple query to wake up the database
                const { error } = await supabase.from("profile").select("id").limit(1);
                if (error) throw error;
                setStatus("Supabase is awake! 🟢");
            } catch (err) {
                console.error(err);
                setStatus("Error waking up Supabase 🔴");
            }
        }

        wakeUp();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white font-mono">
            {status}
        </div>
    );
}
