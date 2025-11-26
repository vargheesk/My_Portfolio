import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const formData = new FormData(e.target);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
        };

        try {
            // 1. Save to Supabase
            const { error } = await supabase.from("messages").insert([data]);
            if (error) throw error;

            // 2. Send Email via FormSubmit.co (AJAX)
            await fetch("https://formsubmit.co/ajax/Vargheeskutty007@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    message: data.message,
                    _subject: "New Portfolio Contact Message",
                })
            });

            setStatus("success");
            e.target.reset();
        } catch (error) {
            console.error("Error sending message:", error);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-8">
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-bold uppercase tracking-widest">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-foreground transition-colors rounded-none"
                    placeholder="YOUR NAME"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold uppercase tracking-widest">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-foreground transition-colors rounded-none"
                    placeholder="YOUR@EMAIL.COM"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-bold uppercase tracking-widest">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-foreground transition-colors resize-none rounded-none"
                    placeholder="TELL ME ABOUT YOUR PROJECT..."
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-foreground text-background font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
            >
                {loading ? "SENDING..." : "SEND MESSAGE"}
            </button>

            {status === "success" && (
                <div className="p-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-center text-sm font-medium">
                    MESSAGE SENT SUCCESSFULLY. I'LL GET BACK TO YOU SOON.
                </div>
            )}
            {status === "error" && (
                <div className="p-4 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 text-center text-sm font-medium">
                    SOMETHING WENT WRONG. PLEASE TRY AGAIN.
                </div>
            )}
        </form>
    );
}
