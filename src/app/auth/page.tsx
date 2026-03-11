"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/checkout");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        // If email confirmation is off, the user is logged in automatically.
        if (data.session) {
          router.push("/checkout");
        } else {
          // Fallback just in case they leave it on
          alert("Account created! (If you didn't receive an email, tell Basel to turn off Email Confirmation)");
          setIsLogin(true);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border p-8 rounded-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl font-bold text-white uppercase tracking-tight mb-2">
            {isLogin ? "Welcome Back" : "Join Enactus"}
          </h1>
          <p className="text-secondary text-sm uppercase tracking-widest">
            {isLogin ? "Login to your account" : "Create a new account"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-4 rounded mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-[10px] font-heading font-bold text-secondary uppercase tracking-[0.2em] mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border p-4 pl-12 text-white focus:border-primary outline-none transition-colors rounded-xl"
                placeholder="basel@enactus.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-heading font-bold text-secondary uppercase tracking-[0.2em] mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border p-4 pl-12 text-white focus:border-primary outline-none transition-colors rounded-xl"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-black font-heading font-bold uppercase tracking-wider text-sm hover:bg-primary/90 transition-all rounded-xl flex items-center justify-center gap-2 group"
          >
            {loading ? "Processing..." : (
              <>
                {isLogin ? "Login" : "Sign Up"}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-secondary hover:text-white text-xs uppercase tracking-widest transition-colors"
          >
            {isLogin ? (
              <>Don&apos;t have an account? <span className="text-primary font-bold">Sign Up</span></>
            ) : (
              <>Already have an account? <span className="text-primary font-bold">Login</span></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
