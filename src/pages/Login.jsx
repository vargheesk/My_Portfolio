import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { FlickeringGrid } from "../components/magicui/flickering-grid";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            navigate("/admin"); // Redirect to admin dashboard
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
            <div className="absolute inset-0 z-0">
                <FlickeringGrid
                    className="size-full"
                    squareSize={4}
                    gridGap={6}
                    color="#6B7280"
                    maxOpacity={0.5}
                    flickerChance={0.1}
                />
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10 bg-white text-black border border-gray-200 p-8 shadow-lg rounded-lg mx-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold uppercase tracking-tighter">Admin Access</h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-widest mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border border-gray-300 p-3 focus:outline-none focus:border-black rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold uppercase tracking-widest mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border border-gray-300 p-3 focus:outline-none focus:border-black rounded-md"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-black text-white font-bold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-md"
                    >
                        {loading ? "Verifying..." : "Enter System"}
                    </button>
                </form>
            </div>
        </div>
    );
}
